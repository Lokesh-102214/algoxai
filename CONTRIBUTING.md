# Contributing to AlgoXAI

Thank you for contributing to AlgoXAI. We are building the **open-source observable algorithm infrastructure** for developers, engineering teams, and technical educators.

Please review our [Strategic Product Reframe (docs/strategy.md)](docs/strategy.md) and [Architecture Guide (ARCHITECTURE.md)](ARCHITECTURE.md) to understand our goals and design principles.

---

## High-Impact Contribution Priorities

We organize contributions by market impact according to our product roadmap:

### 1. High Impact (Solves the biggest developer pain points)
- **New Pure Algorithm Engines & Visualizers:**
  - Merge Sort & Quick Sort divide-and-conquer steps
  - Min/Max Heap & Priority Queue (task scheduling)
  - Trie (prefix tree / autocomplete indexing)
  - Union-Find / Disjoint Sets (Kruskal's MST)
  - Red-Black Tree / AVL tree rebalancing
- **Shareable State & Permalinks:** Expand query parameter serialization to custom graph structures.
- **Trace Export & Import:** Add copy/paste trace import so developers can replay saved execution traces.

### 2. Medium Impact (Ecosystem & Platform integration)
- **MDX / Docusaurus / Astro Component:** Create an inline `<AlgoXAI algo="..." />` embed for developer documentation sites.
- **Web Component Target:** Compile `<algoxai-visualizer>` custom elements for vanilla HTML/Confluence embedding.
- **LLM Prompt Exporter:** Format step traces as structured prompt templates for AI code review tools.

---

## How to Add a New Algorithm in Under 1 Hour

AlgoXAI enforces a strict two-layer architecture: **Engine First, Presentation Decoupled**.

### Step 1: Write the Pure Algorithm Engine (`src/lib/algorithms/`)

Create `src/lib/algorithms/<your-algorithm>.ts`. This file must be 100% pure TypeScript with **zero React, Three.js, or DOM dependencies**:

```ts
export interface Step {
  type: string;
  description: string;
  snapshot: any;
}

export function myAlgorithmSteps(input: any): Step[] {
  const steps: Step[] = [];
  // execute algorithm logic and push immutable step snapshots
  return steps;
}
```

### Step 2: Write Unit Tests (`src/lib/algorithms/__tests__/`)

Create `src/lib/algorithms/__tests__/<your-algorithm>.test.ts`. Test:
- Normal expected operations
- Edge cases (empty array, single node, already sorted, cyclic graph)
- Step count and accuracy of step descriptions

Run:
```bash
npm test src/lib/algorithms/__tests__/<your-algorithm>.test.ts
```

### Step 3: Create the Visualizer Component (`src/components/visualizers/`)

Create `src/components/visualizers/<YourAlgorithmVisualizer>.tsx`:
- Render the step snapshots using 2D Canvas, HTML/Tailwind, or Three.js / React Three Fiber.
- Add playback controls (Play, Pause, Step Forward, Speed slider, Reset).
- Support custom user inputs and a "Share Link" button.
- Support "Export Trace (JSON)".

### Step 4: Register in `src/pages/VisualizationPage.tsx` & `src/lib/index.ts`

- Add your visualizer to the `visualizers` list in `VisualizationPage.tsx` with a unique `id`.
- Export your engine functions and component in `src/lib/index.ts`.

---

## Verification Before Submitting a PR

Always run the full verification pipeline before opening a PR:

```bash
npm run typecheck    # TypeScript compiler check
npm test             # All unit and component tests
npm run build        # Production web application bundle
npm run build:lib    # Dual ESM & UMD library bundle
```

All PRs must maintain 100% test pass rate with zero type errors.

---

## Pull Request Guidelines

1. **Title:** Use Conventional Commits (e.g., `feat(engine): add merge sort step generator`, `fix(visualizer): correct A* wall toggle`).
2. **Description:** Describe what algorithmic decision is being made observable, how custom inputs are validated, and link any related issues.
3. **Documentation:** Update `README.md` if adding a new public algorithm engine or visualizer.
