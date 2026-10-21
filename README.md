<div align="center">

# AlgoXAI

**The AI-Native Algorithm Learning Platform & Reusable Visualizer Library**

[![CI Status](https://github.com/Lokesh-102214/algoxai/actions/workflows/ci.yml/badge.svg)](https://github.com/Lokesh-102214/algoxai/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-29%20Passing-brightgreen?logo=vitest&logoColor=white)](https://vitest.dev/)

[Explore Web App](https://github.com/Lokesh-102214/algoxai) • [Component Library](#-using-as-a-reusable-library) • [Algorithm Engines](#-pure-algorithm-engines) • [Quick Start](#-quick-start)

</div>

---

## 📌 Overview

**AlgoXAI** transforms computer science education and competitive programming preparation from static, trial-and-error problem solving into an **interactive, AI-guided learning journey**.

Traditional competitive programming platforms (LeetCode, Codeforces) present problem statements and test runners, but offer little assistance when a student is stuck on conceptual prerequisites, recurrence relations, or invariant proofs. AlgoXAI bridges this gap through two complementary layers:

1. **The Web Platform**: An end-to-end learning environment featuring diagnostic skill assessment, ordered prerequisite roadmaps, specialized multi-agent AI tutoring, rating-aware problem recommendation, and integrated code execution.
2. **The Component Library (`algoxai`)**: Self-contained, accessible React visualizer components and mathematical step generators that can be dropped into any educational platform, blog, or technical documentation.

---

## 🚀 Key Features

- **Interactive Algorithm Visualizers**:
  - **Sorting Visualizer**: Real-time comparative step execution for Bubble Sort, Selection Sort, and Insertion Sort with variable playback speed and array sizes.
  - **Graph Visualizer**: Interactive canvas supporting dynamic node creation, BFS/DFS traversal step animations, and shortest path reconstruction.
  - **Tower of Hanoi**: Recursive puzzle solver illustrating $O(2^n)$ exponential complexity and state-space transitions.
- **Multi-Agent AI Tutoring System**:
  - Contextual multi-agent routing between specialized personas (Concept Explainer, Code Reviewer, Rubber-Duck Debugger).
  - Strict pedagogical guardrails: hints and invariant questions rather than raw answer dumps.
- **Adaptive Diagnostic Engine**:
  - Prerequisite-aware skill evaluation that pinpoints specific weaknesses (e.g., recursion stack vs. dynamic programming tabulation).
  - Auto-generated, customized mastery roadmaps based on diagnostic performance.
- **Resilient & Fail-Safe Architecture**:
  - Fully functional offline guest mode with local state persistence.
  - Zero runtime crashes when optional cloud backends (Supabase) are unlinked.

---

## 📦 Using as a Reusable Library

AlgoXAI's visualizers and algorithm engines are packaged as an independent, tree-shakeable library.

### Installation

```bash
# Using npm
npm install algoxai

# Using pnpm
pnpm add algoxai

# Using yarn
yarn add algoxai
```

### Component Usage

Drop pre-built, theme-aware visualizer components directly into your React application:

```tsx
import React from 'react';
import { SortingVisualizer, GraphVisualizer, TowerOfHanoi } from 'algoxai';

export default function AlgorithmPlayground() {
  return (
    <div className="space-y-8 p-6">
      <h2>Interactive Sorting Visualizer</h2>
      <SortingVisualizer />

      <h2>Graph Traversal (BFS & DFS)</h2>
      <GraphVisualizer />

      <h2>Recursive Tower of Hanoi Solver</h2>
      <TowerOfHanoi />
    </div>
  );
}
```

---

## 🧠 Pure Algorithm Engines

AlgoXAI separates UI rendering from algorithmic execution. You can import pure algorithm engines to power custom animations, CLI tools, or educational simulations:

### 1. Sorting Step Generator

```typescript
import { bubbleSortSteps, selectionSortSteps, isSorted } from 'algoxai';

const numbers = [64, 34, 25, 12, 22, 11, 90];
const steps = bubbleSortSteps(numbers);

steps.forEach((step, index) => {
  console.log(`Step ${index} [${step.type}]: indices ${step.indices} -> [${step.snapshot}]`);
});

console.log('Final array is sorted:', isSorted(steps[steps.length - 1].snapshot)); // true
```

### 2. Graph Traversal Engine

```typescript
import { bfs, dfs } from 'algoxai';

const nodes = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
const edges = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 0, to: 3 },
  { from: 3, to: 2 },
];

// Calculate shortest path using BFS
const result = bfs(nodes, edges, 0, 2);
console.log('Shortest path:', result.path);       // [0, 1, 2]
console.log('Distance:', result.distance);         // 2
console.log('Visitation order:', result.visitOrder); // [0, 1, 3, 2]
```

### 3. Tower of Hanoi Solver & Validator

```typescript
import { solveHanoi, calculateMinMoves, validateHanoiSequence } from 'algoxai';

const disks = 3;
const minMoves = calculateMinMoves(disks); // 7 moves (2^3 - 1)
const moves = solveHanoi(disks);

console.log(`Solved in ${moves.length} moves.`);
console.log('Moves strictly valid under Hanoi rules:', validateHanoiSequence(disks, moves)); // true
```

---

## 🛠️ Quick Start (Web Platform)

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone the Repository

```bash
git clone https://github.com/Lokesh-102214/algoxai.git
cd algoxai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables (Optional)

The application includes automatic offline demo mode fallbacks. To connect a live Supabase backend:

```bash
# Copy template
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-publishable-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:8080` in your browser.

---

## 🧪 Testing & Quality Assurance

AlgoXAI includes a comprehensive unit and component testing suite powered by [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/).

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run TypeScript strict type-check
npm run typecheck

# Build reusable component library bundle
npm run build:lib

# Build web application bundle
npm run build
```

### Test Suite Status

```
Test Files  6 passed (6)
Tests       29 passed (29)
Coverage    Sorting, Graph Traversal, Hanoi, Visualizers, Auth Fallbacks
```

---

## 🏗️ Project Architecture

```
algoxai/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Automated Lint, Test & Build on push/PR
│       └── release.yml         # Tagged release and npm publishing pipeline
├── src/
│   ├── components/             # Reusable UI & Visualizer components
│   │   ├── visualizers/        # Sorting, Graph, and Hanoi visualizer widgets
│   │   ├── ui/                 # Accessible Radix + Tailwind primitives
│   │   ├── AICodePanel.tsx     # Context-aware AI code review widget
│   │   ├── CodeEditor.tsx      # Multi-language browser editor
│   │   ├── ErrorBoundary.tsx   # React crash boundary
│   │   └── Header.tsx          # Navigation header
│   ├── contexts/               # React Auth & Global state providers
│   ├── hooks/                  # Custom React hooks (useAuth, useAIChat)
│   ├── lib/                    # Core library entry & pure algorithm engines
│   │   ├── algorithms/         # Pure sorting, graph, and recursive solvers
│   │   │   ├── __tests__/      # Algorithmic unit tests
│   │   │   ├── graphs.ts       # BFS / DFS traversal algorithms
│   │   │   ├── hanoi.ts        # Hanoi solver & constraint validator
│   │   │   └── sorting.ts      # Bubble, Selection, Insertion step generators
│   │   └── index.ts            # Library export entry point
│   ├── pages/                  # Web application routes
│   └── index.css               # Calibrated Developer-Dark theme tokens
├── vite.config.ts              # Web application bundler config
├── vite.lib.config.ts          # Reusable library bundler config
├── vitest.config.ts            # Vitest unit test configuration
├── package.json                # Dual package metadata (App + Library)
└── README.md                   # Project documentation
```

---

## 🚢 CI/CD Automation

Every pull request and push to `main` executes a multi-stage GitHub Actions pipeline:

1. **Type Safety Verification**: Strict verification via `tsc --noEmit`.
2. **Automated Testing**: 29 unit and component tests via `vitest run`.
3. **Application Build**: Production bundle compilation via `vite build`.
4. **Library Build**: ESM and UMD library artifact generation via `vite build --config vite.lib.config.ts`.
5. **Package Integrity**: Dry-run verification of package tarball via `npm pack --dry-run`.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature-name`.
3. Ensure all tests pass: `npm test && npm run typecheck`.
4. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(visualizer): add merge sort step generator"
   ```
5. Push to the branch and open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.
