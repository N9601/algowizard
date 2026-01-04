import { SortingStep } from "../types";

export function generateQuickSortSteps(array: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...array];

  function quickSort(low: number, high: number) {
    if (low >= high) return;

    const pivotIndex = partition(low, high);
    quickSort(low, pivotIndex - 1);
    quickSort(pivotIndex + 1, high);
  }

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, high],
      });

      if (arr[j] < pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];

        steps.push({
          array: [...arr],
          swapping: [i, j],
        });

        i++;
      }
    }

    [arr[i], arr[high]] = [arr[high], arr[i]];

    steps.push({
      array: [...arr],
      swapping: [i, high],
    });

    return i;
  }

  quickSort(0, arr.length - 1);

  steps.push({
    array: [...arr],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
  });

  return steps;
}
