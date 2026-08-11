import { describe, expect, it } from "vitest";

import { generateBinarySearchSteps } from "../algorithms/binarySearch";
import { generateLinearSearchSteps } from "../algorithms/linearSearch";

describe("linear search", () => {
  it("finds the first occurrence of the target", () => {
    const steps = generateLinearSearchSteps([4, 8, 15, 8, 23], 8);
    const last = steps[steps.length - 1];

    expect(last).toMatchObject({ foundIndex: 1, done: true });
    expect(steps.filter((step) => step.currentIndex !== undefined)).toHaveLength(2);
  });

  it("reports not found after checking every element", () => {
    const steps = generateLinearSearchSteps([1, 2, 3], 9);
    const last = steps[steps.length - 1];

    expect(last).toMatchObject({ notFound: true, done: true });
    expect(steps.filter((step) => step.currentIndex !== undefined)).toHaveLength(3);
  });

  it("handles an empty array", () => {
    const steps = generateLinearSearchSteps([], 1);

    expect(steps).toEqual([{ array: [], notFound: true, done: true }]);
  });
});

describe("binary search", () => {
  const sorted = [-5, 1, 3, 8, 13, 21, 34, 55, 89];

  it.each(sorted.map((value, index) => [value, index]))(
    "finds %i at index %i",
    (value, index) => {
      const steps = generateBinarySearchSteps(sorted, value);
      const last = steps[steps.length - 1];

      expect(last).toMatchObject({ foundIndex: index, done: true });
    }
  );

  it("needs at most floor(log2(n)) + 1 probes", () => {
    const large = Array.from({ length: 1000 }, (_, i) => i * 2);

    for (const target of [0, 998, 1998, 7, -1, 5000]) {
      const probes = generateBinarySearchSteps(large, target).filter(
        (step) => step.currentIndex !== undefined && !step.done
      );

      expect(probes.length).toBeLessThanOrEqual(Math.floor(Math.log2(large.length)) + 1);
    }
  });

  it("returns an index holding the target when values repeat", () => {
    const withDuplicates = [1, 2, 2, 2, 3];
    const steps = generateBinarySearchSteps(withDuplicates, 2);
    const foundIndex = steps[steps.length - 1].foundIndex;

    expect(foundIndex).toBeDefined();
    expect(withDuplicates[foundIndex!]).toBe(2);
  });

  it.each([-10, 2, 100])("reports %i as not found", (target) => {
    const steps = generateBinarySearchSteps(sorted, target);

    expect(steps[steps.length - 1]).toMatchObject({ notFound: true, done: true });
  });

  it("handles an empty array", () => {
    expect(generateBinarySearchSteps([], 3)).toEqual([
      { array: [], notFound: true, done: true },
    ]);
  });
});
