/**
 * Tower of Hanoi Recursive Solver & Validator
 */

export interface HanoiMove {
  from: number;
  to: number;
}

/**
 * Calculates theoretical minimum moves required: 2^n - 1.
 */
export function calculateMinMoves(disks: number): number {
  if (disks <= 0) return 0;
  return Math.pow(2, disks) - 1;
}

/**
 * Generates the optimal sequence of moves to solve the Tower of Hanoi puzzle.
 * Peg 0: Source, Peg 1: Auxiliary, Peg 2: Destination.
 * Time Complexity: O(2^n). Space: O(n) call stack.
 */
export function solveHanoi(
  disks: number,
  from = 0,
  to = 2,
  aux = 1
): HanoiMove[] {
  if (disks <= 0) return [];
  if (disks === 1) {
    return [{ from, to }];
  }

  const moves: HanoiMove[] = [];
  // Move n-1 disks from source to auxiliary using destination as buffer
  moves.push(...solveHanoi(disks - 1, from, aux, to));
  // Move largest disk from source to destination
  moves.push({ from, to });
  // Move n-1 disks from auxiliary to destination using source as buffer
  moves.push(...solveHanoi(disks - 1, aux, to, from));

  return moves;
}

/**
 * Validates whether a sequence of moves solves the puzzle under standard Hanoi rules:
 * 1. Only 1 disk can be moved at a time.
 * 2. A disk can never be placed on top of a smaller disk.
 * 3. All disks start at peg 0 and end at peg 2.
 */
export function validateHanoiSequence(disks: number, moves: HanoiMove[]): boolean {
  if (disks <= 0) return moves.length === 0;

  // Initialize pegs
  const pegs: number[][] = [
    Array.from({ length: disks }, (_, i) => disks - i), // [disks, ..., 1]
    [],
    [],
  ];

  for (const { from, to } of moves) {
    if (from < 0 || from > 2 || to < 0 || to > 2 || from === to) return false;
    if (pegs[from].length === 0) return false;

    const movingDisk = pegs[from].pop()!;
    const destTop = pegs[to][pegs[to].length - 1];

    if (destTop !== undefined && destTop < movingDisk) {
      return false; // Cannot place larger disk onto smaller disk
    }

    pegs[to].push(movingDisk);
  }

  // Check destination peg has all disks
  if (pegs[2].length !== disks) return false;
  for (let i = 0; i < disks; i++) {
    if (pegs[2][i] !== disks - i) return false;
  }

  return true;
}
