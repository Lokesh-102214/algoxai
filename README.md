<div align="center">

<img src="./gemini-svg.svg" alt="AlgoXAI logo" width="110" />

# AlgoXAI

### *Observable Algorithm Engine & Indic Coding Harness*
*See algorithms think in 3D. Run Claude Code-style agentic coding with Sarvam AI & Indic LLMs.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-powered-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Indic LLMs](https://img.shields.io/badge/Indic%20AI-Sarvam%20AI%20Supported-orange.svg)](https://sarvam.ai)
[![Vitest](https://img.shields.io/badge/Vitest-49%20Passing-brightgreen?logo=vitest&logoColor=white)](https://vitest.dev/)

[Live Demo](https://www.algoxai.tech/) · [Visualizer Lab](https://www.algoxai.tech/visualizations) · [Indic Harness Docs](indic-harness/README.md) · [Product Strategy](docs/strategy.md) · [Architecture](ARCHITECTURE.md) · [Contribute](CONTRIBUTING.md)

</div>

---

## 🧭 Overview

**AlgoXAI** is an open-source developer project comprising two interconnected pillars:

1. **Observable Algorithm Engine & React Library (`src/`)**: Pure TypeScript algorithm engines and interactive 3D/2D visualizers (Three.js / React Three Fiber) with custom inputs, step-by-step logs, and JSON trace exports.
2. **Indic Coding Harness (`indic-harness/`)**: A clean-room Claude Code-style agentic coding harness designed for **Sarvam AI** (`sarvam-30b`, `sarvam-105b`) and Indic LLMs, featuring a minimal 7-tool suite, exact-string fail-safe edits, malformed JSON auto-repair, and a 20-task dual English/Hinglish benchmark evaluation.

---

## ⚡ 30-Second Quickstart

```bash
# Clone the repository
git clone https://github.com/Lokesh-102214/algoxai.git
cd algoxai

# Install dependencies
npm install

# Option A: Launch the 3D Algorithm Visualizer Web Application
npm run dev

# Option B: Launch the Interactive Indic Coding Agent REPL (Hinglish/English)
npm run harness

# Option C: Run the 20-Task Dual-Language Benchmark Evaluator
npm run harness:eval
```

---

## 🤖 Pillar 1: Indic Coding Harness (Claude Code Style)

The **Indic Coding Harness** brings autonomous developer workflows to Indic LLMs like Sarvam AI. It implements documented, clean-room agent behaviors with zero proprietary code dependencies.

```
                  ┌────────────────────────────────────────┐
                  │    Developer Prompt (Hinglish / EN)    │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │      Interactive CLI REPL (cli.ts)     │
                  │  Slash commands: /madad, /todo, /clear │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │     Autonomous Multi-Turn Loop         │
                  │   Self-correction & Step Guards        │
                  └───────┬────────────────────────▲───────┘
                          │                        │
            Model Request │                        │ Tool Results
                          ▼                        │
         ┌─────────────────────────────────┐       │
         │      Provider Integration       │       │
         │ - Sarvam AI (30B / 105B)        │       │
         │ - OpenAI-compatible endpoint    │       │
         │ - Offline Deterministic Mock    │       │
         └────────────────┬────────────────┘       │
                          │                        │
                          ▼                        │
         ┌─────────────────────────────────┐       │
         │     Tool-Call Repair Layer      │       │
         │ - Strip markdown code fences    │       │
         │ - Repair unquoted keys/commas   │       │
         │ - Tag fallback (<tool_call>)    │       │
         └────────────────┬────────────────┘       │
                          │ Clean Calls            │
                          ▼                        │
         ┌─────────────────────────────────────────┴───────┐
         │             Claude Code 7-Tool Suite            │
         │ • read  • write • edit  • bash  • grep • glob   │
         │ • todo  (Session planning checklist)            │
         └─────────────────────────────────────────────────┘
```

### Key Capabilities:
- **Minimal 7-Tool Claude Code Suite:**
  - `read`: Line numbers, pagination (`start_line`, `line_count`), and workspace confinement.
  - `write`: File creation with auto-creation of missing parent directories.
  - `edit`: **Exact-string replacement** preventing line-number drift. Fails safely if the target string is missing or matches non-uniquely.
  - `bash`: Shell execution with destructive command blocklist (`rm -rf /`, `mkfs`, fork bombs) and 240-line output truncation.
  - `grep`: Codebase regex/string search ignoring `node_modules` and `.git`.
  - `glob`: Pattern-based file discovery.
  - `todo`: Session task tracker (`add`, `complete`, `in_progress`, `list`, `clear`).
- **Tool-Call Repair Layer:** Auto-heals malformed JSON generated by smaller/Indic models (trailing commas, single quotes, markdown fences, unquoted keys) with automated retry.
- **Dual English & Hinglish Benchmark:** Evaluates 20 real-world tasks across 4 categories (**Bug Fix**, **Refactor**, **Test Writing**, **Repo Q&A**) and computes pass rates, step counts, and the **Hinglish performance gap**.
- **Interactive CLI REPL:** Run `npm run harness` for interactive developer assistance with commands like `/help`, `/madad`, `/todo`, `/clear`, `/saaf`, `/lang`, and `/model`.

👉 **[Read the complete Indic Harness Documentation](indic-harness/README.md)**

---

## 👁️ Pillar 2: Observable Algorithm Engine & Component Library

Algorithms are hard to debug and hard to teach because traditional visualizers are closed web toys with hardcoded inputs. **AlgoXAI** provides decoupled, testable algorithm engines and embeddable React visualizers.

### Visualizer & Engine Catalogue

| Visualizer | Algorithm Engine | Interactive Capabilities | Developer Features |
|---|---|---|---|
| **3D Binary Search Tree** | `src/lib/algorithms/trees.ts` | 3D orbit controls, zoom, dynamic insertion, search, in-order traversal | Custom initial array input, URL permalink sharing, JSON trace export |
| **Grid Pathfinding** | `src/lib/algorithms/pathfinding.ts` | A* heuristic search vs Dijkstra, click & drag obstacle walls, maze presets | Shortest path resolution, step delay controls, JSON trace export |
| **Sorting Algorithms** | `src/lib/algorithms/sorting.ts` | Bubble sort, Selection sort, Insertion sort with color-coded states | Custom array inputs, real-time comparison step logs, JSON trace export |
| **Graph Traversal** | `src/lib/algorithms/graphs.ts` | Breadth-First Search (BFS) and Depth-First Search (DFS) on 2D canvas | Interactive start/target node selection, shortest path reconstruction |
| **Tower of Hanoi** | `src/lib/algorithms/hanoi.ts` | Recursive divide-and-conquer optimal move generator ($2^n - 1$) | Configurable disc count (3–8), move counter, step playback |

### Reusable Pure Engines (Zero UI Dependencies)

The visualizer renderer is completely decoupled from the computation. Pure algorithm engines run in any JavaScript/TypeScript runtime (Node.js, edge workers, CLIs, browsers) and return immutable step arrays.

#### Example: Pathfinding Engine (A* Search)

```ts
import { createGrid, aStarGrid } from 'algoxai';

// 1. Setup grid with start and target coordinates
const start = { row: 0, col: 0 };
const target = { row: 10, col: 10 };
const grid = createGrid(15, 15, start, target);

// 2. Add custom obstacle walls
grid[5][5].isWall = true;
grid[5][6].isWall = true;

// 3. Compute optimal path with step-by-step trace
const result = aStarGrid(grid, start, target);

console.log(result.found);      // true
console.log(result.totalCost);  // 20
console.log(result.path);       // [{ row: 0, col: 0 }, ..., { row: 10, col: 10 }]
console.log(result.steps[0]);   // { type: 'visit', description: 'Expanding (0, 0)...' }
```

#### Example: 3D Binary Search Tree Engine

```ts
import { buildBSTFromArray, bstInsertSteps, bstSearchSteps } from 'algoxai';

const tree = buildBSTFromArray([50, 30, 70, 20, 40, 60, 80]);
const insertTrace = bstInsertSteps(tree, 45);
const searchTrace = bstSearchSteps(insertTrace.at(-1)!.state, 60);

// Every step contains human-readable explanation and immutable tree snapshot
console.log(searchTrace[0].description); // "Compare 60 with 50 → go right"
```

---

## 📊 Honest Competitor Comparison

| Feature | AlgoXAI | VisuAlgo | Algorithm Visualizer | USFCA |
|---|---|---|---|---|
| **License** | **MIT (Open Source)** | Proprietary | Open Source | Proprietary (Free) |
| **React Component Library** | **Yes (`npm install algoxai`)** | No | No | No |
| **Indic Coding Agent Harness** | **Yes (Sarvam AI / Claude Code Style)** | No | No | No |
| **3D Spatial Visualizers** | **Yes (Three.js / R3F)** | No (2D only) | No (2D only) | No (2D only) |
| **Self-Hostable** | **Yes (Single-command build)** | No | Yes | No |
| **Custom Inputs** | **Yes (URL params & UI inputs)** | Limited | Yes | Limited |
| **Decoupled TypeScript Engines**| **Yes (Zero-dep, pure functions)** | No | No | No |
| **Step Trace JSON Export** | **Yes (LLM & test friendly)** | No | No | No |
| **Automated Test Suite** | **31+ tests passing (100% in CI)** | Untested | Untested | Untested |

---

## 🛠️ Developer Scripts & CLI Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start local Vite development server for the visualizer web app |
| `npm run build` | Build production bundle for the visualizer application |
| `npm run build:lib` | Build dual ESM + UMD library bundle with TypeScript declarations (`dist/lib`) |
| `npm run typecheck` | Run TypeScript compiler typechecks |
| `npm run harness` | Launch interactive Indic coding agent terminal REPL CLI |
| `npm run harness:probe` | Test Sarvam AI API endpoints, auth headers, and tool-call schemas |
| `npm run harness:eval` | Run the 20-task dual English & Hinglish benchmark evaluation |
| `npm run harness:test` | Run the harness Vitest test suite (31/31 passing) |

---

## 📁 Repository Structure

```
algoxai/
├── indic-harness/              # Claude Code style agent harness for Indic LLMs
│   ├── src/
│   │   ├── agent/             # Loop, system prompt, and JSON repair layer
│   │   ├── providers/         # Sarvam AI, OpenAI-compatible, & Mock providers
│   │   ├── tools/             # read, write, edit, bash, grep, glob, todo
│   │   ├── cli.ts             # Interactive terminal REPL
│   │   ├── probe.ts           # API diagnostic runner
│   │   └── types.ts           # Core interfaces
│   ├── eval/                  # 20-task benchmark dataset, runner, & scorecard
│   ├── tests/                 # 31 unit tests (tools, repair, agent loop)
│   └── README.md              # Dedicated harness documentation
├── src/                       # Algorithm visualizer web app & component library
│   ├── components/            # UI & 3D visualization components
│   ├── lib/algorithms/        # Pure decoupled algorithm engines (BST, A*, Sorting, etc.)
│   └── pages/                 # Visualizer labs, benchmark pages, & explorer
├── docs/                      # Strategic reframe, visual principles, & architecture
├── ARCHITECTURE.md            # Engine-renderer separation design guide
├── CONTRIBUTING.md            # Contribution guide
└── README.md                  # Project overview (this file)
```

---

## 📄 License

MIT © [AlgoXAI Contributors](LICENSE). Built for developers, engineering teams, and educators who want observable algorithms and accessible agentic coding.
