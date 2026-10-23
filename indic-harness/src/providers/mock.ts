/**
 * Deterministic Mock Provider for Testing & Offline Evaluation
 */

import { ModelProvider, ProviderRequestOptions, ProviderResponse, ToolCall } from '../types';

export interface MockScriptItem {
  content?: string;
  tool_calls?: ToolCall[];
  rawMalformedJson?: string;
}

export class MockProvider implements ModelProvider {
  public name = 'mock';
  public defaultModel = 'mock-sarvam-30b';
  private responses: MockScriptItem[] = [];
  private callCount = 0;

  constructor(responses: MockScriptItem[] = []) {
    this.responses = responses;
  }

  public enqueue(response: MockScriptItem): void {
    this.responses.push(response);
  }

  public reset(): void {
    this.responses = [];
    this.callCount = 0;
  }

  public getCallCount(): number {
    return this.callCount;
  }

  public async chat(options: ProviderRequestOptions): Promise<ProviderResponse> {
    this.callCount++;

    if (this.responses.length > 0) {
      const next = this.responses.shift()!;
      return {
        content: next.content || '',
        tool_calls: next.tool_calls,
        finish_reason: next.tool_calls ? 'tool_calls' : 'stop',
        rawJson: next.rawMalformedJson,
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
      };
    }

    // Default auto-responder
    const lastUserMsg = [...options.messages].reverse().find((m) => m.role === 'user');
    const userText = lastUserMsg?.content || '';

    return {
      content: `[Mock Sarvam] Main aapka prompt samajh gaya: "${userText}". Kaam poora ho gaya!`,
      finish_reason: 'stop',
      usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
    };
  }
}
