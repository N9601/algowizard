import { SortingStep } from "../types";

export function generateSelectionSortSteps(
  input: number[]
): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...input];
  const n = arr.length;

  const sortedIndices: number[] = [];

  for (let i = 0; i < n; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      // Comparing current minimum with j
      steps.push({
        array: [...arr],
        comparing: [minIndex, j],
        sortedIndices: [...sortedIndices],
      });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap if needed
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

      steps.push({
        array: [...arr],
        swapping: [i, minIndex],
        sortedIndices: [...sortedIndices],
      });
    }

    sortedIndices.push(i);

    // Mark index as sorted
    steps.push({
      array: [...arr],
      sortedIndices: [...sortedIndices],
    });
  }

  return steps;
}
