/**
 * AlgoXAI: The AI-Native Algorithm & Competitive Programming Component Library
 * Reusable visualizers, interactive code runners, and mathematical algorithm engines.
 */

// Visualizer Components
export { default as SortingVisualizer } from '@/components/visualizers/SortingVisualizer';
export { default as GraphVisualizer } from '@/components/visualizers/GraphVisualizer';
export { default as TowerOfHanoi } from '@/components/visualizers/TowerOfHanoi';
export { default as BST3DVisualizer } from '@/components/visualizers/BST3DVisualizer';

// Developer Experience & AI Components
export { default as CodeEditor } from '@/components/CodeEditor';
export { default as AICodePanel } from '@/components/AICodePanel';
export { default as MarkdownRenderer } from '@/components/MarkdownRenderer';
export { default as ErrorBoundary } from '@/components/ErrorBoundary';
export { default as AuthGuard } from '@/components/AuthGuard';

// Pure Algorithm Engines
export {
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  isSorted,
} from './algorithms/sorting';
export type { SortingStep } from './algorithms/sorting';

export {
  bfs,
  dfs,
  buildAdjacencyList,
} from './algorithms/graphs';
export type {
  GraphNode,
  GraphEdge,
  TraversalResult,
} from './algorithms/graphs';

export {
  solveHanoi,
  calculateMinMoves,
  validateHanoiSequence,
} from './algorithms/hanoi';
export type { HanoiMove } from './algorithms/hanoi';

export {
  bstInsertSteps,
  bstSearchSteps,
  bstInOrderSteps,
  buildBSTFromArray,
  bstHeight,
} from './algorithms/trees';
export type { BSTNode, BSTState, BSTStep, BSTStepType } from './algorithms/trees';
