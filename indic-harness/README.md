# 🇮🇳 Indic Coding Harness (Claude Code Style)

A clean-room, developer-first coding agent harness designed for **Sarvam AI** (`sarvam-30b`, `sarvam-105b`) and Indic LLMs. Implements public Claude Code behaviors (minimal toolset, exact-string fail-safe edits, tool repair auto-fix, session checklist, context compaction, repo map, Plan Mode gates, and bilingual Hinglish/English output).

---

## 🌟 Architecture & Completed Milestones (Days 1 to 4)

```
                            ┌────────────────────────────────────────┐
                            │    Developer Input (Hinglish / DEV)    │
                            └───────────────────┬────────────────────┘
                                                │
                                                ▼
                            ┌────────────────────────────────────────┐
                            │    Language Detector & Transliterate   │
                            │  (detector.ts & transliterate.ts)      │
                            └───────────────────┬────────────────────┘
                                                │
                                                ▼
                            ┌────────────────────────────────────────┐
                            │    Interactive CLI REPL (cli.ts)       │
                            │  Hinglish Aliases: /yojana, /karo, etc.│
                            └───────────────────┬────────────────────┘
                                                │
                                                ▼
                            ┌────────────────────────────────────────┐
                            │    Context Compactor & Repo Map        │
                            │  - BHARAT.md Project Instructions      │
                            │  - Compact Symbol Index (<repo_map>)   │
                            │  - Tool Output & History Compaction    │
                            └───────────────────┬────────────────────┘
                                                │
                                                ▼
                            ┌────────────────────────────────────────┐
                            │       Autonomous Agent Loop            │
                            │  Plan Mode Gate & Multi-Turn Execution │
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
| `npm run harness:test` | Run 100% verified Vitest test suite (49/49 tests passing) |

---

## 💻 Interactive REPL CLI & Hinglish Slash Commands

Launch the CLI:
```bash
npm run harness
```

### Hinglish & English Slash Commands:
- `/yojana` or `/plan` : Toggle Plan Mode (Read-only exploration before execution).
- `/karo` or `/approve` : Approve planned changes and unlock modifying tools.
- `/soochi` or `/todo` : View session planning checklist.
- `/madad` or `/help` : Display help, active tools, and command aliases.
- `/saaf` or `/clear` : Reset conversational context memory.
- `/bhasha` or `/lang <mode>` : Set language mode (`hinglish` | `english` | `devanagari` | `auto`).
- `/repomap` or `/naksha` : Display compact codebase symbol index.
- `/bharat` or `/init` : Scaffold `BHARAT.md` project agent guidelines.
- `/dekho <file>` : Quick inspect file contents.
- `/khoj <pattern>` : Quick grep codebase for regex or string.
- `/alvida` or `/exit` : Close session.

---

## 🧠 Context Management & Memory (Day 4)

1. **Context Compaction (`compaction.ts`):**
   - Head/tail middle-truncation for oversized tool outputs (> 1500 characters).
   - Turn compaction: summarizes earlier turns into `<prior_context_summary>` while preserving recent turns and system prompt intact.
2. **Project Guidelines (`BHARAT.md` / `AGENTS.md` / `CLAUDE.md`):**
   - Automatically loaded on startup from the workspace root and injected into the prompt.
3. **Repo Map Symbol Index (`repo-map.ts`):**
   - Scans project source files (`.ts`, `.tsx`, `.js`, `.py`) and builds a compact index of exported functions, classes, interfaces, and types.
   - Prevents the agent from executing wasteful blind `grep` iterations.
4. **Plan Mode Safety Gate (`plan-mode.ts`):**
   - Restricts operations to read-only exploration (`read`, `grep`, `glob`, `todo`).
   - Hard blocks `write`, `edit`, and `bash` until user runs `/approve` or `/karo`.

---

## 🔬 Benchmark Evaluation & Hinglish Gap Metric

The evaluation suite evaluates 20 real-world software tasks across 4 categories in dual/triple language modes (**English**, **Hinglish**, and **Devanagari**):
1. **Bug Fix (5 tasks):** Off-by-one errors, null pointers, missing awaits, inverted guards, in-place mutations.
2. **Refactor (5 tasks):** Extract helpers, callback to async/await, O(n²) optimization, controller extraction, dead code removal.
3. **Test Writing (5 tasks):** Negative inputs, empty arrays, error throws, async retry, snapshot tests.
4. **Repo Q&A (5 tasks):** Architecture explanations, algorithm complexity, pathfinding heuristics, edge-case analysis.

### Run Evaluation:
```bash
# Run full benchmark
npm run harness:eval

# Run with Devanagari evaluation included
npx tsx indic-harness/eval/run-eval.ts --include-devanagari

# Run with task limit
npx tsx indic-harness/eval/run-eval.ts --limit=5

# Run specific category
npx tsx indic-harness/eval/run-eval.ts --category=bug_fix
```

Scorecards are saved automatically to `indic-harness/eval/SCORECARD.md` and `indic-harness/eval/results.json`.

---

## 🧪 Verified Test Suite

Run the Vitest suite:
```bash
npm run harness:test
```

**49 passed out of 49 tests (100% pass rate):**
- `detector.test.ts`: Language detection (English, Hinglish, Devanagari, confidence scoring).
- `transliterate.test.ts`: Devanagari ↔ Roman transliteration and colloquial normalization.
- `context.test.ts`: BHARAT.md discovery, Repo Map symbol extraction, context compaction.
- `plan-mode.test.ts`: Read-only enforcement, tool-blocking errors, plan approval unblocking.
- `tools.test.ts`: Exact-string edits, directory confinement, command blocklist, todo tracking.
- `repair.test.ts`: Markdown fence stripping, trailing commas, unquoted keys, single quotes, tag fallback.
- `agent.test.ts`: Multi-turn reasoning loops, repair auto-fix, max step limits.
