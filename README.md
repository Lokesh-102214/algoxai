<div align="center">

<img src="./gemini-svg.svg" alt="AlgoXAI logo" width="110" />

# AlgoXAI

### *See algorithms think. The open-source observable algorithm engine & component library.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-powered-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Vitest-41%20passing-brightgreen?logo=vitest&logoColor=white)](https://vitest.dev/)

[Live Demo](https://www.algoxai.tech/) · [Visualizer Lab](https://www.algoxai.tech/visualizations) · [Product Strategy](docs/strategy.md) · [Architecture](ARCHITECTURE.md) · [Contribute](CONTRIBUTING.md)

</div>

---

> **Algorithms are hard to debug and hard to teach because you can't see them.**  
> Most visualizers are closed, proprietary web toys with hardcoded inputs that developers abandon after landing a job.  
> **AlgoXAI is developer infrastructure:** an open-source React component library and pure TypeScript algorithm engine that makes data structures observable, testable, and embeddable wherever you work.

---

## Why AlgoXAI?

| For Developers & Engineering Teams | For Learners & Interview Preppers |
|---|---|
| **Embed in living documentation:** Drop interactive visualizers into your docs site, internal portal, or LMS. | **Break past toy demos:** Enter *your own custom inputs* (arrays, trees, wall mazes) to test failing edge cases. |
| **Enhance code reviews:** Share a permalink URL with exact state encoded to explain recursive or spatial logic in PR comments. | **Understand the "Why":** Step-by-step narrative logs explain every comparison, swap, and heuristic decision. |
| **Export execution traces:** Download immutable JSON step traces for unit test fixtures or LLM reasoning prompts. | **Spatial 3D mental models:** Orbit and zoom through 3D trees and spatial graphs to internalize depth and balance. |
| **Pure, zero-dependency engines:** Import tested algorithm engines directly into Node.js backends, scripts, or CLIs. | **Generalize, don't memorize:** Learn invariant logic that transfers to novel real-world engineering problems. |

---

## 30-Second Quickstart

```bash
git clone https://github.com/Lokesh-102214/algoxai.git
cd algoxai
npm install
npm run dev
```

Open the printed Vite URL. Navigate straight to the 3D Binary Search Tree with `/visualizations?tool=bst3d` or Pathfinding with `/visualizations?tool=pathfinding`.

---

## Visualizer & Engine Catalogue

| Visualizer | Algorithm Engine | Interactive Capabilities | Developer Features |
|---|---|---|---|
| **3D Binary Search Tree** | `src/lib/algorithms/trees.ts` | 3D orbit controls, zoom, dynamic insertion, search, in-order traversal | Custom initial array input, URL permalink sharing, JSON trace export |
| **Grid Pathfinding** | `src/lib/algorithms/pathfinding.ts` | A* heuristic search vs Dijkstra, click & drag obstacle walls, maze presets | Shortest path resolution, step delay controls, JSON trace export |
| **Sorting Algorithms** | `src/lib/algorithms/sorting.ts` | Bubble sort, Selection sort, Insertion sort with color-coded states | Custom array inputs, real-time comparison step logs, JSON trace export |
| **Graph Traversal** | `src/lib/algorithms/graphs.ts` | Breadth-First Search (BFS) and Depth-First Search (DFS) on 2D canvas | Interactive start/target node selection, shortest path reconstruction |
| **Tower of Hanoi** | `src/lib/algorithms/hanoi.ts` | Recursive divide-and-conquer optimal move generator ($2^n - 1$) | Configurable disc count (3–8), move counter, step playback |

---

## Reuse the Engines (Zero UI Dependencies)

The visualizer renderer is completely decoupled from the computation. Pure algorithm engines run in any JavaScript/TypeScript runtime (Node.js, edge workers, CLIs, browsers) and return immutable step arrays.

### Example: Pathfinding Engine (A* Search)

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

### Example: 3D Binary Search Tree Engine

```ts
import { buildBSTFromArray, bstInsertSteps, bstSearchSteps } from 'algoxai';

const tree = buildBSTFromArray([50, 30, 70, 20, 40, 60, 80]);
const insertTrace = bstInsertSteps(tree, 45);
const searchTrace = bstSearchSteps(insertTrace.at(-1)!.state, 60);

// Every step contains human-readable explanation and immutable tree snapshot
console.log(searchTrace[0].description); // "Compare 60 with 50 → go right"
```

---

## Honest Competitor Comparison

| Feature | AlgoXAI | VisuAlgo | Algorithm Visualizer | USFCA |
|---|---|---|---|---|
| **License** | **MIT (Open Source)** | Proprietary | Open Source | Proprietary (Free) |
| **React Component Library** | **Yes (`npm install algoxai`)** | No | No | No |
| **3D Spatial Visualizers** | **Yes (Three.js / R3F)** | No (2D only) | No (2D only) | No (2D only) |
| **Self-Hostable** | **Yes (Single-command build)** | No | Yes | No |
| **Custom Inputs** | **Yes (URL params & UI inputs)** | Limited | Yes | Limited |
| **Decoupled TypeScript Engines** | **Yes (Zero-dep, pure functions)** | No | No | No |
| **Step Trace JSON Export** | **Yes (LLM & test friendly)** | No | No | No |
| **Shareable URL Permalinks** | **Yes (`?tool=...&input=...`)** | Limited | No | No |
| **Automated Test Suite** | **41 tests passing (100% in CI)** | Untested | Untested | Untested |

---

## Core Market Use Cases

1. **Engineering Team Onboarding Accelerator:** Deploy AlgoXAI into internal wikis (Notion, Confluence, Backstage). New hires explore your system's underlying data structures with live, interactive simulations instead of stale whiteboard photos.
2. **Living Documentation for OSS Libraries:** Library maintainers import pure engines (`bfs`, `aStarGrid`, `bstInsertSteps`) to embed interactive explainers into documentation sites.
3. **Code Review Enhancement:** Paste a permalink into GitHub PR reviews (e.g. `/visualizations?tool=sorting&input=4,1,3,2`) to show team members exactly how an algorithm handles an edge-case.
4. **Generalizable Interview Preparation:** Test custom tricky arrays or custom maze walls to build intuitive problem-solving mental models rather than memorizing pre-baked answers.
5. **Classroom & Bootcamp Curriculum:** Self-hostable, free, and embeddable into any LMS without subscription fees or vendor lock-in.
6. **Internal Developer Platform (IDP) Plugin:** Clean dual ESM/UMD packaging enables direct inclusion in internal engineering portals.

---

## Project Documentation

- **[Strategic Product Reframe (docs/strategy.md)](docs/strategy.md):** Market analysis, 6 audience personas, roadmap phases, and positioning.
- **[Architecture Guide (ARCHITECTURE.md)](ARCHITECTURE.md):** Engine-first separation, step snapshot contracts, and renderer decoupling.
- **[Contribution Guide (CONTRIBUTING.md)](CONTRIBUTING.md):** How to add a new algorithm engine and visualizer in under 1 hour.
- **[Visual Design Principles (docs/principles.md)](docs/principles.md):** Guidelines for clean dark-theme styling, accessible interactions, and no neon glares.

---

## Development & Verification

Requirements: Node.js 18+ and npm 9+.

```bash
npm run typecheck    # Run TypeScript compiler checks
npm test             # Run Vitest test suite (41/41 passing)
npm run build        # Build production web application
npm run build:lib    # Build dual ESM + UMD library bundle with d.ts types
```

---

## License

MIT © [AlgoXAI Contributors](LICENSE). Built for developers and teams who want to understand algorithms at work.
