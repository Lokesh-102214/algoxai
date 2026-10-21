import { describe, it, expect } from 'vitest';
import { bfs, dfs, buildAdjacencyList, GraphNode, GraphEdge } from '../graphs';

describe('Graph Traversal Algorithms', () => {
  // 0 -- 1 -- 2
  // |    |
  // 3 -- 4    5 (disconnected)
  const nodes: GraphNode[] = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ];

  const edges: GraphEdge[] = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 0, to: 3 },
    { from: 3, to: 4 },
    { from: 1, to: 4 },
  ];

  describe('buildAdjacencyList', () => {
    it('creates an undirected adjacency map', () => {
      const adj = buildAdjacencyList(nodes, edges);
      expect(adj.get(0)).toContain(1);
      expect(adj.get(0)).toContain(3);
      expect(adj.get(1)).toContain(0);
      expect(adj.get(5)).toEqual([]);
    });
  });

  describe('Breadth-First Search (BFS)', () => {
    it('finds the shortest path between two reachable nodes', () => {
      const result = bfs(nodes, edges, 0, 2);
      expect(result.found).toBe(true);
      expect(result.path).toEqual([0, 1, 2]);
      expect(result.distance).toBe(2);
    });

    it('finds alternative paths through intermediate vertices', () => {
      const result = bfs(nodes, edges, 0, 4);
      expect(result.found).toBe(true);
      // Shortest path to 4 is either [0, 1, 4] or [0, 3, 4], both have distance 2
      expect(result.distance).toBe(2);
      expect(result.path[0]).toBe(0);
      expect(result.path[result.path.length - 1]).toBe(4);
    });

    it('returns found: false for unreachable nodes', () => {
      const result = bfs(nodes, edges, 0, 5);
      expect(result.found).toBe(false);
      expect(result.path).toEqual([]);
      expect(result.distance).toBe(-1);
    });

    it('handles start node equaling target node', () => {
      const result = bfs(nodes, edges, 2, 2);
      expect(result.found).toBe(true);
      expect(result.path).toEqual([2]);
      expect(result.distance).toBe(0);
    });
  });

  describe('Depth-First Search (DFS)', () => {
    it('successfully traverses and reaches target', () => {
      const result = dfs(nodes, edges, 0, 2);
      expect(result.found).toBe(true);
      expect(result.path[0]).toBe(0);
      expect(result.path[result.path.length - 1]).toBe(2);
    });

    it('returns found: false for unreachable components', () => {
      const result = dfs(nodes, edges, 0, 5);
      expect(result.found).toBe(false);
      expect(result.path).toEqual([]);
    });
  });
});
