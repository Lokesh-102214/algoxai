/**
 * Pathfinding Algorithm Engine (Dijkstra & A*)
 * Pure, side-effect-free functions that calculate shortest paths on a 2D grid
 * with obstacles, returning immutable step snapshots for visualization and analysis.
 */

export interface GridCoord {
  row: number;
  col: number;
}

export interface GridNode extends GridCoord {
  isWall: boolean;
  isStart: boolean;
  isTarget: boolean;
  distance: number;       // g-score (cost from start)
  heuristic: number;      // h-score (estimated cost to target)
  totalCost: number;      // f-score = g + h
  visited: boolean;
  parent: GridCoord | null;
}

export type GridMap = GridNode[][];

export type PathfindingStepType =
  | 'visit'        // inspecting/expanding a cell
  | 'neighbor'     // evaluating neighbor and updating tentative distance
  | 'path'         // tracing final shortest path
  | 'no-path'      // search exhausted without reaching target
  | 'done';        // algorithm complete

export interface PathfindingStep {
  type: PathfindingStepType;
  coord: GridCoord | null;
  description: string;
  visitedCount: number;
  currentPath?: GridCoord[];
}

export interface PathfindingResult {
  found: boolean;
  path: GridCoord[];
  visitedNodes: GridCoord[];
  steps: PathfindingStep[];
  totalCost: number;
}

/**
 * Creates an empty grid of given rows and columns.
 */
export function createGrid(rows: number, cols: number, start: GridCoord, target: GridCoord): GridMap {
  const grid: GridMap = [];
  for (let r = 0; r < rows; r++) {
    const row: GridNode[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isWall: false,
        isStart: r === start.row && c === start.col,
        isTarget: r === target.row && c === target.col,
        distance: Infinity,
        heuristic: 0,
        totalCost: Infinity,
        visited: false,
        parent: null,
      });
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Manhattan distance heuristic for grid-based A* pathfinding.
 */
export function manhattanDistance(a: GridCoord, b: GridCoord): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Reconstructs path from target back to start via parent pointers.
 */
export function reconstructPath(grid: GridMap, target: GridCoord): GridCoord[] {
  const path: GridCoord[] = [];
  let curr: GridCoord | null = target;

  while (curr !== null) {
    path.unshift({ row: curr.row, col: curr.col });
    const node = grid[curr.row][curr.col];
    curr = node.parent;
  }
  return path;
}

/**
 * Gets valid unvisited orthogonal neighbors (Up, Down, Left, Right).
 */
export function getNeighbors(grid: GridMap, node: GridCoord): GridCoord[] {
  const neighbors: GridCoord[] = [];
  const { row, col } = node;
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 },  // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 },  // Right
  ];

  for (const { row: dr, col: dc } of directions) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      if (!grid[nr][nc].isWall) {
        neighbors.push({ row: nr, col: nc });
      }
    }
  }

  return neighbors;
}

/**
 * Dijkstra's Shortest Path Algorithm on a Grid.
 * Guarantees optimal path in weighted/unweighted graphs with non-negative edge weights.
 */
export function dijkstraGrid(
  initialGrid: GridMap,
  start: GridCoord,
  target: GridCoord
): PathfindingResult {
  // Deep clone grid
  const grid: GridMap = initialGrid.map(row => row.map(cell => ({ ...cell })));
  const steps: PathfindingStep[] = [];
  const visitedNodes: GridCoord[] = [];

  grid[start.row][start.col].distance = 0;
  grid[start.row][start.col].totalCost = 0;

  const unvisited: GridCoord[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (!grid[r][c].isWall) {
        unvisited.push({ row: r, col: c });
      }
    }
  }

  while (unvisited.length > 0) {
    // Sort to extract minimum distance node
    unvisited.sort((a, b) => grid[a.row][a.col].distance - grid[b.row][b.col].distance);
    const closest = unvisited.shift()!;
    const node = grid[closest.row][closest.col];

    if (node.distance === Infinity) {
      steps.push({
        type: 'no-path',
        coord: null,
        description: 'Remaining nodes are unreachable. No path to target exists.',
        visitedCount: visitedNodes.length,
      });
      return { found: false, path: [], visitedNodes, steps, totalCost: Infinity };
    }

    node.visited = true;
    visitedNodes.push({ row: closest.row, col: closest.col });

    steps.push({
      type: 'visit',
      coord: { row: closest.row, col: closest.col },
      description: `Visited (${closest.row}, ${closest.col}) with distance ${node.distance}`,
      visitedCount: visitedNodes.length,
    });

    if (closest.row === target.row && closest.col === target.col) {
      const path = reconstructPath(grid, target);
      steps.push({
        type: 'path',
        coord: target,
        description: `Target reached! Reconstructed shortest path of ${path.length - 1} steps.`,
        visitedCount: visitedNodes.length,
        currentPath: path,
      });
      steps.push({
        type: 'done',
        coord: null,
        description: 'Dijkstra search complete.',
        visitedCount: visitedNodes.length,
        currentPath: path,
      });
      return {
        found: true,
        path,
        visitedNodes,
        steps,
        totalCost: node.distance,
      };
    }

    const neighbors = getNeighbors(grid, closest);
    for (const neighbor of neighbors) {
      const neighborNode = grid[neighbor.row][neighbor.col];
      if (!neighborNode.visited) {
        const alt = node.distance + 1; // unit edge cost
        if (alt < neighborNode.distance) {
          neighborNode.distance = alt;
          neighborNode.totalCost = alt;
          neighborNode.parent = { row: closest.row, col: closest.col };
          steps.push({
            type: 'neighbor',
            coord: neighbor,
            description: `Updated tentative distance to (${neighbor.row}, ${neighbor.col}) to ${alt}`,
            visitedCount: visitedNodes.length,
          });
        }
      }
    }
  }

  return { found: false, path: [], visitedNodes, steps, totalCost: Infinity };
}

/**
 * A* Pathfinding Algorithm on a Grid using Manhattan Distance Heuristic.
 * Balances path length with direct distance to target for efficient traversal.
 */
export function aStarGrid(
  initialGrid: GridMap,
  start: GridCoord,
  target: GridCoord
): PathfindingResult {
  const grid: GridMap = initialGrid.map(row => row.map(cell => ({ ...cell })));
  const steps: PathfindingStep[] = [];
  const visitedNodes: GridCoord[] = [];

  const startNode = grid[start.row][start.col];
  startNode.distance = 0;
  startNode.heuristic = manhattanDistance(start, target);
  startNode.totalCost = startNode.heuristic;

  const openSet: GridCoord[] = [{ row: start.row, col: start.col }];
  const inOpenSet = new Set<string>([`${start.row},${start.col}`]);

  while (openSet.length > 0) {
    // Select node with lowest f-score (totalCost)
    openSet.sort((a, b) => {
      const nodeA = grid[a.row][a.col];
      const nodeB = grid[b.row][b.col];
      if (nodeA.totalCost === nodeB.totalCost) {
        return nodeA.heuristic - nodeB.heuristic;
      }
      return nodeA.totalCost - nodeB.totalCost;
    });

    const current = openSet.shift()!;
    inOpenSet.delete(`${current.row},${current.col}`);
    const currentNode = grid[current.row][current.col];

    currentNode.visited = true;
    visitedNodes.push({ row: current.row, col: current.col });

    steps.push({
      type: 'visit',
      coord: current,
      description: `Expanding (${current.row}, ${current.col}) [g: ${currentNode.distance}, h: ${currentNode.heuristic}, f: ${currentNode.totalCost}]`,
      visitedCount: visitedNodes.length,
    });

    if (current.row === target.row && current.col === target.col) {
      const path = reconstructPath(grid, target);
      steps.push({
        type: 'path',
        coord: target,
        description: `Target reached with A*! Shortest path length: ${path.length - 1} steps.`,
        visitedCount: visitedNodes.length,
        currentPath: path,
      });
      steps.push({
        type: 'done',
        coord: null,
        description: 'A* search complete.',
        visitedCount: visitedNodes.length,
        currentPath: path,
      });
      return {
        found: true,
        path,
        visitedNodes,
        steps,
        totalCost: currentNode.distance,
      };
    }

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const neighborNode = grid[neighbor.row][neighbor.col];
      if (neighborNode.visited) continue;

      const tentativeG = currentNode.distance + 1;
      if (tentativeG < neighborNode.distance) {
        neighborNode.parent = { row: current.row, col: current.col };
        neighborNode.distance = tentativeG;
        neighborNode.heuristic = manhattanDistance(neighbor, target);
        neighborNode.totalCost = neighborNode.distance + neighborNode.heuristic;

        const key = `${neighbor.row},${neighbor.col}`;
        if (!inOpenSet.has(key)) {
          openSet.push(neighbor);
          inOpenSet.add(key);
        }

        steps.push({
          type: 'neighbor',
          coord: neighbor,
          description: `Evaluated neighbor (${neighbor.row}, ${neighbor.col}) [g: ${neighborNode.distance}, h: ${neighborNode.heuristic}, f: ${neighborNode.totalCost}]`,
          visitedCount: visitedNodes.length,
        });
      }
    }
  }

  steps.push({
    type: 'no-path',
    coord: null,
    description: 'No valid path found to target from start.',
    visitedCount: visitedNodes.length,
  });

  return { found: false, path: [], visitedNodes, steps, totalCost: Infinity };
}
