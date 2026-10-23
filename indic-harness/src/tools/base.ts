/**
 * Base Tool Definition & Path Security Utilities
 */

import * as path from 'path';
import { ToolDefinition, ToolResult } from '../types';

export interface ExecutionContext {
  workspaceRoot: string;
  toolCallId: string;
}

export interface HarnessTool {
  definition: ToolDefinition;
  execute(args: Record<string, unknown>, context: ExecutionContext): Promise<ToolResult>;
}

/**
 * Resolves relative or absolute path against workspace root safely.
 */
export function resolveWorkspacePath(rawPath: string, workspaceRoot: string): string {
  if (!rawPath) throw new Error('Path argument is required');
  const normalized = path.normalize(rawPath);
  const resolved = path.isAbsolute(normalized)
    ? normalized
    : path.resolve(workspaceRoot, normalized);

  const rootResolved = path.resolve(workspaceRoot);
  const relative = path.relative(rootResolved, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path "${rawPath}" resolves outside workspace directory`);
  }
  return resolved;
}

export function createToolSuccess(toolCallId: string, name: string, content: string): ToolResult {
  return {
    tool_call_id: toolCallId,
    name,
    content,
    is_error: false,
  };
}

export function createToolError(toolCallId: string, name: string, error: string): ToolResult {
  return {
    tool_call_id: toolCallId,
    name,
    content: `Error in ${name}: ${error}`,
    is_error: true,
  };
}
