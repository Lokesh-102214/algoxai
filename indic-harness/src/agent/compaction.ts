/**
 * Context Compaction & Truncation Layer (Day 4)
 * Manages 64K / 128K context windows for Sarvam AI & Indic LLMs.
 * Truncates oversized past tool outputs and compacts earlier dialogue turns.
 */

import { Message, CompactionSummary } from '../types';

export interface CompactionOptions {
  maxEstimatedTokens?: number;
  keepRecentMessages?: number;
  maxToolOutputChars?: number;
}

/**
 * Fast estimation of token count (~4 characters per token).
 */
export function estimateTokenCount(messages: Message[]): number {
  let chars = 0;
  for (const m of messages) {
    chars += m.content ? m.content.length : 0;
    if (m.tool_calls) {
      for (const tc of m.tool_calls) {
        chars += tc.name.length + JSON.stringify(tc.arguments).length;
      }
    }
  }
  return Math.ceil(chars / 4);
}

/**
 * Truncates an overly long tool output while preserving head and tail.
 */
export function truncateToolOutput(content: string, maxChars = 1800): string {
  if (content.length <= maxChars) return content;

  const half = Math.floor(maxChars / 2);
  const head = content.slice(0, half);
  const tail = content.slice(-half);
  const omitted = content.length - maxChars;

  return `${head}\n\n... [${omitted} characters truncated to preserve context window] ...\n\n${tail}`;
}

/**
 * Compacts message history by truncating older tool responses and rolling older
 * conversational turns into a single high-density summary block.
 */
export function compactHistory(
  messages: Message[],
  options: CompactionOptions = {}
): { messages: Message[]; summary: CompactionSummary } {
  const maxTokens = options.maxEstimatedTokens || 8000;
  const keepRecent = options.keepRecentMessages || 6;
  const maxToolChars = options.maxToolOutputChars || 1500;

  const currentTokens = estimateTokenCount(messages);

  // If under limit, only truncate long past tool messages
  if (currentTokens <= maxTokens && messages.length <= keepRecent + 2) {
    const lightlyCleaned = messages.map((m, idx) => {
      // Don't truncate the very last tool message as it is actively needed
      if (m.role === 'tool' && idx < messages.length - 2) {
        return { ...m, content: truncateToolOutput(m.content, maxToolChars) };
      }
      return m;
    });

    return {
      messages: lightlyCleaned,
      summary: {
        compactedTurns: 0,
        tokensSavedEstimate: 0,
        summaryText: 'Context within limits; no full compaction required.',
      },
    };
  }

  // 1. Separate System message, Older messages, and Recent messages
  const systemMsg = messages[0]?.role === 'system' ? messages[0] : null;
  const startIdx = systemMsg ? 1 : 0;

  if (messages.length - startIdx <= keepRecent) {
    return {
      messages,
      summary: {
        compactedTurns: 0,
        tokensSavedEstimate: 0,
        summaryText: 'Insufficient turns to compact.',
      },
    };
  }

  const splitPoint = messages.length - keepRecent;
  const olderMessages = messages.slice(startIdx, splitPoint);
  const recentMessages = messages.slice(splitPoint);

  // 2. Synthesize older messages into compact memory bullet points
  const touchedFiles = new Set<string>();
  const actionsSummary: string[] = [];

  for (const m of olderMessages) {
    if (m.role === 'user') {
      actionsSummary.push(`- User asked: "${m.content.slice(0, 100)}"`);
    } else if (m.role === 'assistant') {
      if (m.tool_calls && m.tool_calls.length > 0) {
        const toolNames = m.tool_calls.map((t) => t.name).join(', ');
        actionsSummary.push(`- Model called tools: [${toolNames}]`);
        for (const tc of m.tool_calls) {
          if (tc.arguments.path) touchedFiles.add(String(tc.arguments.path));
        }
      }
    } else if (m.role === 'tool') {
      if (m.content.includes('Error in')) {
        actionsSummary.push(`- Tool error occurred: ${m.content.slice(0, 80)}`);
      }
    }
  }

  let summaryBlock = '<prior_context_summary>\n';
  summaryBlock += 'Older conversation history was compacted to stay within the model context window.\n';
  if (touchedFiles.size > 0) {
    summaryBlock += `Files explored/modified: ${Array.from(touchedFiles).join(', ')}\n`;
  }
  summaryBlock += `Key actions recorded:\n${actionsSummary.slice(-8).join('\n')}\n`;
  summaryBlock += '</prior_context_summary>';

  const compactedSummaryMsg: Message = {
    role: 'system',
    content: summaryBlock,
  };

  const newMessages: Message[] = [];
  if (systemMsg) newMessages.push(systemMsg);
  newMessages.push(compactedSummaryMsg);

  // Add recent messages with tool outputs truncated
  for (let i = 0; i < recentMessages.length; i++) {
    const m = recentMessages[i];
    if (m.role === 'tool' && i < recentMessages.length - 2) {
      newMessages.push({ ...m, content: truncateToolOutput(m.content, maxToolChars) });
    } else {
      newMessages.push(m);
    }
  }

  const newTokens = estimateTokenCount(newMessages);
  const tokensSaved = Math.max(0, currentTokens - newTokens);

  return {
    messages: newMessages,
    summary: {
      compactedTurns: olderMessages.length,
      tokensSavedEstimate: tokensSaved,
      summaryText: `Compacted ${olderMessages.length} older messages, saving approx ~${tokensSaved} tokens.`,
    },
  };
}
