/**
 * Grep Tool: Regex & string search across project files.
 */

import * as fs from 'fs';
import * as path from 'path';
import { HarnessTool, ExecutionContext, resolveWorkspacePath, createToolSuccess, createToolError } from './base';
import { ToolDefinition, ToolResult } from '../types';

export const grepDefinition: ToolDefinition = {
  name: 'grep',
  description:
    'Search for a string or regular expression across text files in the project. Returns matching file paths, line numbers, and lines.',
  parameters: {
    type: 'object',
    properties: {
      pattern: {
        type: 'string',
        description: 'The search string or regular expression pattern',
      },
      path: {
        type: 'string',
        description: 'Optional subfolder or file to limit search to (default: whole project)',
      },
      case_sensitive: {
        type: 'boolean',
        description: 'Whether search should be case sensitive (default: false)',
      },
    },
    required: ['pattern'],
  },
  examples: [
    {
      input: { pattern: 'bubbleSortSteps', path: 'src' },
      explanation: 'Finds all occurrences of bubbleSortSteps in src/',
    },
  ],
};

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.vscode', '.idea']);
const IGNORED_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.tar', '.gz', '.woff', '.woff2', '.ttf',
]);

export class GrepTool implements HarnessTool {
  public definition = grepDefinition;

  public async execute(args: Record<string, unknown>, context: ExecutionContext): Promise<ToolResult> {
    const rawPattern = String(args.pattern || '');
    if (!rawPattern) return createToolError(context.toolCallId, 'grep', 'Missing "pattern" parameter');

    const subPath = String(args.path || '.');
    const caseSensitive = Boolean(args.case_sensitive);

    let regex: RegExp;
    try {
      regex = new RegExp(rawPattern, caseSensitive ? 'g' : 'gi');
    } catch {
      // Escape if invalid regex
      const escaped = rawPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
    }

    try {
      const searchRoot = resolveWorkspacePath(subPath, context.workspaceRoot);
      if (!fs.existsSync(searchRoot)) {
        return createToolError(context.toolCallId, 'grep', `Path does not exist: "${subPath}"`);
      }

      const matches: Array<{ file: string; line: number; text: string }> = [];
      const maxMatches = 150;

      const scanDirectory = (dir: string) => {
        if (matches.length >= maxMatches) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          if (matches.length >= maxMatches) break;
          const full = path.join(dir, entry.name);
          const rel = path.relative(context.workspaceRoot, full);

          if (entry.isDirectory()) {
            if (!IGNORED_DIRS.has(entry.name)) {
              scanDirectory(full);
            }
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (IGNORED_EXTS.has(ext)) continue;

            try {
              const content = fs.readFileSync(full, 'utf8');
              const lines = content.split(/\r?\n/);

              lines.forEach((lineText, idx) => {
                if (matches.length >= maxMatches) return;
                regex.lastIndex = 0;
                if (regex.test(lineText)) {
                  matches.push({
                    file: rel.replace(/\\/g, '/'),
                    line: idx + 1,
                    text: lineText.trim(),
                  });
                }
              });
            } catch {
              // Skip binary or unreadable files
            }
          }
        }
      };

      const stat = fs.statSync(searchRoot);
      if (stat.isFile()) {
        const content = fs.readFileSync(searchRoot, 'utf8');
        const lines = content.split(/\r?\n/);
        const rel = path.relative(context.workspaceRoot, searchRoot).replace(/\\/g, '/');
        lines.forEach((lineText, idx) => {
          regex.lastIndex = 0;
          if (regex.test(lineText)) {
            matches.push({ file: rel, line: idx + 1, text: lineText.trim() });
          }
        });
      } else {
        scanDirectory(searchRoot);
      }

      if (matches.length === 0) {
        return createToolSuccess(context.toolCallId, 'grep', `No matches found for "${rawPattern}" in ${subPath}`);
      }

      const formatted = matches.map((m) => `${m.file}:${m.line}: ${m.text}`).join('\n');
      const suffix = matches.length >= maxMatches ? `\n... (Reached limit of ${maxMatches} matches)` : '';

      return createToolSuccess(
        context.toolCallId,
        'grep',
        `Found ${matches.length} matches for "${rawPattern}":\n${formatted}${suffix}`
      );
    } catch (err: unknown) {
      return createToolError(context.toolCallId, 'grep', err instanceof Error ? err.message : String(err));
    }
  }
}
