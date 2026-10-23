/**
 * Indic Coding Harness - Interactive REPL CLI (Day 2)
 * Claude Code style terminal experience optimized for Sarvam AI & Indic models.
 */

import * as readline from 'readline';
import * as path from 'path';
import { getConfig } from './config';
import { AgentConfig, ModelProvider } from './types';
import { AgentLoop, AgentStepEvent } from './agent/loop';
import { ToolRegistry } from './tools';
import { SarvamProvider } from './providers/sarvam';
import { OpenAICompatibleProvider } from './providers/openai-compatible';
import { MockProvider } from './providers/mock';

function printBanner(model: string, workspace: string, language: string): void {
  console.log('\n===============================================================');
  console.log('   🇮🇳  Indic Coding Harness (Claude Code Style) v0.1.0');
  console.log('       Clean-room harness for Sarvam AI & Indic LLMs');
  console.log('===============================================================');
  console.log(`Active Model:    ${model}`);
  console.log(`Workspace Root:  ${workspace}`);
  console.log(`Language Mode:   ${language} (Conversational Hinglish + English Code)`);
  console.log(`Tools Active:    read, write, edit, bash, grep, glob, todo`);
  console.log('---------------------------------------------------------------');
  console.log('Commands:');
  console.log('  /help or /madad   - Command list and documentation');
  console.log('  /todo             - View session task checklist');
  console.log('  /clear or /saaf   - Reset conversation context');
  console.log('  /lang <mode>      - Set language (hinglish | english | hindi)');
  console.log('  /model <name>     - Switch active model');
  console.log('  /tools            - List registered tools and schemas');
  console.log('  /exit or /bye     - Quit the harness');
  console.log('===============================================================\n');
}

function truncateString(str: string, maxLen = 300): string {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen) + `... [truncated ${str.length - maxLen} chars]`;
}

export async function startCli(): Promise<void> {
  const config = getConfig();
  let workspaceRoot = process.cwd();
  let language: 'hinglish' | 'english' | 'hindi' = 'hinglish';

  let provider: ModelProvider;
  let modelName = 'sarvam-30b';

  if (config.sarvamApiKey) {
    modelName = config.sarvamModel;
    provider = new SarvamProvider({
      apiKey: config.sarvamApiKey,
      baseUrl: config.sarvamBaseUrl,
      defaultModel: config.sarvamModel,
    });
  } else if (config.openaiApiKey) {
    modelName = config.openaiModel;
    provider = new OpenAICompatibleProvider({
      apiKey: config.openaiApiKey,
      baseUrl: config.openaiBaseUrl,
      defaultModel: config.openaiModel,
    });
  } else {
    modelName = 'mock-sarvam-30b';
    provider = new MockProvider();
  }

  const toolRegistry = new ToolRegistry();

  const agentConfig: AgentConfig = {
    provider,
    model: modelName,
    workspaceRoot,
    maxSteps: 10,
    verbose: false,
    language,
  };

  let loop = new AgentLoop(agentConfig, toolRegistry);

  printBanner(modelName, workspaceRoot, language);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\nindic-code > ',
  });

  rl.prompt();

  rl.on('line', async (line: string) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    // Slash command handling
    if (input.startsWith('/')) {
      const parts = input.split(' ');
      const command = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ').trim();

      switch (command) {
        case '/help':
        case '/madad':
          console.log('\n[Available Commands]');
          console.log('  /help, /madad     - Command and usage guide');
          console.log('  /todo             - View session todo list');
          console.log('  /clear, /saaf     - Clear context and reset conversation');
          console.log('  /lang <mode>      - Toggle language (hinglish | english | hindi)');
          console.log('  /model <name>     - Switch model name');
          console.log('  /tools            - List all 7 tools and parameter types');
          console.log('  /exit, /quit, /bye- Exit harness');
          break;

        case '/todo': {
          const todoTool = toolRegistry.get('todo');
          if (todoTool) {
            const res = await todoTool.execute({ action: 'list' }, { workspaceRoot, toolCallId: 'cli_todo' });
            console.log(`\n${res.content}`);
          }
          break;
        }

        case '/clear':
        case '/saaf':
          loop.reset();
          console.log('\n✔ Context reset done! Purani conversation history saaf ho gayi.');
          break;

        case '/lang':
          if (arg === 'hinglish' || arg === 'english' || arg === 'hindi') {
            language = arg;
            agentConfig.language = arg;
            loop.reset();
            console.log(`\n✔ Language set to: ${language}`);
          } else {
            console.log('\nUsage: /lang hinglish | english | hindi');
          }
          break;

        case '/model':
          if (arg) {
            modelName = arg;
            agentConfig.model = arg;
            console.log(`\n✔ Target model set to: ${modelName}`);
          } else {
            console.log(`\nCurrent model: ${modelName}`);
            console.log('Usage: /model <model-name>');
          }
          break;

        case '/tools':
          console.log('\n[Active Minimal Toolset - Claude Code Style]');
          for (const t of toolRegistry.getDefinitions()) {
            console.log(`  - ${t.name.padEnd(8)} : ${t.description}`);
            console.log(`    Required: [${t.parameters.required.join(', ')}]`);
          }
          break;

        case '/exit':
        case '/quit':
        case '/bye':
          console.log('\nDhanyawaad! Alvida.');
          rl.close();
          return;

        default:
          console.log(`\nUnknown command "${command}". Type /help for available options.`);
      }

      rl.prompt();
      return;
    }

    // Agent execution
    console.log('\nThinking & executing...');
    const startTime = Date.now();

    try {
      const result = await loop.run(input, (event: AgentStepEvent) => {
        switch (event.type) {
          case 'thought':
            if (event.content.trim()) {
              console.log(`\n💭 [Agent Thought]:\n${truncateString(event.content, 400)}`);
            }
            break;

          case 'tool_call':
            if (event.toolCall) {
              const argPreview = truncateString(JSON.stringify(event.toolCall.arguments), 200);
              console.log(`\n🔧 [Tool Call] ${event.toolCall.name}(${argPreview})`);
            }
            break;

          case 'tool_result':
            if (event.toolResult) {
              const icon = event.toolResult.is_error ? '❌ [Tool Error]' : '✔ [Tool Result]';
              console.log(`${icon}: ${truncateString(event.toolResult.content, 350)}`);
            }
            break;

          case 'repair_retry':
            console.log(`\n🔄 [Tool-Call Repair]: ${event.content}`);
            break;

          case 'final_answer':
            // Final response printed below
            break;
        }
      });

      const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log('\n---------------------------------------------------------------');
      console.log(`🤖 [Response] (${elapsedSec}s, ${result.totalSteps} step(s)):`);
      console.log(result.finalResponse || '(No response text returned)');
      console.log('---------------------------------------------------------------');
    } catch (err: unknown) {
      console.error(`\n❌ Error during execution: ${err instanceof Error ? err.message : String(err)}`);
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\nSession closed. Have a great day!\n');
    process.exit(0);
  });
}

if (process.argv[1]?.includes('cli')) {
  startCli().catch((err) => {
    console.error('Fatal CLI Error:', err);
    process.exit(1);
  });
}
