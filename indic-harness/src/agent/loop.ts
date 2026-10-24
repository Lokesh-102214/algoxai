/**
 * Autonomous Agent Loop Implementation (Day 3 & Day 4)
 * Orchestrates multi-turn tool execution, tool-call repair, self-correction,
 * adaptive language detection (Hinglish / Devanagari / English),
 * context compaction, project guidelines (BHARAT.md), repo map, and Plan Mode gates.
 */

import { AgentConfig, LanguageMode, Message, ToolCall, ToolResult } from '../types';
import { ToolRegistry } from '../tools';
import { buildSystemPrompt } from './prompt';
import { repairToolCallArguments, extractTextBasedToolCalls } from './repair';
import { detectLanguage } from '../indic/detector';
import { loadProjectInstructions, ProjectFileResult } from '../context/project-file';
import { buildRepoMap } from '../context/repo-map';
import { compactHistory } from './compaction';
import { PlanModeManager } from './plan-mode';

export interface AgentStepEvent {
  step: number;
  type: 'thought' | 'tool_call' | 'tool_result' | 'final_answer' | 'repair_retry' | 'compaction';
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
  detectedLanguage?: string;
  planModeBlocked?: boolean;
}

export class AgentLoop {
  private config: AgentConfig;
  private tools: ToolRegistry;
  private messages: Message[] = [];
  private toolExecutions: ToolResult[] = [];
  private planModeManager: PlanModeManager;
  private projectInstructions: ProjectFileResult;
  private repoMapText = '';
  private activeLanguage: LanguageMode;

  constructor(config: AgentConfig, tools?: ToolRegistry) {
    this.config = config;
    this.tools = tools || new ToolRegistry();
    this.activeLanguage = config.language || 'hinglish';
    this.planModeManager = new PlanModeManager(Boolean(config.planMode));
    this.projectInstructions = loadProjectInstructions(config.workspaceRoot);

    try {
      const repoMapResult = buildRepoMap(config.workspaceRoot);
      this.repoMapText = repoMapResult.formattedText;
    } catch {
      this.repoMapText = '';
    }

    this.reset();
  }

  public reset(): void {
    this.messages = [
      {
        role: 'system',
        content: buildSystemPrompt({
          workspaceRoot: this.config.workspaceRoot,
          language: this.activeLanguage,
          projectInstructions: this.projectInstructions.found && this.projectInstructions.filename && this.projectInstructions.content
            ? { filename: this.projectInstructions.filename, content: this.projectInstructions.content }
            : undefined,
          repoMap: this.repoMapText,
          planMode: this.planModeManager.isPlanMode(),
        }),
      },
    ];
    this.toolExecutions = [];
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public getActiveLanguage(): LanguageMode {
    return this.activeLanguage;
  }

  public setActiveLanguage(lang: LanguageMode): void {
    this.activeLanguage = lang;
    this.reset();
  }

  public isPlanMode(): boolean {
    return this.planModeManager.isPlanMode();
  }

  public setPlanMode(enabled: boolean): void {
    this.planModeManager.setPlanMode(enabled);
    this.reset();
  }

  public getRepoMap(): string {
    return this.repoMapText;
  }

  public getProjectInstructions(): ProjectFileResult {
    return this.projectInstructions;
  }

  public async run(
    userPrompt: string,
    onStep?: (event: AgentStepEvent) => void
  ): Promise<AgentRunResult> {
    // Adaptive language detection if auto or if prompt has Devanagari
    if (this.config.language === 'auto' || /[\u0900-\u097F]/.test(userPrompt)) {
      const detected = detectLanguage(userPrompt);
      if (detected.detected !== this.activeLanguage) {
        this.activeLanguage = detected.detected;
        // Update system prompt with detected language
        if (this.messages.length > 0 && this.messages[0].role === 'system') {
          this.messages[0].content = buildSystemPrompt({
            workspaceRoot: this.config.workspaceRoot,
            language: this.activeLanguage,
            projectInstructions: this.projectInstructions.found && this.projectInstructions.filename && this.projectInstructions.content
              ? { filename: this.projectInstructions.filename, content: this.projectInstructions.content }
              : undefined,
            repoMap: this.repoMapText,
            planMode: this.planModeManager.isPlanMode(),
          });
        }
      }
    }

    this.messages.push({
      role: 'user',
      content: userPrompt,
    });

    let currentStep = 0;
    let finalResponse = '';
    let planBlockedEncountered = false;

    while (currentStep < this.config.maxSteps) {
      currentStep++;

      // Check for context compaction
      if (this.config.enableCompaction !== false && this.messages.length > 8) {
        const { messages: compactedMsgs, summary } = compactHistory(this.messages, {
          maxEstimatedTokens: this.config.maxContextTokens || 10000,
        });
        if (summary.compactedTurns > 0) {
          this.messages = compactedMsgs;
          onStep?.({
            step: currentStep,
            type: 'compaction',
            content: summary.summaryText,
          });
        }
      }

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
        const args = repair.parsed;

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
        } else if (!this.planModeManager.isToolAllowed(call.name)) {
          // Plan Mode Check: Block destructive actions
          planBlockedEncountered = true;
          toolResult = this.planModeManager.createBlockedResult(call.id, call.name);
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
          detectedLanguage: this.activeLanguage,
          planModeBlocked: planBlockedEncountered,
        };
      }
    }

    return {
      finalResponse,
      totalSteps: currentStep,
      toolExecutions: this.toolExecutions,
      messages: this.messages,
      success: true,
      detectedLanguage: this.activeLanguage,
      planModeBlocked: planBlockedEncountered,
    };
  }
}
