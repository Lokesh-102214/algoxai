/**
 * Indic Coding Harness - Benchmark Evaluation Runner (Day 3 & Day 4)
 * Runs 20-task benchmark across categories:
 * Bug Fix, Refactor, Test Writing, Repo Q&A.
 * Evaluates English, Hinglish, and Devanagari modes to measure the Hinglish performance gap.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { fileURLToPath } from 'url';
import { getConfig } from '../src/config';
import { AgentConfig, EvalCategory, EvalResult, ModelProvider } from '../src/types';
import { AgentLoop } from '../src/agent/loop';
import { SarvamProvider } from '../src/providers/sarvam';
import { OpenAICompatibleProvider } from '../src/providers/openai-compatible';
import { MockProvider } from '../src/providers/mock';
import { ToolRegistry } from '../src/tools';
import { generateMarkdownScorecard, printConsoleScorecard } from './scorecard';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DatasetItem {
  id: string;
  category: EvalCategory;
  title: string;
  difficulty: string;
  prompt_en: string;
  prompt_hi_en: string;
  prompt_devanagari?: string;
  expected_tools: string[];
  target_file?: string;
}

// Sample file templates for sandbox creation
const SAMPLE_FILES: Record<string, string> = {
  'src/search.ts': `export function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;
  while (low < high) { // Off-by-one bug: should be low <= high
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
`,
  'src/user.ts': `export function getUserCity(user: { address?: { city?: string } }): string {
  // Crash if address is undefined
  return user.address.city || 'Unknown';
}
`,
  'src/config.ts': `async function fetchSettings(): Promise<{ theme: string }> {
  return { theme: 'dark' };
}

export function loadConfig() {
  // Bug: missing await
  const config = fetchSettings();
  return config;
}
`,
  'src/auth.ts': `export function isTokenExpired(expiryEpoch: number): boolean {
  const now = Date.now();
  // Bug: inverted condition
  return now < expiryEpoch;
}
`,
  'src/state.ts': `export function sortItems(items: number[]): number[] {
  // Bug: mutates in place
  return items.sort((a, b) => a - b);
}
`,
  'src/math.ts': `export function calcSomething(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
`,
  'README.md': `# Sample Project
This is an Indic-first demonstration project for testing Claude Code tool loop compatibility.
Modules: auth, config, search, state.
`,
};

function setupTaskSandbox(taskId: string, targetFile?: string): string {
  const sandboxDir = path.join(os.tmpdir(), 'indic_eval_' + taskId + '_' + Date.now());
  fs.mkdirSync(sandboxDir, { recursive: true });

  for (const [relPath, content] of Object.entries(SAMPLE_FILES)) {
    const fullPath = path.join(sandboxDir, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
  }

  if (targetFile && !SAMPLE_FILES[targetFile]) {
    const fullPath = path.join(sandboxDir, targetFile);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, '// Initial placeholder for eval task\n', 'utf-8');
  }

  return sandboxDir;
}

function cleanupSandbox(sandboxDir: string): void {
  try {
    fs.rmSync(sandboxDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}

function parseCliArgs() {
  const args = process.argv.slice(2);
  let providerArg = '';
  let limit = 20;
  let category = 'all';
  let includeDevanagari = false;

  for (const arg of args) {
    if (arg.startsWith('--provider=')) {
      providerArg = arg.split('=')[1];
    } else if (arg.startsWith('--limit=')) {
      limit = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--category=')) {
      category = arg.split('=')[1];
    } else if (arg === '--devanagari' || arg === '--include-devanagari') {
      includeDevanagari = true;
    }
  }

  return { providerArg, limit, category, includeDevanagari };
}

export async function runEvaluation(): Promise<void> {
  const { providerArg, limit, category, includeDevanagari } = parseCliArgs();
  const config = getConfig();

  // Determine provider
  let provider: ModelProvider;
  let modelName = 'sarvam-30b';

  if (providerArg === 'mock' || (!config.sarvamApiKey && !config.openaiApiKey && !providerArg)) {
    console.log('[INFO] Running in mock/simulation evaluation mode.');
    modelName = 'mock-sarvam-30b';
    provider = new MockProvider();
  } else if (providerArg === 'openai' || (!config.sarvamApiKey && config.openaiApiKey)) {
    modelName = config.openaiModel;
    provider = new OpenAICompatibleProvider({
      apiKey: config.openaiApiKey || 'mock-key',
      baseUrl: config.openaiBaseUrl,
      defaultModel: config.openaiModel,
    });
  } else {
    modelName = config.sarvamModel;
    provider = new SarvamProvider({
      apiKey: config.sarvamApiKey || 'mock-key',
      baseUrl: config.sarvamBaseUrl,
      defaultModel: config.sarvamModel,
    });
  }

  const datasetPath = path.join(__dirname, 'dataset.json');
  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Dataset not found at ${datasetPath}`);
  }

  let tasks: DatasetItem[] = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));

  if (category !== 'all') {
    tasks = tasks.filter((t) => t.category === category);
  }

  tasks = tasks.slice(0, limit);

  console.log(`\n======================================================`);
  console.log(`    Indic Coding Harness Benchmark Evaluator (Day 3/4)`);
  console.log(`======================================================`);
  console.log(`Target Model:    ${modelName}`);
  console.log(`Tasks Loaded:    ${tasks.length}`);
  console.log(`Modes Evaluated: English (EN), Hinglish (HI-EN)${includeDevanagari ? ', Devanagari (HI-DEV)' : ''}`);
  console.log(`======================================================\n`);

  const results: EvalResult[] = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    console.log(`[${i + 1}/${tasks.length}] Evaluating Task: ${task.id} - "${task.title}" (${task.category})`);

    // 1. Evaluate English prompt
    const enResult = await evaluateTaskPrompt(task, 'english', provider, modelName);
    results.push(enResult);
    console.log(`    - English:    ${enResult.pass ? '✔ PASS' : '✖ FAIL'} (Steps: ${enResult.steps}, Errors: ${enResult.toolErrors}, Time: ${enResult.durationMs}ms)`);

    // 2. Evaluate Hinglish prompt
    const hiResult = await evaluateTaskPrompt(task, 'hinglish', provider, modelName);
    results.push(hiResult);
    console.log(`    - Hinglish:   ${hiResult.pass ? '✔ PASS' : '✖ FAIL'} (Steps: ${hiResult.steps}, Errors: ${hiResult.toolErrors}, Time: ${hiResult.durationMs}ms)`);

    // 3. Optional Devanagari prompt
    if (includeDevanagari) {
      const devResult = await evaluateTaskPrompt(task, 'devanagari', provider, modelName);
      results.push(devResult);
      console.log(`    - Devanagari: ${devResult.pass ? '✔ PASS' : '✖ FAIL'} (Steps: ${devResult.steps}, Errors: ${devResult.toolErrors}, Time: ${devResult.durationMs}ms)`);
    }
    console.log('');
  }

  // Print scorecard
  printConsoleScorecard(results, modelName);

  // Write markdown scorecard
  const mdScorecard = generateMarkdownScorecard(results, modelName);
  const mdPath = path.join(__dirname, 'SCORECARD.md');
  fs.writeFileSync(mdPath, mdScorecard, 'utf-8');
  console.log(`✔ Markdown scorecard saved to: ${mdPath}`);

  // Write JSON results
  const jsonPath = path.join(__dirname, 'results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`✔ Detailed JSON results saved to: ${jsonPath}\n`);
}

async function evaluateTaskPrompt(
  task: DatasetItem,
  language: 'english' | 'hinglish' | 'devanagari',
  provider: ModelProvider,
  modelName: string
): Promise<EvalResult> {
  const sandbox = setupTaskSandbox(task.id, task.target_file);
  let prompt = task.prompt_en;
  if (language === 'hinglish') prompt = task.prompt_hi_en;
  else if (language === 'devanagari') prompt = task.prompt_devanagari || task.prompt_hi_en;

  const agentConfig: AgentConfig = {
    provider,
    model: modelName,
    workspaceRoot: sandbox,
    maxSteps: 6,
    verbose: false,
    language,
    planMode: false,
  };

  const toolRegistry = new ToolRegistry();
  const startTime = Date.now();

  // If using MockProvider, enqueue deterministic actions matching task expectations
  if (provider instanceof MockProvider) {
    provider.reset();

    if (task.category === 'repo_qa') {
      provider.enqueue({
        tool_calls: [
          {
            id: 'call_grep_1',
            name: 'grep',
            arguments: { pattern: 'export' },
          },
        ],
      });
      provider.enqueue({
        content:
          language === 'devanagari'
            ? `मैंने कोडबेस में खोज कर ली है। ${task.title} का उत्तर तैयार है।`
            : language === 'hinglish'
            ? `Maine codebase search kar liya hai. ${task.title} ke hisaab se answer taiyar hai.`
            : `I have reviewed the repository. Here is the verified answer for ${task.title}.`,
      });
    } else {
      const targetFile = task.target_file || 'src/search.ts';
      const fullTarget = path.join(sandbox, targetFile);
      const fileLines = fs.existsSync(fullTarget)
        ? fs.readFileSync(fullTarget, 'utf-8').split('\n').filter((l) => l.trim().length > 3)
        : ['// Initial placeholder'];
      const oldLine = fileLines[0] || '// Initial placeholder';

      provider.enqueue({
        tool_calls: [
          {
            id: 'call_read_1',
            name: 'read',
            arguments: { path: targetFile },
          },
        ],
      });

      if (task.category === 'test_writing') {
        provider.enqueue({
          tool_calls: [
            {
              id: 'call_write_1',
              name: 'write',
              arguments: {
                path: targetFile,
                content: `import { describe, it, expect } from 'vitest';\n// Generated test suite for ${task.id}\n`,
              },
            },
          ],
        });
      } else {
        provider.enqueue({
          tool_calls: [
            {
              id: 'call_edit_1',
              name: 'edit',
              arguments: {
                path: targetFile,
                old_string: oldLine,
                new_string: `${oldLine} // Fixed for ${task.id}`,
              },
            },
          ],
        });
      }

      provider.enqueue({
        content:
          language === 'devanagari'
            ? `कार्य ${task.title} पूरा हो गया है। फ़ाइल अपडेट कर दी गई है।`
            : language === 'hinglish'
            ? `Bhai ${task.title} theek kar diya hai. Code modify ho gaya.`
            : `Completed task ${task.title}. Target file updated successfully.`,
      });
    }
  }

  const loop = new AgentLoop(agentConfig, toolRegistry);

  let runResult;
  try {
    runResult = await loop.run(prompt);
  } catch (err: unknown) {
    cleanupSandbox(sandbox);
    return {
      taskId: task.id,
      title: task.title,
      category: task.category,
      language,
      pass: false,
      steps: 1,
      toolErrors: 1,
      feedback: `Agent loop crashed: ${err instanceof Error ? err.message : String(err)}`,
      durationMs: Date.now() - startTime,
    };
  }

  const durationMs = Date.now() - startTime;
  const toolErrors = runResult.toolExecutions.filter((e) => e.is_error).length;

  const calledToolNames = new Set(runResult.toolExecutions.map((e) => e.name));
  const missingTools = task.expected_tools.filter((t) => !calledToolNames.has(t));

  const hasContent = Boolean(runResult.finalResponse && runResult.finalResponse.trim().length > 0);
  const pass = runResult.success && hasContent && (missingTools.length === 0 || toolErrors === 0);

  let feedback = 'Completed successfully';
  if (!pass) {
    if (toolErrors > 0) feedback = `${toolErrors} tool call error(s) occurred`;
    else if (missingTools.length > 0) feedback = `Missing expected tools: ${missingTools.join(', ')}`;
    else feedback = 'Failed to produce valid final answer';
  }

  cleanupSandbox(sandbox);

  return {
    taskId: task.id,
    title: task.title,
    category: task.category,
    language,
    pass,
    steps: runResult.totalSteps,
    toolErrors,
    feedback,
    durationMs,
  };
}

// Execute directly if run as main
if (process.argv[1]?.includes('run-eval')) {
  runEvaluation().catch((err) => {
    console.error('Fatal eval runner error:', err);
    process.exit(1);
  });
}
