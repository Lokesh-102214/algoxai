import { describe, it, expect } from 'vitest';
import {
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  isSorted,
} from '../sorting';

describe('Sorting Algorithms', () => {
  const sample = [64, 34, 25, 12, 22, 11, 90];
  const sortedExpected = [11, 12, 22, 25, 34, 64, 90];

  describe('isSorted utility', () => {
    it('returns true for an empty array', () => {
      expect(isSorted([])).toBe(true);
    });

    it('returns true for a single element array', () => {
      expect(isSorted([42])).toBe(true);
    });

    it('returns true for already sorted arrays', () => {
      expect(isSorted([1, 2, 3, 4, 5])).toBe(true);
    });

    it('returns false for unsorted arrays', () => {
      expect(isSorted([3, 1, 2])).toBe(false);
    });
  });

  describe('Bubble Sort', () => {
    it('sorts an arbitrary unsorted array correctly', () => {
      const steps = bubbleSortSteps(sample);
      expect(steps.length).toBeGreaterThan(0);
      const finalSnapshot = steps[steps.length - 1].snapshot;
      expect(finalSnapshot).toEqual(sortedExpected);
      expect(isSorted(finalSnapshot)).toBe(true);
    });

    it('handles already sorted array efficiently', () => {
      const steps = bubbleSortSteps([1, 2, 3, 4, 5]);
      const finalSnapshot = steps[steps.length - 1].snapshot;
      expect(finalSnapshot).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles reverse sorted array', () => {
      const steps = bubbleSortSteps([5, 4, 3, 2, 1]);
      const finalSnapshot = steps[steps.length - 1].snapshot;
      expect(finalSnapshot).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles array with duplicate numbers', () => {
      const steps = bubbleSortSteps([4, 2, 4, 1, 2]);
      const finalSnapshot = steps[steps.length - 1].snapshot;
      expect(finalSnapshot).toEqual([1, 2, 2, 4, 4]);
    });
  });

  describe('Selection Sort', () => {
    it('sorts an arbitrary unsorted array correctly', () => {
      const steps = selectionSortSteps(sample);
      const finalSnapshot = steps[steps.length - 1].snapshot;
      expect(finalSnapshot).toEqual(sortedExpected);
      expect(isSorted(finalSnapshot)).toBe(true);
    });

    it('handles array with single element', () => {
      const steps = selectionSortSteps([7]);
      const finalSnapshot = steps[steps.length - 1].snapshot;
      expect(finalSnapshot).toEqual([7]);
    });
  });

  describe('Insertion Sort', () => {
    it('sorts an arbitrary unsorted array correctly', () => {
      const steps = insertionSortSteps(sample);
      const finalSnapshot = steps[steps.length - 1].snapshot;
      expect(finalSnapshot).toEqual(sortedExpected);
      expect(isSorted(finalSnapshot)).toBe(true);
    });

    it('handles already sorted array with minimal overwrites', () => {
      const steps = insertionSortSteps([10, 20, 30]);
      const finalSnapshot = steps[steps.length - 1].snapshot;
      expect(finalSnapshot).toEqual([10, 20, 30]);
    });
  });
});
