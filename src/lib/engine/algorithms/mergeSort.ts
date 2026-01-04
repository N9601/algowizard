import { SortingStep } from "../types";

export function generateMergeSortSteps(input: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...input];
  const temp = Array(arr.length);

  function merge(start: number, mid: number, end: number) {
    let i = start;
    let j = mid + 1;
    let k = start;

    while (i <= mid && j <= end) {
      steps.push({
        array: [...arr],
        activeRange: [start, end],
        comparing: [i, j],
      });

      if (arr[i] <= arr[j]) {
        temp[k++] = arr[i++];
      } else {
        temp[k++] = arr[j++];
      }
    }

    while (i <= mid) {
      temp[k++] = arr[i++];
    }

    while (j <= end) {
      temp[k++] = arr[j++];
    }

    for (let x = start; x <= end; x++) {
      arr[x] = temp[x];
      steps.push({
        array: [...arr],
        activeRange: [start, end],
      });
    }
  }

  function mergeSort(start: number, end: number) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    mergeSort(start, mid);
    mergeSort(mid + 1, end);
    merge(start, mid, end);
  }

  mergeSort(0, arr.length - 1);

  steps.push({
    array: [...arr],
    sortedIndices: arr.map((_, i) => i),
  });

  return steps;
}
