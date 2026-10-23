/**
 * Tool Registry - Exports the complete Claude Code-style toolset.
 */

import { HarnessTool } from './base';
import { ReadTool } from './read';
import { WriteTool } from './write';
import { EditTool } from './edit';
import { BashTool } from './bash';
import { GrepTool } from './grep';
import { GlobTool } from './glob';
import { TodoTool } from './todo';
import { ToolDefinition } from '../types';

export class ToolRegistry {
  private tools: Map<string, HarnessTool> = new Map();

  constructor() {
    this.register(new ReadTool());
    this.register(new WriteTool());
    this.register(new EditTool());
    this.register(new BashTool());
    this.register(new GrepTool());
    this.register(new GlobTool());
    this.register(new TodoTool());
  }

  public register(tool: HarnessTool): void {
    this.tools.set(tool.definition.name, tool);
  }

  public get(name: string): HarnessTool | undefined {
    return this.tools.get(name);
  }

  public getAll(): HarnessTool[] {
    return Array.from(this.tools.values());
  }

  public getDefinitions(): ToolDefinition[] {
    return this.getAll().map((t) => t.definition);
  }
}

export * from './base';
export * from './read';
export * from './write';
export * from './edit';
export * from './bash';
export * from './grep';
export * from './glob';
export * from './todo';
