/**
 * Indic Coding Harness - Core Type Definitions
 * Clean-room architecture inspired by Claude Code / OpenCode specifications.
 */

export type Role = 'system' | 'user' | 'assistant' | 'tool';

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  rawArguments?: string;
}

export interface Message {
  role: Role;
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

export interface ToolParameterProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
  items?: { type: string };
  default?: unknown;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, ToolParameterProperty>;
    required: string[];
  };
  examples?: Array<{
    input: Record<string, unknown>;
    explanation: string;
  }>;
}

export interface ToolResult {
  tool_call_id: string;
  name: string;
  content: string;
  is_error: boolean;
}

export interface ProviderRequestOptions {
  messages: Message[];
  tools?: ToolDefinition[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  onToken?: (token: string) => void;
}

export interface ProviderResponse {
  content: string;
  tool_calls?: ToolCall[];
  finish_reason?: string;
  rawJson?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelProvider {
  name: string;
  defaultModel: string;
  chat(options: ProviderRequestOptions): Promise<ProviderResponse>;
}

export interface AgentConfig {
  provider: ModelProvider;
  model: string;
  workspaceRoot: string;
  maxSteps: number;
  verbose: boolean;
  language: 'hinglish' | 'english' | 'hindi';
  apiKey?: string;
  baseUrl?: string;
}

export type EvalCategory = 'bug_fix' | 'refactor' | 'test_writing' | 'repo_qa';

export interface EvalTask {
  id: string;
  title: string;
  category: EvalCategory;
  prompt_en: string;
  prompt_hi_en: string;
  workspaceSetup?: Record<string, string>;
  expectedFiles?: string[];
  validate?: (workspace: string, toolResults: ToolResult[]) => Promise<{ pass: boolean; feedback: string }>;
}

export interface EvalResult {
  taskId: string;
  title: string;
  category: EvalCategory;
  language: 'english' | 'hinglish';
  pass: boolean;
  steps: number;
  toolErrors: number;
  feedback: string;
  durationMs: number;
}
