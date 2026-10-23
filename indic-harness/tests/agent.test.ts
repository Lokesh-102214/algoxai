import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { AgentLoop } from '../src/agent/loop';
import { MockProvider } from '../src/providers/mock';
import { ToolRegistry } from '../src/tools';
import { AgentConfig } from '../src/types';

describe('Autonomous Agent Loop', () => {
  let tempDir: string;
  let mockProvider: MockProvider;
  let tools: ToolRegistry;
  let baseConfig: AgentConfig;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness_agent_test_'));
    mockProvider = new MockProvider();
    tools = new ToolRegistry();
    baseConfig = {
      provider: mockProvider,
      model: 'mock-sarvam-30b',
      workspaceRoot: tempDir,
      maxSteps: 5,
      verbose: false,
      language: 'hinglish',
    };
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  it('completes single-turn Q&A without invoking tools', async () => {
    mockProvider.enqueue({
      content: 'Binary search ki time complexity O(log n) hoti hai.',
    });

    const loop = new AgentLoop(baseConfig, tools);
    const result = await loop.run('Binary search ki time complexity kya hai?');

    expect(result.success).toBe(true);
    expect(result.totalSteps).toBe(1);
    expect(result.finalResponse).toContain('O(log n)');
    expect(result.toolExecutions.length).toBe(0);
  });

  it('executes multi-turn tool loop (read -> final response)', async () => {
    const testFile = path.join(tempDir, 'greeting.txt');
    fs.writeFileSync(testFile, 'Hello Indic AI!\n');

    mockProvider.enqueue({
      tool_calls: [
        {
          id: 'call_1',
          name: 'read',
          arguments: { path: 'greeting.txt' },
        },
      ],
    });

    mockProvider.enqueue({
      content: 'Maine greeting.txt read kar li hai, usme "Hello Indic AI!" likha hai.',
    });

    const loop = new AgentLoop(baseConfig, tools);
    const result = await loop.run('greeting.txt padho aur batao kya likha hai');

    expect(result.success).toBe(true);
    expect(result.totalSteps).toBe(2);
    expect(result.toolExecutions.length).toBe(1);
    expect(result.toolExecutions[0].name).toBe('read');
    expect(result.toolExecutions[0].is_error).toBe(false);
    expect(result.finalResponse).toContain('Hello Indic AI!');
  });

  it('auto-repairs malformed JSON arguments during tool calling', async () => {
    mockProvider.enqueue({
      tool_calls: [
        {
          id: 'call_malformed',
          name: 'todo',
          arguments: {},
          rawArguments: '```json\n{ action: "add", task: "Write more tests", }\n```', // trailing comma + unquoted keys + backticks
        },
      ],
    });

    mockProvider.enqueue({
      content: 'Task todo list mein add ho gaya hai.',
    });

    const loop = new AgentLoop(baseConfig, tools);
    const result = await loop.run('Add a task to todo list');

    expect(result.success).toBe(true);
    expect(result.toolExecutions.length).toBe(1);
    expect(result.toolExecutions[0].name).toBe('todo');
    expect(result.toolExecutions[0].is_error).toBe(false);
    expect(result.toolExecutions[0].content).toContain('Added task');
  });

  it('halts safely when reaching maximum allowed steps', async () => {
    const loopingConfig: AgentConfig = {
      ...baseConfig,
      maxSteps: 3,
    };

    // Endless tool loop
    for (let i = 0; i < 5; i++) {
      mockProvider.enqueue({
        tool_calls: [
          {
            id: `call_${i}`,
            name: 'todo',
            arguments: { action: 'list' },
          },
        ],
      });
    }

    const loop = new AgentLoop(loopingConfig, tools);
    const result = await loop.run('Infinite loop check');

    expect(result.success).toBe(false);
    expect(result.totalSteps).toBe(3);
    expect(result.finalResponse).toContain('maximum step limit (3)');
  });
});
