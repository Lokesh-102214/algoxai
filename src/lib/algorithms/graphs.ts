/**
 * Graph Traversal Algorithms
 * Pure BFS & DFS search functions returning visitation order and reconstructed shortest paths.
 */

export interface GraphNode {
  id: number;
  label?: string;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
}

export interface TraversalResult {
  found: boolean;
  visitOrder: number[];
  path: number[];
  distance: number;
}

/**
 * Builds an adjacency list from nodes and undirected edges.
 */
export function buildAdjacencyList(nodes: GraphNode[], edges: GraphEdge[]): Map<number, number[]> {
  const adj = new Map<number, number[]>();
  nodes.forEach(n => adj.set(n.id, []));

  edges.forEach(({ from, to }) => {
    if (!adj.has(from)) adj.set(from, []);
    if (!adj.has(to)) adj.set(to, []);
    adj.get(from)!.push(to);
    adj.get(to)!.push(from);
  });

  return adj;
}

/**
 * Breadth-First Search (BFS)
 * Guarantees shortest path in unweighted graphs.
 * Time Complexity: O(V + E). Space: O(V).
 */
export function bfs(nodes: GraphNode[], edges: GraphEdge[], startId: number, targetId: number): TraversalResult {
  const adj = buildAdjacencyList(nodes, edges);
  const queue: number[] = [startId];
  const visited = new Set<number>([startId]);
  const parent = new Map<number, number>();
  const visitOrder: number[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    visitOrder.push(current);

    if (current === targetId) {
      // Reconstruct path
      const path: number[] = [];
      let curr: number | undefined = targetId;
      while (curr !== undefined) {
        path.unshift(curr);
        curr = parent.get(curr);
      }
      return {
        found: true,
        visitOrder,
        path,
        distance: path.length - 1,
      };
    }

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  return {
    found: false,
    visitOrder,
    path: [],
    distance: -1,
  };
}

/**
 * Depth-First Search (DFS)
 * Explores along each branch before backtracking.
 * Time Complexity: O(V + E). Space: O(V).
 */
export function dfs(nodes: GraphNode[], edges: GraphEdge[], startId: number, targetId: number): TraversalResult {
  const adj = buildAdjacencyList(nodes, edges);
  const visited = new Set<number>();
  const parent = new Map<number, number>();
  const visitOrder: number[] = [];

  function dfsVisit(current: number): boolean {
    visited.add(current);
    visitOrder.push(current);

    if (current === targetId) {
      return true;
    }

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        parent.set(neighbor, current);
        if (dfsVisit(neighbor)) return true;
      }
    }
    return false;
  }

  const found = dfsVisit(startId);

  if (found) {
    const path: number[] = [];
    let curr: number | undefined = targetId;
    while (curr !== undefined) {
      path.unshift(curr);
      curr = parent.get(curr);
    }
    return {
      found: true,
      visitOrder,
      path,
      distance: path.length - 1,
    };
  }

  return {
    found: false,
    visitOrder,
    path: [],
    distance: -1,
  };
}
