import { describe, it, expect } from 'vitest';
import {
  createGrid,
  manhattanDistance,
  dijkstraGrid,
  aStarGrid,
  getNeighbors,
} from '../pathfinding';

describe('Pathfinding Engine (Dijkstra & A*)', () => {
  it('creates grid with proper dimensions, start, and target nodes', () => {
    const start = { row: 0, col: 0 };
    const target = { row: 4, col: 4 };
    const grid = createGrid(5, 5, start, target);

    expect(grid.length).toBe(5);
    expect(grid[0].length).toBe(5);
    expect(grid[0][0].isStart).toBe(true);
    expect(grid[4][4].isTarget).toBe(true);
    expect(grid[2][2].isWall).toBe(false);
  });

  it('computes accurate Manhattan distance', () => {
    expect(manhattanDistance({ row: 0, col: 0 }, { row: 3, col: 4 })).toBe(7);
    expect(manhattanDistance({ row: 2, col: 5 }, { row: 2, col: 5 })).toBe(0);
    expect(manhattanDistance({ row: 5, col: 1 }, { row: 1, col: 1 })).toBe(4);
  });

  it('finds valid neighbors respecting boundaries and walls', () => {
    const grid = createGrid(3, 3, { row: 0, col: 0 }, { row: 2, col: 2 });
    grid[0][1].isWall = true;

    const neighbors = getNeighbors(grid, { row: 0, col: 0 });
    expect(neighbors).toEqual([{ row: 1, col: 0 }]); // right is wall, only down is valid
  });

  it('finds optimal shortest path using Dijkstra on an unblocked grid', () => {
    const start = { row: 0, col: 0 };
    const target = { row: 2, col: 2 };
    const grid = createGrid(3, 3, start, target);

    const result = dijkstraGrid(grid, start, target);
    expect(result.found).toBe(true);
    expect(result.totalCost).toBe(4);
    expect(result.path.length).toBe(5); // 0,0 -> 1,0 -> 2,0 -> 2,1 -> 2,2 (or similar 4 moves)
    expect(result.path[0]).toEqual(start);
    expect(result.path[result.path.length - 1]).toEqual(target);
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('navigates around walls with Dijkstra', () => {
    const start = { row: 0, col: 0 };
    const target = { row: 0, col: 2 };
    const grid = createGrid(3, 3, start, target);

    // Wall in between: (0, 1) and (1, 1)
    grid[0][1].isWall = true;
    grid[1][1].isWall = true;

    const result = dijkstraGrid(grid, start, target);
    expect(result.found).toBe(true);
    // Must go down to row 2 and up
    expect(result.totalCost).toBeGreaterThan(2);
    expect(result.path.some(p => p.row === 2)).toBe(true);
  });

  it('returns found: false when target is completely enclosed by walls', () => {
    const start = { row: 0, col: 0 };
    const target = { row: 2, col: 2 };
    const grid = createGrid(3, 3, start, target);

    // Completely enclose target (2, 2)
    grid[1][2].isWall = true;
    grid[2][1].isWall = true;

    const result = dijkstraGrid(grid, start, target);
    expect(result.found).toBe(false);
    expect(result.path).toEqual([]);
    expect(result.totalCost).toBe(Infinity);
  });

  it('finds optimal path using A* search', () => {
    const start = { row: 0, col: 0 };
    const target = { row: 3, col: 3 };
    const grid = createGrid(4, 4, start, target);

    const result = aStarGrid(grid, start, target);
    expect(result.found).toBe(true);
    expect(result.totalCost).toBe(6);
    expect(result.path[0]).toEqual(start);
    expect(result.path[result.path.length - 1]).toEqual(target);
  });

  it('A* explores fewer or equal nodes compared to uninformed search on empty grid', () => {
    const start = { row: 0, col: 0 };
    const target = { row: 4, col: 4 };
    const gridA = createGrid(5, 5, start, target);
    const gridD = createGrid(5, 5, start, target);

    const astar = aStarGrid(gridA, start, target);
    const dijkstra = dijkstraGrid(gridD, start, target);

    expect(astar.found).toBe(true);
    expect(dijkstra.found).toBe(true);
    expect(astar.totalCost).toBe(dijkstra.totalCost); // Same optimal shortest path
    expect(astar.visitedNodes.length).toBeLessThanOrEqual(dijkstra.visitedNodes.length);
  });
});
