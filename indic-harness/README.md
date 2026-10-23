# 🇮🇳 Indic Coding Harness (Claude Code Style)

A clean-room, developer-first coding agent harness designed for **Sarvam AI** (`sarvam-30b`, `sarvam-105b`) and Indic LLMs. Implements public Claude Code behaviors (minimal toolset, exact-string fail-safe edits, tool repair auto-fix, session checklist, and bilingual Hinglish/English output).

---

## 🌟 Architecture & Completed Milestones (Day 1 & Day 2)

```
                            ┌────────────────────────────────────────┐
                            │        User Developer Prompt           │
                            │   (Conversational Hinglish or English) │
                            └───────────────────┬────────────────────┘
                                                │
                                                ▼
                            ┌────────────────────────────────────────┐
                            │    Interactive CLI REPL (cli.ts)       │
                            │    Slash commands: /madad, /todo, etc. │
                            └───────────────────┬────────────────────┘
                                                │
                                                ▼
                            ┌────────────────────────────────────────┐
                            │       Autonomous Agent Loop            │
                            │   Multi-turn loop + max step limits    │
                            └───────┬────────────────────────▲───────┘
                                    │                        │
                      LLM Request   │                        │ Tool Results
                                    ▼                        │
         ┌──────────────────────────────────────┐            │
         │       Model Provider Layer           │            │
         │  - Sarvam AI (api-subscription-key)  │            │
         │  - OpenAI-compatible fallback        │            │
         │  - Offline Deterministic Mock        │            │
         └──────────────────┬───────────────────┘            │
                            │                                │
                            ▼                                │
         ┌──────────────────────────────────────┐            │
         │      Tool-Call Repair Layer          │            │
         │  - Strip markdown code blocks        │            │
         │  - Auto-fix trailing commas & keys   │            │
         │  - Tag fallback (<tool_call> tags)   │            │
         └──────────────────┬───────────────────┘            │
                            │ Cleaned Tool Calls             │
                            ▼                                │
         ┌───────────────────────────────────────────────────┴───────┐
         │              Minimal 7-Tool Claude Code Suite             │
         │  • read   : line numbers + pagination                     │
         │  • write  : auto-mkdir parent directories                 │
         │  • edit   : fail-safe exact unique match (no line drift)  │
         │  • bash   : sandboxed exec + dangerous command blocklist  │
         │  • grep   : regex & string codebase search                │
         │  • glob   : pattern-based file discovery                  │
         │  • todo   : session planning checklist tracker            │
         └───────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Configure Environment (Optional for Live Sarvam AI)

Create or update `.env` in the project root:

```bash
# Sarvam AI API Configuration
SARVAM_API_KEY="your-sarvam-api-key"
SARVAM_BASE_URL="https://api.sarvam.ai/v1"
SARVAM_MODEL="sarvam-30b" # or sarvam-105b

# Optional OpenAI fallback
OPENAI_API_KEY="your-openai-key"
```

*(If no API keys are provided, the harness automatically runs in offline mock simulation mode so all CLI tools, tests, and benchmarks remain fully functional without credentials).*

---

### 2. Available Commands

| Command | Description |
| :--- | :--- |
| `npm run harness` | Launch interactive terminal REPL CLI |
| `npm run harness:probe` | Run live Sarvam API diagnostics (auth, schemas, streaming) |
| `npm run harness:eval` | Run 20-task benchmark & generate comparison scorecard |
| `npm run harness:test` | Run 100% verified Vitest test suite |

---

## 💻 Interactive REPL CLI

Launch the CLI:
```bash
npm run harness
```

### Slash Commands:
- `/help` or `/madad` : Display help, active tools, and command aliases.
- `/todo` : View session todo checklist.
- `/clear` or `/saaf` : Reset conversational context memory.
- `/lang <hinglish|english|hindi>` : Switch agent explanation language.
- `/model <name>` : Switch target model name on the fly.
- `/tools` : Print schema specifications of all 7 active tools.
- `/exit` or `/bye` : Close session.

---

## 🔬 Benchmark Evaluation (Day 1 & Day 2)

The evaluation suite evaluates 20 real-world software tasks across 4 categories in dual **English** and **Hinglish**:
1. **Bug Fix (5 tasks):** Off-by-one errors, null pointers, missing awaits, inverted guards, in-place mutations.
2. **Refactor (5 tasks):** Extract helpers, callback to async/await, O(n²) optimization, controller extraction, dead code removal.
3. **Test Writing (5 tasks):** Negative inputs, empty arrays, error throws, async retry, snapshot tests.
4. **Repo Q&A (5 tasks):** Architecture explanations, algorithm complexity, pathfinding heuristics, edge-case analysis.

### Run Evaluation:
```bash
# Run full benchmark
npm run harness:eval

# Run with task limit
npx tsx indic-harness/eval/run-eval.ts --limit=5

# Run specific category
npx tsx indic-harness/eval/run-eval.ts --category=bug_fix
```

Scorecards are saved automatically to `indic-harness/eval/SCORECARD.md` and `indic-harness/eval/results.json`.

---

## 🛡️ Tool Safety & Fail-Safe Guarantees

1. **Exact-String Edit Match (`edit`):**
   - Replaces character-exact substrings.
   - Prevents line-number drift.
   - Throws clear fail-safe errors if the string is not found or matches multiple occurrences without explicit `replace_all: true`.
2. **Bash Execution Guard (`bash`):**
   - Hard blocks destructive command patterns (`rm -rf /`, `mkfs`, fork bombs `:(){ :|:& };:`, etc.).
   - Truncates verbose stdout/stderr at 240 lines to protect context windows.
3. **Workspace Boundary Confinement:**
   - Tools resolve paths strictly within the workspace root, blocking `../../` directory escapes.

---

## 🧪 Test Suite

Run the Vitest suite:
```bash
npm run harness:test
```

Includes 31 tests covering:
- Exact-string edit uniqueness and fail-safe safety.
- Directory escape prevention and path security.
- Command blocklist enforcement.
- Heuristic JSON repair (code fences, trailing commas, single quotes, unquoted keys).
- Tag fallback extraction (`<tool_call>` & `<function=name>`).
- Multi-turn autonomous agent loops and step limits.
