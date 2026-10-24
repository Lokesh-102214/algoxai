import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { loadProjectInstructions, scaffoldBharatMd } from '../src/context/project-file';
import { buildRepoMap, extractSymbolsFromSource } from '../src/context/repo-map';
import { compactHistory, truncateToolOutput } from '../src/agent/compaction';
import { Message } from '../src/types';

describe('Context Management & Memory (Day 4)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness_context_test_'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  describe('Project Instructions Discovery (BHARAT.md / AGENTS.md / CLAUDE.md)', () => {
    it('discovers BHARAT.md in workspace root', () => {
      fs.writeFileSync(path.join(tempDir, 'BHARAT.md'), '# Bharat Agent Rules\nAlways verify tests.\n');
      const res = loadProjectInstructions(tempDir);
      expect(res.found).toBe(true);
      expect(res.filename).toBe('BHARAT.md');
      expect(res.content).toContain('Always verify tests');
    });

    it('falls back to AGENTS.md or CLAUDE.md if BHARAT.md is absent', () => {
      fs.writeFileSync(path.join(tempDir, 'CLAUDE.md'), '# Claude Rules\nUse TypeScript.\n');
      const res = loadProjectInstructions(tempDir);
      expect(res.found).toBe(true);
      expect(res.filename).toBe('CLAUDE.md');
    });

    it('scaffolds BHARAT.md if absent', () => {
      const created = scaffoldBharatMd(tempDir);
      expect(fs.existsSync(created)).toBe(true);
      const content = fs.readFileSync(created, 'utf-8');
      expect(content).toContain('BHARAT.md');
    });
  });

  describe('Repo Symbol Map', () => {
    it('extracts functions, classes, interfaces, and types', () => {
      const code = `
export function calculateSum(a: number, b: number): number { return a + b; }
export class EngineManager { start() {} }
export interface StateConfig { active: boolean; }
export type Status = 'ok' | 'fail';
export const helper = () => {};
`;
      const symbols = extractSymbolsFromSource(code);
      const names = symbols.map((s) => s.name);
      expect(names).toContain('calculateSum');
      expect(names).toContain('EngineManager');
      expect(names).toContain('StateConfig');
      expect(names).toContain('Status');
      expect(names).toContain('helper');
    });

    it('builds a compact repo map text for workspace files', () => {
      const sub = path.join(tempDir, 'src');
      fs.mkdirSync(sub);
      fs.writeFileSync(path.join(sub, 'utils.ts'), 'export function formatData() {}\n');

      const map = buildRepoMap(tempDir);
      expect(map.formattedText).toContain('<repo_map>');
      expect(map.formattedText).toContain('src/utils.ts');
      expect(map.formattedText).toContain('fn formatData');
      expect(map.formattedText).toContain('</repo_map>');
    });
  });

  describe('Context Compaction & Tool Output Truncation', () => {
    it('truncates oversized tool output in the middle', () => {
      const massiveOutput = 'A'.repeat(3000);
      const truncated = truncateToolOutput(massiveOutput, 1000);
      expect(truncated.length).toBeLessThan(1200);
      expect(truncated).toContain('characters truncated to preserve context window');
    });

    it('compacts older turns when message history exceeds limit', () => {
      const messages: Message[] = [
        { role: 'system', content: 'Base system prompt' },
        { role: 'user', content: 'Can you inspect file1?' },
        {
          role: 'assistant',
          content: 'Reading file1',
          tool_calls: [{ id: '1', name: 'read', arguments: { path: 'file1.ts' } }],
        },
        { role: 'tool', name: 'read', tool_call_id: '1', content: 'file1 contents' },
        { role: 'user', content: 'Now inspect file2?' },
        {
          role: 'assistant',
          content: 'Reading file2',
          tool_calls: [{ id: '2', name: 'read', arguments: { path: 'file2.ts' } }],
        },
        { role: 'tool', name: 'read', tool_call_id: '2', content: 'file2 contents' },
        { role: 'user', content: 'Now inspect file3?' },
        {
          role: 'assistant',
          content: 'Reading file3',
          tool_calls: [{ id: '3', name: 'read', arguments: { path: 'file3.ts' } }],
        },
        { role: 'tool', name: 'read', tool_call_id: '3', content: 'file3 contents' },
        { role: 'user', content: 'What is the summary?' },
        { role: 'assistant', content: 'Here is what I found.' },
      ];

      const res = compactHistory(messages, { maxEstimatedTokens: 50, keepRecentMessages: 3 });
      expect(res.summary.compactedTurns).toBeGreaterThan(0);
      const summaryMsg = res.messages.find((m) => m.content.includes('<prior_context_summary>'));
      expect(summaryMsg).toBeDefined();
      expect(summaryMsg?.content).toContain('file1.ts');
    });
  });
});
