<div align="center">

# AlgoXAI

<img src="./gemini-svg.svg" alt="AlgoXAI logo" width="260" />

### Open-source, interactive 3D algorithm lab

**Don’t just read algorithms. Explore them.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-powered-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Get started](#quick-start) · [Explore visualizers](#visualizer-catalogue) · [Contribute](#contributing) · [Architecture](#architecture)

</div>

---

## Why AlgoXAI

Algorithms are often taught through static diagrams or animations you cannot influence. That format hides the decisions that matter: which branch was chosen, what state changed, and why the complexity changes.

AlgoXAI is an open-source lab for turning those invisible decisions into something learners can manipulate. Each visualizer follows a simple loop:

1. **Change the input or state.** Insert a value, select a path, choose an operation.
2. **Watch the algorithm decide.** Follow comparisons, traversal order, and structural changes step by step.
3. **Connect the scene to the idea.** See the active state, the operation explanation, and the relevant complexity together.

The project is useful without an account, inspectable in source, and designed to be extended by educators and contributors.

## Visualizer catalogue

| Visualizer | What you can explore | Interaction |
| --- | --- | --- |
| **3D Binary Search Tree** | Insert, search, and in-order traversal in a spatial tree | Orbit, zoom, insert values, replay each decision |
| **Sorting** | Bubble sort, selection sort, and insertion sort | Change size and speed; inspect each operation |
| **Graph traversal** | BFS and DFS exploration | Create/select nodes and follow traversal paths |
| **Tower of Hanoi** | Recursive decomposition and the minimum-move constraint | Choose disk count and animate the optimal solution |

The 3D BST is the foundation for the next generation of scenes: data structures that benefit from spatial reasoning rather than decorative 3D effects.

## Who it is for

- **Learners:** Build intuition before writing or memorising code.
- **Educators:** Open a scene in class, share a URL, and ask students to predict the next state.
- **Content creators:** Use the visualizers or the pure engines as a starting point for explanations.
- **Contributors:** Add an algorithm engine, a scene, tests, and an explanation that makes a difficult idea clearer.

## Quick start

### Prerequisites

- Node.js 18 or later
- npm 9 or later

```bash
git clone https://github.com/Lokesh-102214/algoxai.git
cd algoxai
npm install
npm run dev
```

Open the local URL printed by Vite, then select **Visualize**. To go directly to the 3D BST, open:

```text
/visualizations?tool=bst3d
```

Other built-in deep links are `?tool=sorting`, `?tool=graph`, and `?tool=hanoi`.

### Quality checks

```bash
npm run typecheck
npm test
npm run build
```

## Use the algorithm engines

The algorithm logic is kept separate from the UI so that it can be tested, reused, and visualized in different ways.

```ts
import {
  buildBSTFromArray,
  bstInsertSteps,
  bstSearchSteps,
  bstInOrderSteps,
} from "./src/lib/algorithms/trees";

const tree = buildBSTFromArray([50, 30, 70, 20, 40, 60, 80]);
const insertTrace = bstInsertSteps(tree, 35);
const searchTrace = bstSearchSteps(insertTrace.at(-1)!.state, 60);
const traversal = bstInOrderSteps(tree);
```

Each step contains a description, an active node, and an immutable tree-state snapshot. This makes it straightforward to build alternate renderers, lesson plans, command-line demonstrations, or accessibility-first experiences.

Existing engines also cover sorting, graph traversal, and Tower of Hanoi. The public exports are collected in [`src/lib/index.ts`](src/lib/index.ts).

## Design principles

This project will grow around a few non-negotiable principles:

- **Interaction before spectacle.** 3D is used only when spatial controls help explain the algorithm.
- **One concept per scene.** A visualizer should make a learner’s next question obvious, not overload them with controls.
- **State is inspectable.** Important operations have a visible active state and plain-language explanation.
- **Progressive depth.** A newcomer can press play; an advanced learner can manipulate inputs and inspect the engine.
- **Open by default.** No account is required to explore core visualizers, and the code is available under MIT.
- **Honest product claims.** We document what exists, test the core logic, and avoid invented usage metrics.

## Architecture

```text
src/
├── components/
│   └── visualizers/          # Interactive React scenes, including Three.js scenes
├── lib/
│   ├── algorithms/           # Pure state engines and their tests
│   │   ├── trees.ts          # BST snapshots, layout, insert/search/traversal traces
│   │   ├── sorting.ts
│   │   ├── graphs.ts
│   │   └── hanoi.ts
│   └── index.ts              # Reusable public exports
├── pages/
│   └── VisualizationPage.tsx # Discoverable, deep-linkable visualizer catalogue
└── App.tsx                   # Application routes
```

The 3D layer uses React Three Fiber and Drei. The renderer consumes the same predictable state snapshots exposed by the pure algorithm engine.

## Contributing

The best contribution is not just another animation—it is a clearer way to understand a hard concept.

1. Fork the repository and create a focused branch.
2. Start with a pure engine in `src/lib/algorithms/`.
3. Add unit tests that prove the trace is correct.
4. Build a visualizer that exposes the decisions in that trace.
5. Include useful keyboard/accessibility behaviour and concise learner-facing instructions.
6. Run `npm run typecheck`, `npm test`, and `npm run build`.
7. Open a pull request explaining the concept, interaction model, and what learners can discover.

### Visualizer contribution checklist

- Does the visual add insight that code or a flat diagram does not?
- Can a first-time visitor start exploring within a few seconds?
- Is the active state and the next outcome understandable without reading implementation details?
- Are controls usable with a keyboard or accompanied by a non-drag alternative where possible?
- Is the algorithm engine testable without a browser or renderer?

## Roadmap

Near-term work focuses on high-leverage scenes and shared usability primitives:

- More 3D structures where spatial interaction adds genuine explanatory value.
- Shareable presets and lesson-friendly deep links.
- A consistent playback, step, and state-inspection API across visualizers.
- Stronger keyboard navigation, reduced-motion options, and text alternatives for scenes.
- Contributor templates for a pure engine, scene, tests, and documentation.

## License

AlgoXAI is available under the [MIT License](LICENSE).
