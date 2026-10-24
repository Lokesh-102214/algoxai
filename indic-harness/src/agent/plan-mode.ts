/**
 * Plan Mode Guard (Day 4)
 * Enforces read-only exploration before approval.
 * Blocks destructive tools (write, edit, bash) while allowing read, grep, glob, and todo.
 */

import { ToolResult } from '../types';
import { createToolError } from '../tools/base';

const READ_ONLY_TOOLS = new Set(['read', 'grep', 'glob', 'todo']);

export class PlanModeManager {
  private active: boolean;

  constructor(initialActive = false) {
    this.active = initialActive;
  }

  public isPlanMode(): boolean {
    return this.active;
  }

  public setPlanMode(enabled: boolean): void {
    this.active = enabled;
  }

  public isToolAllowed(toolName: string): boolean {
    if (!this.active) return true;
    return READ_ONLY_TOOLS.has(toolName);
  }

  public createBlockedResult(toolCallId: string, toolName: string): ToolResult {
    const errorMsg =
      `PLAN MODE ACTIVE: Tool "${toolName}" is blocked because it modifies files or executes commands. ` +
      `You are currently in read-only exploration & planning mode. ` +
      `Please formulate a proposed plan using the "todo" tool and explain your planned changes to the user. ` +
      `The user will approve execution with /approve or /karo before modifications begin.`;

    return createToolError(toolCallId, toolName, errorMsg);
  }
}
