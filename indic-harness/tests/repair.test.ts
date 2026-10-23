import { describe, it, expect } from 'vitest';
import { repairToolCallArguments, extractTextBasedToolCalls } from '../src/agent/repair';

describe('Tool-Call Repair Layer', () => {
  describe('repairToolCallArguments', () => {
    it('passes through already valid object arguments', () => {
      const input = { path: 'src/main.ts', line: 10 };
      const res = repairToolCallArguments(input);
      expect(res.success).toBe(true);
      expect(res.parsed).toEqual(input);
    });

    it('parses standard valid JSON string', () => {
      const input = '{"path": "package.json", "start_line": 1}';
      const res = repairToolCallArguments(input);
      expect(res.success).toBe(true);
      expect(res.parsed).toEqual({ path: 'package.json', start_line: 1 });
    });

    it('strips markdown code blocks and backticks', () => {
      const input = '```json\n{\n  "path": "src/search.ts",\n  "pattern": "foo"\n}\n```';
      const res = repairToolCallArguments(input);
      expect(res.success).toBe(true);
      expect(res.parsed).toEqual({ path: 'src/search.ts', pattern: 'foo' });
    });

    it('fixes trailing commas in objects and arrays', () => {
      const input = '{"path": "src/index.ts", "tags": ["a", "b",],}';
      const res = repairToolCallArguments(input);
      expect(res.success).toBe(true);
      expect(res.parsed).toEqual({ path: 'src/index.ts', tags: ['a', 'b'] });
    });

    it('repairs unquoted object keys (common in smaller models)', () => {
      const input = '{ path: "src/app.ts", line_count: 50 }';
      const res = repairToolCallArguments(input);
      expect(res.success).toBe(true);
      expect(res.parsed).toEqual({ path: 'src/app.ts', line_count: 50 });
    });

    it('handles single quoted strings', () => {
      const input = "{ 'path': 'src/app.ts' }";
      const res = repairToolCallArguments(input);
      expect(res.success).toBe(true);
      expect(res.parsed.path).toBe('src/app.ts');
    });

    it('returns clear failure on completely unparseable string', () => {
      const input = 'random non json gibberish without braces';
      const res = repairToolCallArguments(input);
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });
  });

  describe('extractTextBasedToolCalls (Tag Fallback)', () => {
    it('extracts <tool_call> tags when model outputs text instead of function calling API', () => {
      const rawText = `
Main file read kar raha hoon:
<tool_call>
{"name": "read", "arguments": {"path": "src/index.ts"}}
</tool_call>
      `;

      const calls = extractTextBasedToolCalls(rawText);
      expect(calls.length).toBe(1);
      expect(calls[0].name).toBe('read');
      expect(calls[0].arguments.path).toBe('src/index.ts');
    });

    it('extracts function tag syntax <function=name>{args}</function>', () => {
      const rawText = `
Code mein check kar raha hoon:
<function=grep>
{"pattern": "process"}
</function>
      `;

      const calls = extractTextBasedToolCalls(rawText);
      expect(calls.length).toBe(1);
      expect(calls[0].name).toBe('grep');
      expect(calls[0].arguments.pattern).toBe('process');
    });

    it('returns empty array when text has no tool tags', () => {
      const rawText = 'Namaste, main aapki madad kar sakta hoon.';
      const calls = extractTextBasedToolCalls(rawText);
      expect(calls.length).toBe(0);
    });
  });
});
