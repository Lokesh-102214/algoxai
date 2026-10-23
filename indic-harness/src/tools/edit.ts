/**
 * Edit Tool: Fail-safe exact-string search and replace.
 * Avoids line-number drift. Ensures exact uniqueness before replacement.
 */

import * as fs from 'fs';
import { HarnessTool, ExecutionContext, resolveWorkspacePath, createToolSuccess, createToolError } from './base';
import { ToolDefinition, ToolResult } from '../types';

export const editDefinition: ToolDefinition = {
  name: 'edit',
  description:
    'Replace an exact string in a file with new content. old_string must match uniquely in the file. Include surrounding context lines if needed to ensure uniqueness.',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Relative path of the file to modify',
      },
      old_string: {
        type: 'string',
        description: 'The exact character sequence to find and replace. Must match uniquely.',
      },
      new_string: {
        type: 'string',
        description: 'The replacement string to insert in place of old_string.',
      },
      replace_all: {
        type: 'boolean',
        description: 'Set to true only if you intentionally want to replace every identical occurrence.',
      },
    },
    required: ['path', 'old_string', 'new_string'],
  },
  examples: [
    {
      input: {
        path: 'src/math.ts',
        old_string: 'return a - b;',
        new_string: 'return a + b;',
      },
      explanation: 'Fixes the return statement in src/math.ts',
    },
  ],
};

function normalizeNewlines(str: string): string {
  return str.replace(/\r\n/g, '\n');
}

export class EditTool implements HarnessTool {
  public definition = editDefinition;

  public async execute(args: Record<string, unknown>, context: ExecutionContext): Promise<ToolResult> {
    const rawPath = String(args.path || args.file_path || '');
    if (!rawPath) return createToolError(context.toolCallId, 'edit', 'Missing "path" parameter');

    const oldString = typeof args.old_string === 'string' ? args.old_string : String(args.old_string ?? '');
    const newString = typeof args.new_string === 'string' ? args.new_string : String(args.new_string ?? '');
    const replaceAll = Boolean(args.replace_all);

    if (oldString === '') {
      return createToolError(context.toolCallId, 'edit', 'old_string cannot be empty');
    }

    try {
      const fullPath = resolveWorkspacePath(rawPath, context.workspaceRoot);
      if (!fs.existsSync(fullPath)) {
        return createToolError(context.toolCallId, 'edit', `File does not exist: "${rawPath}"`);
      }

      const originalFileContent = fs.readFileSync(fullPath, 'utf8');

      // Check both raw and normalized newline matching
      let isCrlf = originalFileContent.includes('\r\n');
      let targetContent = originalFileContent;
      let targetOld = oldString;
      let targetNew = newString;

      // First try direct match
      let occurrences = targetContent.split(targetOld).length - 1;

      // If no match, try normalizing newlines in both
      if (occurrences === 0) {
        const normContent = normalizeNewlines(originalFileContent);
        const normOld = normalizeNewlines(oldString);
        occurrences = normContent.split(normOld).length - 1;
        if (occurrences > 0) {
          targetContent = normContent;
          targetOld = normOld;
          targetNew = normalizeNewlines(newString);
          isCrlf = false;
        }
      }

      if (occurrences === 0) {
        return createToolError(
          context.toolCallId,
          'edit',
          `old_string was not found in "${rawPath}". Please re-read the file with the "read" tool to ensure exact whitespace, indentation, and characters.`
        );
      }

      if (occurrences > 1 && !replaceAll) {
        return createToolError(
          context.toolCallId,
          'edit',
          `old_string matches ${occurrences} occurrences in "${rawPath}". It must match uniquely. Please include more surrounding context lines to make old_string unique, or set replace_all: true if intended.`
        );
      }

      let updatedContent: string;
      if (replaceAll) {
        updatedContent = targetContent.split(targetOld).join(targetNew);
      } else {
        const index = targetContent.indexOf(targetOld);
        updatedContent = targetContent.slice(0, index) + targetNew + targetContent.slice(index + targetOld.length);
      }

      if (isCrlf) {
        updatedContent = updatedContent.replace(/\n/g, '\r\n');
      }

      fs.writeFileSync(fullPath, updatedContent, 'utf8');

      return createToolSuccess(
        context.toolCallId,
        'edit',
        `Successfully edited "${rawPath}". Replaced ${replaceAll ? occurrences : 1} occurrence(s).`
      );
    } catch (err: unknown) {
      return createToolError(context.toolCallId, 'edit', err instanceof Error ? err.message : String(err));
    }
  }
}
