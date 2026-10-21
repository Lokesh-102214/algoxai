# Contributing to AlgoXAI

Thank you for helping make difficult algorithms easier to understand. We value clarity, correctness, and accessible interaction over decorative animation.

## Start here

1. Check the issue tracker or open a short proposal for a new visualizer.
2. Fork the repository and create a branch: `git switch -c feat/your-visualizer`.
3. Install dependencies with `npm install`.
4. Run `npm run dev` and make one focused change.

## Adding a visualizer

Every visualizer should have two layers:

1. A pure, side-effect-free engine in `src/lib/algorithms/` that returns state snapshots or operation steps.
2. A React renderer in `src/components/visualizers/` that makes those steps understandable and controllable.

Before submitting a pull request, make sure the scene:

- makes a specific algorithmic decision easier to understand;
- offers useful interaction within a few seconds of opening it;
- explains the active state in plain language;
- has keyboard-friendly controls or a non-drag alternative where drag is used;
- includes engine tests for normal and edge cases; and
- is registered in `src/pages/VisualizationPage.tsx` with a shareable `?tool=` value.

## Verification

```bash
npm run typecheck
npm test
npm run build
```

## Pull requests

Keep pull requests focused. Describe the learner problem, the interaction model, and the evidence that the algorithm trace is correct. Screenshots or a short recording are welcome for visual changes.

## Good first contributions

- Add keyboard controls to an existing scene.
- Improve a visualizer’s text explanation or empty state.
- Add a test for an untested edge case.
- Create a reduced-motion alternative for an animation.

Report bugs and accessibility gaps through the issue templates.
