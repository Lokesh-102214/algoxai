/**
 * Glob Tool: Fast file pattern finder.
 */

import * as fs from 'fs';
import * as path from 'path';
import { HarnessTool, ExecutionContext, resolveWorkspacePath, createToolSuccess, createToolError } from './base';
import { ToolDefinition, ToolResult } from '../types';

export const globDefinition: ToolDefinition = {
  name: 'glob',
  description: 'Search for files matching a pattern (e.g., "**/*.test.ts", "src/**/*.tsx", "*.json").',
  parameters: {
    type: 'object',
    properties: {
      pattern: {
        type: 'string',
        description: 'Glob or file pattern to match (e.g., "**/*.ts")',
      },
      path: {
        type: 'string',
        description: 'Optional subfolder to start search in (default: project root)',
      },
    },
    required: ['pattern'],
  },
  examples: [
    {
      input: { pattern: '**/*.test.ts' },
      explanation: 'Finds all test files in the project',
    },
  ],
};

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next']);

function globToRegex(glob: string): RegExp {
  let regexStr = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape regex special chars except * and ?
    .replace(/\*\*/g, '.*')               // ** matches anything including slashes
    .replace(/(?<!\.)\*/g, '[^/\\\\]*')   // single * matches anything except slashes
    .replace(/\?/g, '[^/\\\\]');

  return new RegExp(`^${regexStr}$`, 'i');
}

export class GlobTool implements HarnessTool {
  public definition = globDefinition;

  public async execute(args: Record<string, unknown>, context: ExecutionContext): Promise<ToolResult> {
    const rawPattern = String(args.pattern || '').trim();
    if (!rawPattern) return createToolError(context.toolCallId, 'glob', 'Missing "pattern" parameter');

    const subPath = String(args.path || '.');
    const regex = globToRegex(rawPattern);

    try {
      const searchRoot = resolveWorkspacePath(subPath, context.workspaceRoot);
      if (!fs.existsSync(searchRoot)) {
        return createToolError(context.toolCallId, 'glob', `Path does not exist: "${subPath}"`);
      }

      const results: string[] = [];
      const maxResults = 200;

      const walk = (dir: string) => {
        if (results.length >= maxResults) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          if (results.length >= maxResults) break;
          const full = path.join(dir, entry.name);
          const rel = path.relative(context.workspaceRoot, full).replace(/\\/g, '/');

          if (entry.isDirectory()) {
            if (!IGNORED_DIRS.has(entry.name)) {
              if (regex.test(rel)) {
                results.push(rel + '/');
              }
              walk(full);
            }
          } else {
            if (regex.test(rel) || regex.test(entry.name)) {
              results.push(rel);
            }
          }
        }
      };

      walk(searchRoot);

      if (results.length === 0) {
        return createToolSuccess(context.toolCallId, 'glob', `No files matched pattern "${rawPattern}" in ${subPath}`);
      }

      results.sort();
      const output = results.join('\n');
      const suffix = results.length >= maxResults ? `\n... (Reached limit of ${maxResults} matches)` : '';

      return createToolSuccess(
        context.toolCallId,
        'glob',
        `Found ${results.length} files matching "${rawPattern}":\n${output}${suffix}`
      );
    } catch (err: unknown) {
      return createToolError(context.toolCallId, 'glob', err instanceof Error ? err.message : String(err));
    }
  }
}
