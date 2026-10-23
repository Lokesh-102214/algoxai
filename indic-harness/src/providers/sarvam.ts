/**
 * Sarvam AI Provider Implementation
 * Supports sarvam-30b, sarvam-105b via OpenAI-compatible /chat/completions endpoint.
 * Handles both 'api-subscription-key' and 'Authorization: Bearer' headers.
 */

import { ModelProvider, ProviderRequestOptions, ProviderResponse, ToolCall } from '../types';
import { formatToolsForOpenAI } from './base';

export interface SarvamProviderOptions {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  timeoutMs?: number;
}

export class SarvamProvider implements ModelProvider {
  public name = 'sarvam';
  public defaultModel: string;
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;

  constructor(options: SarvamProviderOptions) {
    this.apiKey = options.apiKey || '';
    this.baseUrl = (options.baseUrl || 'https://api.sarvam.ai/v1').replace(/\/+$/, '');
    this.defaultModel = options.defaultModel || 'sarvam-30b';
    this.timeoutMs = options.timeoutMs || 45000;
  }

  public getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'indic-coding-harness/1.0',
    };

    if (this.apiKey) {
      // Sarvam documented header
      headers['api-subscription-key'] = this.apiKey;
      // OpenAI-compatible fallback
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  public async chat(options: ProviderRequestOptions): Promise<ProviderResponse> {
    const endpoint = `${this.baseUrl}/chat/completions`;
    const toolsPayload = formatToolsForOpenAI(options.tools);

    const body: Record<string, unknown> = {
      model: this.defaultModel,
      messages: options.messages.map((m) => {
        const msg: Record<string, unknown> = {
          role: m.role,
          content: m.content,
        };
        if (m.name) msg.name = m.name;
        if (m.tool_call_id) msg.tool_call_id = m.tool_call_id;
        if (m.tool_calls && m.tool_calls.length > 0) {
          msg.tool_calls = m.tool_calls.map((tc) => ({
            id: tc.id,
            type: 'function',
            function: {
              name: tc.name,
              arguments: typeof tc.arguments === 'string' ? tc.arguments : JSON.stringify(tc.arguments),
            },
          }));
        }
        return msg;
      }),
      temperature: options.temperature ?? 0.2,
      max_tokens: options.max_tokens ?? 2048,
    };

    if (toolsPayload && toolsPayload.length > 0) {
      body.tools = toolsPayload;
      body.tool_choice = 'auto';
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Sarvam API error (${response.status} ${response.statusText}): ${errorText || 'No error details'}`
        );
      }

      const json = await response.json();
      return this.parseOpenAIResponse(json);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Sarvam API request timed out after ${this.timeoutMs}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  private parseOpenAIResponse(json: any): ProviderResponse {
    const choice = json.choices?.[0];
    if (!choice) {
      throw new Error(`Invalid response structure from Sarvam API: ${JSON.stringify(json)}`);
    }

    const message = choice.message || {};
    const content = message.content || '';
    const finishReason = choice.finish_reason;

    const toolCalls: ToolCall[] = [];
    if (Array.isArray(message.tool_calls)) {
      for (const rawCall of message.tool_calls) {
        if (rawCall.type === 'function' && rawCall.function) {
          let parsedArgs: Record<string, unknown> = {};
          const rawArgString = rawCall.function.arguments || '{}';
          try {
            parsedArgs = JSON.parse(rawArgString);
          } catch {
            parsedArgs = { _raw: rawArgString };
          }

          toolCalls.push({
            id: rawCall.id || `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: rawCall.function.name,
            arguments: parsedArgs,
            rawArguments: rawArgString,
          });
        }
      }
    }

    return {
      content,
      tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
      finish_reason: finishReason,
      rawJson: JSON.stringify(json),
      usage: json.usage
        ? {
            prompt_tokens: json.usage.prompt_tokens || 0,
            completion_tokens: json.usage.completion_tokens || 0,
            total_tokens: json.usage.total_tokens || 0,
          }
        : undefined,
    };
  }
}
