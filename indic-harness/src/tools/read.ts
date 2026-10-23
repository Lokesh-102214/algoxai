/**
 * Read Tool: Reads file content with optional line offset & limit.
 */

import * as fs from 'fs';
import { HarnessTool, ExecutionContext, resolveWorkspacePath, createToolSuccess, createToolError } from './base';
import { ToolDefinition, ToolResult } from '../types';

export const readDefinition: ToolDefinition = {
  name: 'read',
  description: 'Read the contents of a file. Optionally provide start_line and line_count for pagination.',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Relative path to the file to read (e.g., "src/index.ts")',
      },
      start_line: {
        type: 'number',
        description: 'Optional 1-based start line number to begin reading from',
      },
      line_count: {
        type: 'number',
        description: 'Optional number of lines to read (defaults to all or max 200)',
      },
    },
    required: ['path'],
  },
  examples: [
    {
      input: { path: 'package.json', start_line: 1, line_count: 20 },
      explanation: 'Reads the first 20 lines of package.json',
    },
  ],
};

export class ReadTool implements HarnessTool {
  public definition = readDefinition;

  public async execute(args: Record<string, unknown>, context: ExecutionContext): Promise<ToolResult> {
    const rawPath = String(args.path || args.file_path || '');
    if (!rawPath) return createToolError(context.toolCallId, 'read', 'Missing "path" parameter');

    try {
      const fullPath = resolveWorkspacePath(rawPath, context.workspaceRoot);
      if (!fs.existsSync(fullPath)) {
        return createToolError(context.toolCallId, 'read', `File does not exist: "${rawPath}"`);
      }

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        return createToolError(context.toolCallId, 'read', `Path is a directory, not a file: "${rawPath}"`);
      }

      const rawContent = fs.readFileSync(fullPath, 'utf8');
      const lines = rawContent.split(/\r?\n/);
      const totalLines = lines.length;

      const startLine = Math.max(1, Number(args.start_line) || 1);
      const lineCount = Math.max(1, Number(args.line_count) || (args.start_line ? 100 : totalLines));

      const selected = lines.slice(startLine - 1, startLine - 1 + lineCount);
      const formatted = selected
        .map((line, idx) => `${String(startLine + idx).padStart(5, ' ')}: ${line}`)
        .join('\n');

      const header = `File: ${rawPath} (${totalLines} total lines, showing lines ${startLine} to ${Math.min(
        totalLines,
        startLine + selected.length - 1
      )})\n---\n`;

      return createToolSuccess(context.toolCallId, 'read', header + formatted);
    } catch (err: unknown) {
      return createToolError(context.toolCallId, 'read', err instanceof Error ? err.message : String(err));
    }
  }
}
