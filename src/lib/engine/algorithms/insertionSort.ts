import { SortingStep } from "../types";

export function generateInsertionSortSteps(array: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...array];
  const n = arr.length;
  const sorted: number[] = [];

  for (let i = 1; i < n; i++) {
    let j = i;

    while (j > 0) {
      steps.push({
        array: [...arr],
        comparing: [j - 1, j],
        sortedIndices: [...sorted],
      });

      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];

        steps.push({
          array: [...arr],
          swapping: [j - 1, j],
          sortedIndices: [...sorted],
        });
      } else {
        break;
      }

      j--;
    }

    sorted.push(i);
  }

  steps.push({
    array: [...arr],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
}
