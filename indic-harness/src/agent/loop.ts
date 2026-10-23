/**
 * Autonomous Agent Loop Implementation
 * Orchestrates multi-turn tool execution, tool-call repair, self-correction, and Hinglish responses.
 */

import { AgentConfig, Message, ToolCall, ToolResult } from '../types';
import { ToolRegistry } from '../tools';
import { buildSystemPrompt } from './prompt';
import { repairToolCallArguments, extractTextBasedToolCalls } from './repair';

export interface AgentStepEvent {
  step: number;
  type: 'thought' | 'tool_call' | 'tool_result' | 'final_answer' | 'repair_retry';
  content: string;
  toolCall?: ToolCall;
  toolResult?: ToolResult;
}

export interface AgentRunResult {
  finalResponse: string;
  totalSteps: number;
  toolExecutions: ToolResult[];
  messages: Message[];
  success: boolean;
}

export class AgentLoop {
  private config: AgentConfig;
  private tools: ToolRegistry;
  private messages: Message[] = [];
  private toolExecutions: ToolResult[] = [];

  constructor(config: AgentConfig, tools?: ToolRegistry) {
    this.config = config;
    this.tools = tools || new ToolRegistry();
    this.reset();
  }

  public reset(): void {
    this.messages = [
      {
        role: 'system',
        content: buildSystemPrompt(this.config.workspaceRoot, this.config.language),
      },
    ];
    this.toolExecutions = [];
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public async run(
    userPrompt: string,
    onStep?: (event: AgentStepEvent) => void
  ): Promise<AgentRunResult> {
    this.messages.push({
      role: 'user',
      content: userPrompt,
    });

    let currentStep = 0;
    let finalResponse = '';

    while (currentStep < this.config.maxSteps) {
      currentStep++;

      // 1. Invoke Model Provider
      const toolDefinitions = this.tools.getDefinitions();
      const response = await this.config.provider.chat({
        messages: this.messages,
        tools: toolDefinitions,
        temperature: 0.1,
      });

      const assistantContent = response.content || '';

      // 2. Extract tool calls (native API + tag fallback)
      let toolCalls: ToolCall[] = response.tool_calls || [];
      if (toolCalls.length === 0 && assistantContent) {
        toolCalls = extractTextBasedToolCalls(assistantContent);
      }

      // Record assistant message
      this.messages.push({
        role: 'assistant',
        content: assistantContent,
        tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
      });

      if (assistantContent && toolCalls.length === 0) {
        onStep?.({
          step: currentStep,
          type: 'final_answer',
          content: assistantContent,
        });
        finalResponse = assistantContent;
        break;
      }

      if (assistantContent && toolCalls.length > 0) {
        onStep?.({
          step: currentStep,
          type: 'thought',
          content: assistantContent,
        });
      }

      // 3. Execute Tool Calls
      for (const call of toolCalls) {
        onStep?.({
          step: currentStep,
          type: 'tool_call',
          content: `Invoking ${call.name}`,
          toolCall: call,
        });

        // Tool-Call Repair Layer
        const repair = repairToolCallArguments(call.rawArguments || call.arguments);
        let args = repair.parsed;

        let toolResult: ToolResult;

        if (!repair.success) {
          onStep?.({
            step: currentStep,
            type: 'repair_retry',
            content: `Tool-call repair failed: ${repair.error}. Sending error back to model.`,
          });

          toolResult = {
            tool_call_id: call.id,
            name: call.name,
            content: `Error: Invalid JSON arguments: ${repair.error}. Output valid JSON arguments for tool "${call.name}".`,
            is_error: true,
          };
        } else {
          const tool = this.tools.get(call.name);
          if (!tool) {
            toolResult = {
              tool_call_id: call.id,
              name: call.name,
              content: `Error: Tool "${call.name}" is not recognized. Available tools: ${this.tools
                .getDefinitions()
                .map((t) => t.name)
                .join(', ')}`,
              is_error: true,
            };
          } else {
            try {
              toolResult = await tool.execute(args, {
                workspaceRoot: this.config.workspaceRoot,
                toolCallId: call.id,
              });
            } catch (err: unknown) {
              toolResult = {
                tool_call_id: call.id,
                name: call.name,
                content: `Runtime tool exception: ${err instanceof Error ? err.message : String(err)}`,
                is_error: true,
              };
            }
          }
        }

        this.toolExecutions.push(toolResult);

        onStep?.({
          step: currentStep,
          type: 'tool_result',
          content: toolResult.content,
          toolResult,
        });

        // Append tool result message
        this.messages.push({
          role: 'tool',
          name: call.name,
          tool_call_id: call.id,
          content: toolResult.content,
        });
      }

      // If loop reached max steps
      if (currentStep >= this.config.maxSteps) {
        finalResponse = `Agent reached maximum step limit (${this.config.maxSteps}). Halting loop to prevent infinite recursion.`;
        onStep?.({
          step: currentStep,
          type: 'final_answer',
          content: finalResponse,
        });
        return {
          finalResponse,
          totalSteps: currentStep,
          toolExecutions: this.toolExecutions,
          messages: this.messages,
          success: false,
        };
      }
    }

    return {
      finalResponse,
      totalSteps: currentStep,
      toolExecutions: this.toolExecutions,
      messages: this.messages,
      success: true,
    };
  }
}
