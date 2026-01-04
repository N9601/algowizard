import { SortingStep } from "../types";

export function generateBubbleSortSteps(
  input: number[]
): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...input];
  const n = arr.length;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      // comparison step
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        sortedIndices: [...sortedIndices],
      });

      if (arr[j] > arr[j + 1]) {
        // swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        steps.push({
          array: [...arr],
          swapping: [j, j + 1],
          sortedIndices: [...sortedIndices],
        });
      }
    }

    sortedIndices.unshift(n - i - 1);

    steps.push({
      array: [...arr],
      sortedIndices: [...sortedIndices],
    });

    if (!swapped) break;
  }

  return steps;
}
