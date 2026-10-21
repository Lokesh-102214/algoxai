<div align="center">

# AlgoXAI

<img src="./gemini-svg.svg" alt="AlgoXAI logo" width="220" />

### Interactive 3D algorithm visualizers backed by pure, tested engines you can reuse in your own tools.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-powered-000000?logo=three.js&logoColor=white)](https://threejs.org/)

[Live demo](https://www.algoxai.tech/) · [Run locally](#run-locally) · [Contribute](CONTRIBUTING.md) · [Architecture](ARCHITECTURE.md)

</div>

> The demo deploys from `main` through GitHub Pages. A real 3D BST recording will be added here with the first release capture.

## Try it now

```bash
git clone https://github.com/Lokesh-102214/algoxai.git && cd algoxai && npm install && npm run dev
```

Open the URL printed by Vite. Go straight to the spatial Binary Search Tree with `/visualizations?tool=bst3d`.

## Visualizer catalogue

| Visualizer | Explore | Control |
| --- | --- | --- |
| **3D Binary Search Tree** | Insert, search, and in-order traversal in a spatial tree | Orbit, zoom, add values, replay decisions |
| **Sorting** | Bubble sort, selection sort, and insertion sort | Change data size and speed |
| **Graph traversal** | BFS and DFS | Select nodes and follow the traversal path |
| **Tower of Hanoi** | Recursive decomposition and move constraints | Choose disk count and animate the optimal solution |

## Reuse the engines

The renderer is optional. Algorithm engines produce plain state snapshots and operation traces, so they can power lessons, alternate UIs, CLIs, or your own visualizations.

```ts
import {
  buildBSTFromArray,
  bstInsertSteps,
  bstSearchSteps,
} from "./src/lib/algorithms/trees";

const tree = buildBSTFromArray([50, 30, 70, 20, 40, 60, 80]);
const insertTrace = bstInsertSteps(tree, 35);
const searchTrace = bstSearchSteps(insertTrace.at(-1)!.state, 60);
```

Every BST step has a human-readable description, active node, and immutable state snapshot. Sorting, graph traversal, and Hanoi engines follow the same separation of algorithm logic from visual rendering.

## Run locally

Requirements: Node.js 18+ and npm 9+.

```bash
npm install
npm run dev
```

Before opening a pull request:

```bash
npm run typecheck
npm test
npm run build
```

## Project docs

- [Contribution guide](CONTRIBUTING.md) — how to propose and build a visualizer.
- [Architecture](ARCHITECTURE.md) — engine, renderer, and routing boundaries.
- [Visual design principles](docs/principles.md) — the bar for useful interaction and accessible scenes.

## License

MIT. See [LICENSE](LICENSE).
