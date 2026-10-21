/**
 * Binary Search Tree (BST) Algorithm Engine
 * Pure, side-effect-free functions that return step arrays for visualization.
 * Time Complexity: O(h) per operation where h = tree height (O(log n) balanced, O(n) worst).
 */

// ─── Data Structures ─────────────────────────────────────────────────────────

export interface BSTNode {
  id: number;       // unique identifier (same as value for simplicity)
  value: number;
  left: number | null;   // child node id
  right: number | null;  // child node id
  parent: number | null; // parent node id
  depth: number;         // depth from root (root = 0)
  x: number;             // logical x position for layout
  y: number;             // logical y position for layout
}

export type BSTNodeMap = Map<number, BSTNode>;

export interface BSTState {
  nodes: BSTNodeMap;
  root: number | null;
}

export type BSTStepType =
  | 'compare'      // comparing search value to node
  | 'insert'       // newly inserted node
  | 'visit'        // visiting a node during traversal
  | 'found'        // target node found
  | 'not-found'    // search ended, value not found
  | 'delete'       // node being deleted
  | 'highlight'    // general highlight
  | 'done';        // algorithm complete

export interface BSTStep {
  type: BSTStepType;
  nodeId: number | null;
  description: string;
  state: BSTState;    // snapshot of tree at this step
}

// ─── Layout Computation ───────────────────────────────────────────────────────

/**
 * Computes x/y positions for all nodes in the BST for 3D layout.
 * Uses a simple in-order spacing algorithm.
 */
export function computeLayout(state: BSTState): BSTState {
  const nodes = new Map<number, BSTNode>(
    [...state.nodes.entries()].map(([k, v]) => [k, { ...v }])
  );

  let xCounter = 0;

  function assignX(id: number | null): void {
    if (id === null) return;
    const node = nodes.get(id)!;
    assignX(node.left);
    node.x = xCounter++;
    assignX(node.right);
  }

  function assignY(id: number | null, depth: number): void {
    if (id === null) return;
    const node = nodes.get(id)!;
    node.depth = depth;
    node.y = -depth;
    assignY(node.left, depth + 1);
    assignY(node.right, depth + 1);
  }

  assignX(state.root);
  assignY(state.root, 0);

  // Centre x positions
  const xs = [...nodes.values()].map(n => n.x);
  const midX = xs.length > 0 ? (Math.min(...xs) + Math.max(...xs)) / 2 : 0;
  nodes.forEach(n => { n.x = n.x - midX; });

  return { root: state.root, nodes };
}

// ─── Deep Clone Helpers ───────────────────────────────────────────────────────

function cloneState(state: BSTState): BSTState {
  return {
    root: state.root,
    nodes: new Map([...state.nodes.entries()].map(([k, v]) => [k, { ...v }])),
  };
}

// ─── Insert ──────────────────────────────────────────────────────────────────

/**
 * Generates step-by-step trace of inserting a value into the BST.
 */
export function bstInsertSteps(initialState: BSTState, value: number): BSTStep[] {
  const steps: BSTStep[] = [];
  let state = cloneState(initialState);

  function insertRec(nodeId: number | null, parentId: number | null): number {
    if (nodeId === null) {
      // Insert here
      const newNode: BSTNode = {
        id: value,
        value,
        left: null,
        right: null,
        parent: parentId,
        depth: parentId !== null ? (state.nodes.get(parentId)!.depth + 1) : 0,
        x: 0,
        y: 0,
      };
      state.nodes.set(value, newNode);
      if (parentId === null) state.root = value;
      state = computeLayout(state);
      steps.push({
        type: 'insert',
        nodeId: value,
        description: `Inserted ${value} into the tree`,
        state: cloneState(state),
      });
      return value;
    }

    const node = state.nodes.get(nodeId)!;
    steps.push({
      type: 'compare',
      nodeId,
      description: `Compare ${value} with ${node.value} → go ${value < node.value ? 'left' : 'right'}`,
      state: cloneState(state),
    });

    if (value < node.value) {
      const childId = insertRec(node.left, nodeId);
      state.nodes.get(nodeId)!.left = childId;
    } else if (value > node.value) {
      const childId = insertRec(node.right, nodeId);
      state.nodes.get(nodeId)!.right = childId;
    } else {
      steps.push({
        type: 'found',
        nodeId,
        description: `${value} already exists in the tree`,
        state: cloneState(state),
      });
    }
    return nodeId;
  }

  insertRec(state.root, null);
  steps.push({ type: 'done', nodeId: null, description: 'Insert complete', state: cloneState(state) });
  return steps;
}

// ─── Search ──────────────────────────────────────────────────────────────────

/**
 * Generates step-by-step trace of searching for a value in the BST.
 */
export function bstSearchSteps(state: BSTState, target: number): BSTStep[] {
  const steps: BSTStep[] = [];
  let current = state.root;

  while (current !== null) {
    const node = state.nodes.get(current)!;
    steps.push({
      type: 'compare',
      nodeId: current,
      description: `Compare ${target} with ${node.value}`,
      state: cloneState(state),
    });

    if (target === node.value) {
      steps.push({
        type: 'found',
        nodeId: current,
        description: `Found ${target}!`,
        state: cloneState(state),
      });
      return steps;
    }

    current = target < node.value ? node.left : node.right;
  }

  steps.push({
    type: 'not-found',
    nodeId: null,
    description: `${target} not found in tree`,
    state: cloneState(state),
  });
  return steps;
}

// ─── In-Order Traversal ───────────────────────────────────────────────────────

/**
 * Generates step-by-step in-order traversal (Left → Root → Right).
 */
export function bstInOrderSteps(state: BSTState): BSTStep[] {
  const steps: BSTStep[] = [];

  function traverse(nodeId: number | null): void {
    if (nodeId === null) return;
    const node = state.nodes.get(nodeId)!;
    traverse(node.left);
    steps.push({
      type: 'visit',
      nodeId,
      description: `Visit ${node.value}`,
      state: cloneState(state),
    });
    traverse(node.right);
  }

  traverse(state.root);
  steps.push({ type: 'done', nodeId: null, description: 'In-order traversal complete', state: cloneState(state) });
  return steps;
}

// ─── Build Tree from Array ────────────────────────────────────────────────────

/**
 * Builds a BST from an array of values, returning the final state.
 */
export function buildBSTFromArray(values: number[]): BSTState {
  let state: BSTState = { root: null, nodes: new Map() };
  for (const v of values) {
    const steps = bstInsertSteps(state, v);
    state = steps[steps.length - 1].state;
  }
  return state;
}

// ─── Height ──────────────────────────────────────────────────────────────────

export function bstHeight(state: BSTState, nodeId: number | null = state.root): number {
  if (nodeId === null) return 0;
  const node = state.nodes.get(nodeId)!;
  return 1 + Math.max(bstHeight(state, node.left), bstHeight(state, node.right));
}
