/**
 * Indic Coding Harness - Interactive REPL CLI (Days 1 to 4)
 * Claude Code style terminal experience optimized for Sarvam AI & Indic models.
 * Includes Hinglish slash command aliases, Plan Mode gates, BHARAT.md loader,
 * Repo Map symbol indexer, and Hinglish custom developer skills.
 */

import * as readline from 'readline';
import { getConfig } from './config';
import { AgentConfig, LanguageMode, ModelProvider } from './types';
import { AgentLoop, AgentStepEvent } from './agent/loop';
import { ToolRegistry } from './tools';
import { SarvamProvider } from './providers/sarvam';
import { OpenAICompatibleProvider } from './providers/openai-compatible';
import { MockProvider } from './providers/mock';
import { scaffoldBharatMd } from './context/project-file';
import { BUILTIN_HINGLISH_SKILLS } from './skills';

function printBanner(
  model: string,
  workspace: string,
  language: string,
  planMode: boolean,
  projectFile?: string,
  hasRepoMap = false
): void {
  console.log('\n===============================================================');
  console.log('   🇮🇳  Indic Coding Harness (Claude Code Style) v0.3.0');
  console.log('       Clean-room harness for Sarvam AI & Indic LLMs');
  console.log('===============================================================');
  console.log(`Active Model:     ${model}`);
  console.log(`Workspace Root:   ${workspace}`);
  console.log(`Language Mode:    ${language} (Adaptive Hinglish / Devanagari / English)`);
  console.log(`Plan Mode Gate:   ${planMode ? '🔒 ACTIVE (Read-only exploration)' : '🔓 OFF (Direct edits allowed)'}`);
  console.log(`Project File:     ${projectFile ? `✔ Loaded (${projectFile})` : 'None found (Create with /bharat)'}`);
  console.log(`Repo Symbol Map:  ${hasRepoMap ? '✔ Active' : 'Disabled'}`);
  console.log(`Hinglish Skills:  ✔ 6 Active (theek-kardo, samjhao, safai, jugaad, etc.)`);
  console.log('---------------------------------------------------------------');
  console.log('Hinglish Slash Commands:');
  console.log('  /yojana, /plan    - Toggle or inspect Plan Mode (Read-only exploration)');
  console.log('  /karo, /approve   - Approve proposed plan & enable modifications');
  console.log('  /soochi, /todo    - View session planning checklist');
  console.log('  /skills, /hunnar  - View active Hinglish custom developer skills');
  console.log('  /madad, /help     - Command list and documentation');
  console.log('  /saaf, /clear     - Reset conversation context');
  console.log('  /bhasha, /lang    - Set language (hinglish | english | devanagari | auto)');
  console.log('  /repomap, /naksha - View codebase symbol index');
  console.log('  /bharat, /init    - Create BHARAT.md agent guidelines file');
  console.log('  /dekho <file>     - Quick read file');
  console.log('  /khoj <query>     - Quick grep codebase');
  console.log('  /alvida, /exit    - Quit the harness');
  console.log('===============================================================\n');
}

function truncateString(str: string, maxLen = 300): string {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen) + `... [truncated ${str.length - maxLen} chars]`;
}

export async function startCli(): Promise<void> {
  const config = getConfig();
  const workspaceRoot = process.cwd();
  let language: LanguageMode = 'auto';

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
    planMode: false,
    enableCompaction: true,
  };

  const loop = new AgentLoop(agentConfig, toolRegistry);
  const projectFile = loop.getProjectInstructions().filename;
  const hasRepoMap = Boolean(loop.getRepoMap());

  printBanner(modelName, workspaceRoot, language, loop.isPlanMode(), projectFile, hasRepoMap);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const getPromptString = () => (loop.isPlanMode() ? '\nindic-code [PLAN] > ' : '\nindic-code > ');

  rl.setPrompt(getPromptString());
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
          console.log('\n[Available Commands / Hinglish Aliases]');
          console.log('  /yojana, /plan    - Toggle Plan Mode (Read-only exploration)');
          console.log('  /karo, /approve   - Approve proposed plan and execute');
          console.log('  /soochi, /todo    - View session todo checklist');
          console.log('  /skills, /hunnar  - View active Hinglish custom developer skills');
          console.log('  /madad, /help     - Show this help guide');
          console.log('  /saaf, /clear     - Reset conversation context');
          console.log('  /bhasha, /lang    - Set language mode (hinglish | english | devanagari | auto)');
          console.log('  /repomap, /naksha - View repository symbol map');
          console.log('  /bharat, /init    - Create BHARAT.md guidelines');
          console.log('  /dekho <file>     - Quick read file');
          console.log('  /khoj <query>     - Quick grep codebase');
          console.log('  /model <name>     - Switch model name');
          console.log('  /alvida, /exit    - Quit harness');
          break;

        case '/skills':
        case '/hunnar': {
          console.log('\n===============================================================');
          console.log('        POPULAR HINGLISH DEVELOPER SKILLS & HUNNAR');
          console.log('===============================================================');
          for (const s of BUILTIN_HINGLISH_SKILLS) {
            console.log(`\n📌 ${s.name} (${s.hindiTitle}) [${s.category}]`);
            console.log(`   ${s.description}`);
            console.log(`   Trigger Keywords: ${s.triggerKeywords.slice(0, 7).join(', ')}...`);
            console.log(`   Example: "${s.examplePhrases[0]}"`);
          }
          console.log('\n===============================================================\n');
          break;
        }

        case '/yojana':
        case '/plan': {
          const current = loop.isPlanMode();
          loop.setPlanMode(!current);
          rl.setPrompt(getPromptString());
          if (!current) {
            console.log('\n🔒 [Plan Mode Activated]: Write/Edit/Bash are locked. The agent will explore and build a plan first.');
          } else {
            console.log('\n🔓 [Plan Mode Deactivated]: Direct modifications are now enabled.');
          }
          break;
        }

        case '/karo':
        case '/approve': {
          if (loop.isPlanMode()) {
            loop.setPlanMode(false);
            rl.setPrompt(getPromptString());
            console.log('\n✔ [Plan Approved!]: Modification tools (write, edit, bash) unlocked. Agent can now apply changes.');
          } else {
            console.log('\nPlan Mode is not currently active. Edits are already enabled.');
          }
          break;
        }

        case '/soochi':
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

        case '/bhasha':
        case '/lang':
          if (arg === 'hinglish' || arg === 'english' || arg === 'devanagari' || arg === 'auto') {
            language = arg;
            loop.setActiveLanguage(arg);
            console.log(`\n✔ Language mode set to: ${language}`);
          } else {
            console.log('\nUsage: /lang hinglish | english | devanagari | auto');
          }
          break;

        case '/repomap':
        case '/naksha': {
          const map = loop.getRepoMap();
          console.log('\n[Repository Symbol Map]:\n' + (map || 'No symbol map available.'));
          break;
        }

        case '/bharat':
        case '/init': {
          const createdPath = scaffoldBharatMd(workspaceRoot);
          console.log(`\n✔ Created/verified guidelines at: ${createdPath}`);
          loop.reset();
          break;
        }

        case '/dekho': {
          if (!arg) {
            console.log('Usage: /dekho <file_path>');
          } else {
            const readTool = toolRegistry.get('read');
            if (readTool) {
              const res = await readTool.execute({ path: arg, line_count: 50 }, { workspaceRoot, toolCallId: 'cli_read' });
              console.log(`\n${res.content}`);
            }
          }
          break;
        }

        case '/khoj': {
          if (!arg) {
            console.log('Usage: /khoj <pattern>');
          } else {
            const grepTool = toolRegistry.get('grep');
            if (grepTool) {
              const res = await grepTool.execute({ pattern: arg }, { workspaceRoot, toolCallId: 'cli_grep' });
              console.log(`\n${res.content}`);
            }
          }
          break;
        }

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
        case '/alvida':
          console.log('\nDhanyawaad! Alvida.');
          rl.close();
          return;

        default:
          console.log(`\nUnknown command "${command}". Type /help or /madad for available options.`);
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
          case 'skill_activation':
            console.log(`\n⚡ [Skill Activated]: ${event.skill?.name} (${event.skill?.hindiTitle})`);
            break;

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

          case 'compaction':
            console.log(`\n📦 [Context Compaction]: ${event.content}`);
            break;

          case 'final_answer':
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
