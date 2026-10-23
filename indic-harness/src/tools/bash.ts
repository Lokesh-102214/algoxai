/**
 * Bash Tool: Shell execution with safety guardrails & output truncation.
 */

import { exec } from 'child_process';
import { HarnessTool, ExecutionContext, createToolSuccess, createToolError } from './base';
import { ToolDefinition, ToolResult } from '../types';

export const bashDefinition: ToolDefinition = {
  name: 'bash',
  description:
    'Execute a shell command inside the workspace directory. Use for running tests, build steps, git commands, and dependency installation.',
  parameters: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'The shell command line string to run (e.g., "npm test", "git status")',
      },
      timeout_ms: {
        type: 'number',
        description: 'Optional execution timeout in milliseconds (default: 30000)',
      },
    },
    required: ['command'],
  },
  examples: [
    {
      input: { command: 'npm test' },
      explanation: 'Runs unit tests in the project',
    },
  ],
};

const DANGEROUS_PATTERNS = [
  /\brm\s+-[rf]*\s+[\/\\]/i,
  /\brm\s+-[rf]*\s+~/i,
  /\bmkfs\b/i,
  /\bdd\s+if=/i,
  /:(){ :|:& };:/,
  />\s*\/dev\/sd[a-z]/i,
  /\bformat\s+[a-z]:/i,
];

export class BashTool implements HarnessTool {
  public definition = bashDefinition;

  public async execute(args: Record<string, unknown>, context: ExecutionContext): Promise<ToolResult> {
    const command = String(args.command || '').trim();
    if (!command) return createToolError(context.toolCallId, 'bash', 'Missing "command" parameter');

    // Security check
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(command)) {
        return createToolError(
          context.toolCallId,
          'bash',
          `Security violation: Command matched dangerous pattern and was blocked: "${command}"`
        );
      }
    }

    const timeout = Math.min(120000, Math.max(1000, Number(args.timeout_ms) || 30000));

    return new Promise((resolve) => {
      exec(
        command,
        {
          cwd: context.workspaceRoot,
          timeout,
          maxBuffer: 4 * 1024 * 1024, // 4MB
          env: { ...process.env, CI: 'true' },
        },
        (error, stdout, stderr) => {
          const out = (stdout || '').trim();
          const err = (stderr || '').trim();
          const exitCode = error ? (typeof error.code === 'number' ? error.code : 1) : 0;

          let combined = '';
          if (out) combined += `STDOUT:\n${out}\n`;
          if (err) combined += `STDERR:\n${err}\n`;
          if (!combined) combined = '(Command finished with no output)\n';

          // Truncate output if excessive (keep first 100 and last 100 lines)
          const lines = combined.split('\n');
          if (lines.length > 250) {
            const head = lines.slice(0, 120).join('\n');
            const tail = lines.slice(-120).join('\n');
            combined = `${head}\n\n... [Truncated ${lines.length - 240} lines of command output] ...\n\n${tail}`;
          }

          const summary = `Exit Code: ${exitCode}\n${combined}`;

          if (error && exitCode !== 0) {
            resolve(createToolSuccess(context.toolCallId, 'bash', summary));
          } else {
            resolve(createToolSuccess(context.toolCallId, 'bash', summary));
          }
        }
      );
    });
  }
}
