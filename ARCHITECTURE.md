# Architecture

AlgoXAI separates algorithm correctness from presentation so a renderer can evolve without changing the computation it teaches.

```text
user controls
   ↓
pure algorithm engine → immutable state / step trace
   ↓                         ↓
visualizer renderer ← explanation and active state
```

## Algorithm engines

`src/lib/algorithms/` contains deterministic, browser-independent TypeScript. Engines expose small data structures and functions that return complete snapshots or traces. Tests belong alongside the engines in `__tests__/`.

## Visualizers

`src/components/visualizers/` renders engine state and owns display-only concerns such as camera movement, playback speed, and UI controls. The 3D BST uses React Three Fiber and Drei; its engine remains usable without either dependency.

## Discovery and deep links

`VisualizationPage` owns the catalogue and maps visualizers to a `?tool=` query parameter. A visualizer should have a stable value so educators and contributors can share a direct route.

## Deployment

The GitHub Pages workflow builds under `/algoxai/`; root-hosted environments such as the custom-domain Vercel deployment build under `/`. `BrowserRouter` and public asset paths use Vite’s base URL, and the workflow creates a fallback `404.html` for client-side routes.
