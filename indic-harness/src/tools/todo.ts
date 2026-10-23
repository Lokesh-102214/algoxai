/**
 * Todo Tool: Session checklist and planning tracker.
 */

import { HarnessTool, ExecutionContext, createToolSuccess, createToolError } from './base';
import { ToolDefinition, ToolResult } from '../types';

export interface TodoItem {
  id: number;
  task: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export const todoDefinition: ToolDefinition = {
  name: 'todo',
  description:
    'Manage the session task list. Use this to plan multi-step implementations, track progress, and mark tasks complete.',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        description: 'The action to perform',
        enum: ['add', 'list', 'complete', 'in_progress', 'clear'],
      },
      task: {
        type: 'string',
        description: 'Task description (required for action: "add")',
      },
      id: {
        type: 'number',
        description: 'Task ID number (required for action: "complete" or "in_progress")',
      },
    },
    required: ['action'],
  },
  examples: [
    {
      input: { action: 'add', task: 'Fix failing unit tests in math.test.ts' },
      explanation: 'Adds a task to the session plan',
    },
    {
      input: { action: 'complete', id: 1 },
      explanation: 'Marks task 1 as completed',
    },
  ],
};

export class TodoTool implements HarnessTool {
  public definition = todoDefinition;
  private todos: TodoItem[] = [];
  private nextId = 1;

  public reset(): void {
    this.todos = [];
    this.nextId = 1;
  }

  public async execute(args: Record<string, unknown>, context: ExecutionContext): Promise<ToolResult> {
    const action = String(args.action || 'list').toLowerCase();

    switch (action) {
      case 'add': {
        const taskText = String(args.task || '').trim();
        if (!taskText) return createToolError(context.toolCallId, 'todo', 'Action "add" requires "task" text');
        const item: TodoItem = {
          id: this.nextId++,
          task: taskText,
          status: 'pending',
        };
        this.todos.push(item);
        return createToolSuccess(
          context.toolCallId,
          'todo',
          `Added task #${item.id}: "${item.task}". Current list has ${this.todos.length} item(s).`
        );
      }

      case 'complete': {
        const id = Number(args.id ?? args.task_id);
        const item = this.todos.find((t) => t.id === id);
        if (!item) return createToolError(context.toolCallId, 'todo', `Task #${id} not found`);
        item.status = 'completed';
        return createToolSuccess(context.toolCallId, 'todo', `Marked task #${id} "${item.task}" as completed.`);
      }

      case 'in_progress': {
        const id = Number(args.id ?? args.task_id);
        const item = this.todos.find((t) => t.id === id);
        if (!item) return createToolError(context.toolCallId, 'todo', `Task #${id} not found`);
        item.status = 'in_progress';
        return createToolSuccess(context.toolCallId, 'todo', `Marked task #${id} "${item.task}" as in_progress.`);
      }

      case 'clear': {
        const count = this.todos.length;
        this.todos = [];
        this.nextId = 1;
        return createToolSuccess(context.toolCallId, 'todo', `Cleared all ${count} tasks.`);
      }

      case 'list':
      default: {
        if (this.todos.length === 0) {
          return createToolSuccess(context.toolCallId, 'todo', 'Task list is currently empty.');
        }

        const lines = this.todos.map((t) => {
          const icon = t.status === 'completed' ? '[x]' : t.status === 'in_progress' ? '[-]' : '[ ]';
          return `${icon} #${t.id}: ${t.task} (${t.status})`;
        });

        return createToolSuccess(context.toolCallId, 'todo', `Session Todo List:\n${lines.join('\n')}`);
      }
    }
  }
}
