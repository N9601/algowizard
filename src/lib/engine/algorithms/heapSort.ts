import { SortingStep } from "../types";

export function generateHeapSortSteps(array: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...array];
  const n = arr.length;
  const sorted: number[] = [];

  function heapify(size: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      steps.push({
        array: [...arr],
        comparing: [left, largest],
        sortedIndices: [...sorted],
      });

      if (arr[left] > arr[largest]) largest = left;
    }

    if (right < size) {
      steps.push({
        array: [...arr],
        comparing: [right, largest],
        sortedIndices: [...sorted],
      });

      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];

      steps.push({
        array: [...arr],
        swapping: [root, largest],
        sortedIndices: [...sorted],
      });

      heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    sorted.unshift(i);

    steps.push({
      array: [...arr],
      swapping: [0, i],
      sortedIndices: [...sorted],
    });

    heapify(i, 0);
  }

  steps.push({
    array: [...arr],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
}
