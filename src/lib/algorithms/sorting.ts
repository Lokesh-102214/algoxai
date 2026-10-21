/**
 * Sorting Algorithm Implementations & Step Generators
 * Pure functions suitable for both computational execution and visualizer animation feeds.
 */

export interface SortingStep {
  type: 'compare' | 'swap' | 'overwrite' | 'sorted';
  indices: number[];
  snapshot: number[];
  description?: string;
}

/**
 * Checks if an array is sorted in non-decreasing order.
 */
export function isSorted(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

/**
 * Generates visualization steps for Bubble Sort.
 * Time Complexity: O(n^2) average/worst, O(n) best. Space: O(1).
 */
export function bubbleSortSteps(input: number[]): SortingStep[] {
  const arr = [...input];
  const steps: SortingStep[] = [];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        snapshot: [...arr],
        description: `Comparing index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]})`,
      });

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          snapshot: [...arr],
          description: `Swapped index ${j} and ${j + 1}`,
        });
      }
    }

    steps.push({
      type: 'sorted',
      indices: [n - i - 1],
      snapshot: [...arr],
      description: `Element at index ${n - i - 1} is now in its sorted position`,
    });

    if (!swapped) break;
  }

  // Mark all as sorted in the final step
  steps.push({
    type: 'sorted',
    indices: Array.from({ length: n }, (_, i) => i),
    snapshot: [...arr],
    description: 'Array is completely sorted',
  });

  return steps;
}

/**
 * Generates visualization steps for Selection Sort.
 * Time Complexity: O(n^2) all cases. Space: O(1).
 */
export function selectionSortSteps(input: number[]): SortingStep[] {
  const arr = [...input];
  const steps: SortingStep[] = [];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'compare',
        indices: [minIdx, j],
        snapshot: [...arr],
        description: `Comparing current minimum at index ${minIdx} (${arr[minIdx]}) with index ${j} (${arr[j]})`,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        type: 'swap',
        indices: [i, minIdx],
        snapshot: [...arr],
        description: `Placed smallest remaining element (${arr[i]}) at index ${i}`,
      });
    }

    steps.push({
      type: 'sorted',
      indices: [i],
      snapshot: [...arr],
    });
  }

  steps.push({
    type: 'sorted',
    indices: Array.from({ length: n }, (_, i) => i),
    snapshot: [...arr],
    description: 'Array is completely sorted',
  });

  return steps;
}

/**
 * Generates visualization steps for Insertion Sort.
 * Time Complexity: O(n^2) worst/average, O(n) best. Space: O(1).
 */
export function insertionSortSteps(input: number[]): SortingStep[] {
  const arr = [...input];
  const steps: SortingStep[] = [];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      type: 'compare',
      indices: [j, i],
      snapshot: [...arr],
      description: `Picking key ${key} at index ${i}`,
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        snapshot: [...arr],
      });

      arr[j + 1] = arr[j];
      steps.push({
        type: 'overwrite',
        indices: [j + 1],
        snapshot: [...arr],
      });
      j--;
    }
    arr[j + 1] = key;

    steps.push({
      type: 'overwrite',
      indices: [j + 1],
      snapshot: [...arr],
    });
  }

  steps.push({
    type: 'sorted',
    indices: Array.from({ length: n }, (_, i) => i),
    snapshot: [...arr],
    description: 'Array is completely sorted',
  });

  return steps;
}
