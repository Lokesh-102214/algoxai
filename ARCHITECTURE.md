# AlgoXAI Architecture Guide

AlgoXAI is built on an **Engine-First, Presentation-Decoupled** architecture. By strictly separating algorithm execution from graphic rendering, AlgoXAI provides both browser-independent algorithm engines and pluggable 2D/3D visualizers.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      LAYER 1: PURE ALGORITHM ENGINES                   │
│                      (src/lib/algorithms/)                            │
│                                                                        │
│  • Pure, deterministic TypeScript functions                            │
│  • Zero framework dependencies (no React, no Three.js, no DOM)         │
│  • Emits immutable step arrays with human-readable descriptions        │
│  • 100% unit test coverage via Vitest (runs in Node.js in milliseconds)│
│  • Usable in CLI tools, node services, test suites, or AI prompt feeds │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Step Trace (JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      LAYER 2: PLUGGABLE RENDERERS                      │
│                      (src/components/visualizers/)                     │
│                                                                        │
│  • React components consuming step traces                             │
│  • 3D Spatial Scenes: Three.js + React Three Fiber + Drei (BST)       │
│  • 2D Interactive Grid: Canvas / DOM (Pathfinding, Sorting, Hanoi)     │
│  • UI Controls: Speed sliders, Play/Pause/Reset, Custom inputs         │
│  • Shareable Permalinks: URL query state (?tool=...&input=...)         │
│  • Step Trace Exporter: JSON download for test fixtures & LLMs         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Pure Algorithm Engines (`src/lib/algorithms/`)

All computational logic lives in `src/lib/algorithms/`. Engines have **zero React or Three.js dependencies** and run anywhere JavaScript or TypeScript runs:

- **Sorting (`sorting.ts`)**: `bubbleSortSteps`, `selectionSortSteps`, `insertionSortSteps`, `isSorted`.
- **Graph Traversal (`graphs.ts`)**: `bfs`, `dfs`, `buildAdjacencyList`.
- **Recursion (`hanoi.ts`)**: `solveHanoi`, `calculateMinMoves`, `validateHanoiSequence`.
- **Tree Structures (`trees.ts`)**: `bstInsertSteps`, `bstSearchSteps`, `bstInOrderSteps`, `buildBSTFromArray`, `bstHeight`, `computeLayout`.
- **Pathfinding (`pathfinding.ts`)**: `dijkstraGrid`, `aStarGrid`, `createGrid`, `manhattanDistance`, `reconstructPath`, `getNeighbors`.

### Step Snapshot Contract

Every step in an engine trace complies with a standardized snapshot schema:

```ts
export interface AlgorithmStep<TState> {
  type: string;               // 'compare' | 'swap' | 'visit' | 'neighbor' | 'path' | 'done'
  description: string;        // Human-readable narrative of the operation decision
  state?: TState;             // Immutable snapshot of data structure at this instant
  indices?: number[];         // Active indices being compared or operated on
  coord?: { row: number; col: number }; // Active coordinate in spatial/grid algorithms
}
```

This contract allows:
1. **Time-travel debugging:** Scrub backwards and forwards through any algorithm execution.
2. **AI prompt grounding:** Feed the step array to LLMs to automatically generate plain-English explanations.
3. **Automated test fixtures:** Capture golden test files from complex graph searches.

---

## 2. Pluggable Renderers (`src/components/visualizers/`)

Renderers receive state snapshots and own visual concerns:
- **`BST3DVisualizer.tsx`**: Renders hierarchical spatial tree nodes using React Three Fiber. Features 3D orbit controls, dynamic depth layers, and custom array inputs.
- **`PathfindingVisualizer.tsx`**: Renders interactive grid navigation. Supports wall placement by drag-and-drop, Dijkstra, and A* heuristic visualization.
- **`SortingVisualizer.tsx`**: Renders bar chart comparison sweeps with custom array validation, step explanation logs, and JSON trace downloads.
- **`GraphVisualizer.tsx`**: HTML5 Canvas rendering for node-edge network exploration with shortest path highlighting.
- **`TowerOfHanoi.tsx`**: Disc peg visualization illustrating recursive stack decomposition.

---

## 3. Deep Linking & Shareable Permalinks

`VisualizationPage.tsx` manages catalog routing and permalink synchronization:

- `?tool=bst3d&input=50,30,70,20,40`: Opens 3D BST initialized with custom nodes.
- `?tool=pathfinding&algo=astar`: Opens A* heuristic grid pathfinding.
- `?tool=sorting&algo=bubble&input=64,34,25,12,22`: Opens sorting visualizer with custom array.

Developers can copy and paste permalinks into GitHub PR comments, Slack/Teams messages, or internal Confluence/Notion documentation to reproduce exact algorithm behavior.

---

## 4. Dual Library Build System

AlgoXAI is distributed both as a full web application and as an npm-installable component and engine library:

- **Web Application Build:** Standard Vite SPA output in `dist/`.
- **Library Build (`vite.lib.config.ts`):** 
  - ESM module: `dist/lib/algoxai.js`
  - UMD bundle: `dist/lib/algoxai.umd.cjs`
  - TypeScript definitions: `dist/lib/index.d.ts` generated via `vite-plugin-dts`

Organizations can install AlgoXAI via npm and import only the pure engines into node backends or CLI tools without bundling any Three.js or visual overhead.
