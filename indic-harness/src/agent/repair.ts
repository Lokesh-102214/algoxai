/**
 * Tool-Call Repair Layer
 * Heuristically repairs malformed JSON tool calls emitted by Indic / smaller models.
 * Handles markdown fences, trailing commas, unescaped newlines, and single quotes.
 */

import { ToolCall } from '../types';

export interface RepairResult {
  success: boolean;
  parsed: Record<string, unknown>;
  repairedString: string;
  error?: string;
}

/**
 * Extracts JSON substring from text that might contain markdown fences or surrounding chatter.
 */
export function extractJsonCandidate(raw: string): string {
  let cleaned = raw.trim();

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\r?\n?/, '').replace(/\r?\n?```$/, '').trim();
  }

  // Look for first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

/**
 * Applies heuristic repairs to common JSON syntax errors.
 */
export function sanitizeJsonString(raw: string): string {
  let candidate = extractJsonCandidate(raw);

  // 1. Remove trailing commas before closing braces/brackets (e.g. `{"a": 1, }` -> `{"a": 1}`)
  candidate = candidate.replace(/,\s*([}\]])/g, '$1');

  // 2. Fix unquoted keys (e.g. `{ path: "foo" }` -> `{ "path": "foo" }`)
  candidate = candidate.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

  // 3. Replace single quotes around keys and values with double quotes
  candidate = candidate.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');

  return candidate;
}

/**
 * Parses and repairs tool arguments.
 */
export function repairToolCallArguments(rawArgs: string | Record<string, unknown>): RepairResult {
  if (typeof rawArgs === 'object' && rawArgs !== null) {
    // If it has a special _raw field from provider
    if (typeof rawArgs._raw === 'string') {
      return repairToolCallArguments(rawArgs._raw);
    }
    return {
      success: true,
      parsed: rawArgs as Record<string, unknown>,
      repairedString: JSON.stringify(rawArgs),
    };
  }

  const str = String(rawArgs || '').trim();
  if (!str || str === '{}') {
    return { success: true, parsed: {}, repairedString: '{}' };
  }

  // Attempt 1: Direct JSON.parse
  try {
    const direct = JSON.parse(str);
    if (typeof direct === 'object' && direct !== null) {
      return { success: true, parsed: direct, repairedString: str };
    }
  } catch {
    // Fall through to repair heuristics
  }

  // Attempt 2: Extract candidate & sanitize
  const sanitized = sanitizeJsonString(str);
  try {
    const repaired = JSON.parse(sanitized);
    if (typeof repaired === 'object' && repaired !== null) {
      return { success: true, parsed: repaired, repairedString: sanitized };
    }
  } catch {
    // Fall through to unescaped newline repair
  }

  // Attempt 3: Escape literal unescaped newlines inside quotes
  try {
    const newlineFixed = sanitized.replace(/(?<=:\s*"[^"]*)\n(?=[^"]*")/g, '\\n');
    const repaired = JSON.parse(newlineFixed);
    if (typeof repaired === 'object' && repaired !== null) {
      return { success: true, parsed: repaired, repairedString: newlineFixed };
    }
  } catch (err: unknown) {
    return {
      success: false,
      parsed: {},
      repairedString: sanitized,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  return {
    success: false,
    parsed: {},
    repairedString: sanitized,
    error: 'Failed to repair malformed JSON arguments',
  };
}

/**
 * Inspects assistant message content for embedded function calls if the model
 * output tool calls as text tags instead of native API tool_calls.
 */
export function extractTextBasedToolCalls(content: string): ToolCall[] {
  const toolCalls: ToolCall[] = [];
  if (!content) return toolCalls;

  // Pattern 1: <tool_call>{"name": "read", "arguments": {...}}</tool_call>
  const tagRegex = /<tool_call>([\s\S]*?)<\/tool_call>/gi;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(content)) !== null) {
    const block = match[1].trim();
    const repair = repairToolCallArguments(block);
    if (repair.success && repair.parsed.name) {
      toolCalls.push({
        id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: String(repair.parsed.name),
        arguments: (repair.parsed.arguments as Record<string, unknown>) || {},
        rawArguments: block,
      });
    }
  }

  // Pattern 2: <function=name>{arguments}</function> or <tool name="name">{arguments}</tool>
  const fnTagRegex = /<(?:function=|tool\s+name=)(?:["']?)([a-zA-Z0-9_]+)(?:["']?)>([\s\S]*?)<\/(?:function|tool)>/gi;
  let fnMatch: RegExpExecArray | null;

  while ((fnMatch = fnTagRegex.exec(content)) !== null) {
    const toolName = fnMatch[1].trim();
    const argsBlock = fnMatch[2].trim();
    const repair = repairToolCallArguments(argsBlock);
    toolCalls.push({
      id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: toolName,
      arguments: repair.success ? repair.parsed : {},
      rawArguments: argsBlock,
    });
  }

  return toolCalls;
}
