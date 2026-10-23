/**
 * Write Tool: Creates or overwrites a file with content.
 */

import * as fs from 'fs';
import * as path from 'path';
import { HarnessTool, ExecutionContext, resolveWorkspacePath, createToolSuccess, createToolError } from './base';
import { ToolDefinition, ToolResult } from '../types';

export const writeDefinition: ToolDefinition = {
  name: 'write',
  description: 'Create a new file or completely overwrite an existing file with the provided content.',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Relative path of the file to create or overwrite',
      },
      content: {
        type: 'string',
        description: 'The complete text content to write into the file',
      },
    },
    required: ['path', 'content'],
  },
  examples: [
    {
      input: { path: 'src/utils.ts', content: 'export const add = (a: number, b: number) => a + b;' },
      explanation: 'Writes a utility function to src/utils.ts',
    },
  ],
};

export class WriteTool implements HarnessTool {
  public definition = writeDefinition;

  public async execute(args: Record<string, unknown>, context: ExecutionContext): Promise<ToolResult> {
    const rawPath = String(args.path || args.file_path || '');
    if (!rawPath) return createToolError(context.toolCallId, 'write', 'Missing "path" parameter');

    const content = typeof args.content === 'string' ? args.content : String(args.content ?? '');

    try {
      const fullPath = resolveWorkspacePath(rawPath, context.workspaceRoot);
      const parentDir = path.dirname(fullPath);

      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      fs.writeFileSync(fullPath, content, 'utf8');
      const lines = content.split('\n').length;
      return createToolSuccess(
        context.toolCallId,
        'write',
        `Successfully wrote ${content.length} characters (${lines} lines) to ${rawPath}`
      );
    } catch (err: unknown) {
      return createToolError(context.toolCallId, 'write', err instanceof Error ? err.message : String(err));
    }
  }
}
