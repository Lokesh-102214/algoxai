import { describe, it, expect } from 'vitest';
import {
  solveHanoi,
  calculateMinMoves,
  validateHanoiSequence,
} from '../hanoi';

describe('Tower of Hanoi Algorithm', () => {
  describe('calculateMinMoves', () => {
    it('returns 0 for 0 disks', () => {
      expect(calculateMinMoves(0)).toBe(0);
    });

    it('returns correct 2^n - 1 minimum moves', () => {
      expect(calculateMinMoves(1)).toBe(1);
      expect(calculateMinMoves(2)).toBe(3);
      expect(calculateMinMoves(3)).toBe(7);
      expect(calculateMinMoves(4)).toBe(15);
      expect(calculateMinMoves(5)).toBe(31);
    });
  });

  describe('solveHanoi', () => {
    it('generates the exact optimal number of moves', () => {
      for (let n = 1; n <= 6; n++) {
        const moves = solveHanoi(n);
        expect(moves.length).toBe(calculateMinMoves(n));
      }
    });

    it('generates a strictly valid sequence of moves according to rules', () => {
      for (let n = 1; n <= 5; n++) {
        const moves = solveHanoi(n);
        const isValid = validateHanoiSequence(n, moves);
        expect(isValid).toBe(true);
      }
    });

    it('returns empty array for non-positive disks', () => {
      expect(solveHanoi(0)).toEqual([]);
      expect(solveHanoi(-2)).toEqual([]);
    });
  });

  describe('validateHanoiSequence', () => {
    it('rejects an invalid sequence where a larger disk is placed on smaller disk', () => {
      // 2 disks: move disk 1 to peg 1, then illegally move disk 2 onto peg 1
      const illegalMoves = [
        { from: 0, to: 1 },
        { from: 0, to: 1 }, // disk 2 placed on disk 1!
      ];
      expect(validateHanoiSequence(2, illegalMoves)).toBe(false);
    });

    it('rejects moving from an empty peg', () => {
      const illegalMoves = [{ from: 1, to: 2 }];
      expect(validateHanoiSequence(2, illegalMoves)).toBe(false);
    });
  });
});
