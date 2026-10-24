import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { PlanModeManager } from '../src/agent/plan-mode';
import { AgentLoop } from '../src/agent/loop';
import { MockProvider } from '../src/providers/mock';
import { ToolRegistry } from '../src/tools';
import { AgentConfig } from '../src/types';

describe('Plan Mode & Safety Guard (Day 4)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness_plan_test_'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  it('allows read-only tools and blocks destructive tools in plan mode', () => {
    const mgr = new PlanModeManager(true);
    expect(mgr.isToolAllowed('read')).toBe(true);
    expect(mgr.isToolAllowed('grep')).toBe(true);
    expect(mgr.isToolAllowed('glob')).toBe(true);
    expect(mgr.isToolAllowed('todo')).toBe(true);

    expect(mgr.isToolAllowed('write')).toBe(false);
    expect(mgr.isToolAllowed('edit')).toBe(false);
    expect(mgr.isToolAllowed('bash')).toBe(false);
  });

  it('generates informative block error instructing agent to formulate a plan with todo', () => {
    const mgr = new PlanModeManager(true);
    const result = mgr.createBlockedResult('call_123', 'edit');
    expect(result.is_error).toBe(true);
    expect(result.content).toContain('PLAN MODE ACTIVE');
    expect(result.content).toContain('todo');
    expect(result.content).toContain('/approve');
  });

  it('blocks edit tool execution in AgentLoop when planMode is enabled', async () => {
    const mockProvider = new MockProvider();
    const tools = new ToolRegistry();

    const config: AgentConfig = {
      provider: mockProvider,
      model: 'mock-sarvam-30b',
      workspaceRoot: tempDir,
      maxSteps: 5,
      verbose: false,
      language: 'hinglish',
      planMode: true,
    };

    const targetFile = path.join(tempDir, 'sample.txt');
    fs.writeFileSync(targetFile, 'original content\n');

    mockProvider.enqueue({
      tool_calls: [
        {
          id: 'call_edit_1',
          name: 'edit',
          arguments: {
            path: 'sample.txt',
            old_string: 'original content',
            new_string: 'modified content',
          },
        },
      ],
    });

    mockProvider.enqueue({
      content: 'Bhai plan mode active hai, isliye pehle plan banaya hai.',
    });

    const loop = new AgentLoop(config, tools);
    const result = await loop.run('Edit sample.txt');

    expect(result.planModeBlocked).toBe(true);
    // File must NOT have been modified
    const fileContent = fs.readFileSync(targetFile, 'utf-8');
    expect(fileContent).toBe('original content\n');

    // Now unblock / approve plan
    loop.setPlanMode(false);
    expect(loop.isPlanMode()).toBe(false);
  });
});
