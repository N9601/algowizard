import { describe, expect, it } from "vitest";

import { generateBubbleSortSteps } from "../algorithms/bubbleSort";
import { generateHeapSortSteps } from "../algorithms/heapSort";
import { generateInsertionSortSteps } from "../algorithms/insertionSort";
import { generateMergeSortSteps } from "../algorithms/mergeSort";
import { generateQuickSortSteps } from "../algorithms/quickSort";
import { generateSelectionSortSteps } from "../algorithms/selectionSort";
import type { SortingStep } from "../types";

const sorters: Record<string, (input: number[]) => SortingStep[]> = {
  bubble: generateBubbleSortSteps,
  selection: generateSelectionSortSteps,
  insertion: generateInsertionSortSteps,
  merge: generateMergeSortSteps,
  quick: generateQuickSortSteps,
  heap: generateHeapSortSteps,
};

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

const random = seededRandom(42);
const largeInput = Array.from({ length: 200 }, () => Math.floor(random() * 1000));

const cases: Record<string, number[]> = {
  empty: [],
  single: [7],
  pair: [2, 1],
  duplicates: [5, 3, 5, 1, 3, 5],
  allEqual: [4, 4, 4, 4],
  negatives: [3, -1, 0, -7, 2],
  alreadySorted: [1, 2, 3, 4, 5],
  reversed: [9, 7, 5, 3, 1],
  large: largeInput,
};

function finalArray(steps: SortingStep[], input: number[]) {
  return steps.length ? steps[steps.length - 1].array : input;
}

describe.each(Object.entries(sorters))("%s sort", (_name, generate) => {
  it.each(Object.entries(cases))("sorts %s input", (_label, input) => {
    const steps = generate(input);
    const expected = [...input].sort((a, b) => a - b);

    expect(finalArray(steps, input)).toEqual(expected);
  });

  it("does not mutate its input", () => {
    const input = [4, 2, 9, 1];
    generate(input);

    expect(input).toEqual([4, 2, 9, 1]);
  });

  it("only highlights indices inside the array", () => {
    const input = [6, 2, 8, 4, 1, 9, 3];

    for (const step of generate(input)) {
      const indices = [
        ...(step.comparing ?? []),
        ...(step.swapping ?? []),
        ...(step.sortedIndices ?? []),
      ];

      for (const index of indices) {
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(input.length);
      }
    }
  });
});
