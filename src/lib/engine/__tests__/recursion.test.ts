import { describe, expect, it } from "vitest";

import { generateRecursionSteps } from "../algorithms/recursion";

describe("factorial recursion trace", () => {
  it.each([1, 3, 5, 10])("grows to depth %i and fully unwinds", (n) => {
    const steps = generateRecursionSteps(n);
    const depths = steps.map((step) => step.stack.length);
    const last = steps[steps.length - 1];

    expect(Math.max(...depths)).toBe(n);
    expect(last.done).toBe(true);
    expect(last.stack).toEqual([]);
  });

  it("keeps exactly one frame per active call, ordered from n down", () => {
    const n = 4;

    for (const step of generateRecursionSteps(n)) {
      step.stack.forEach((frame, index) => {
        expect(frame.n).toBe(n - index);
      });
    }
  });

  it("returns n! and shows each partial result on the returning frame", () => {
    const steps = generateRecursionSteps(4);
    const returning = steps
      .map((step) => step.stack[step.stack.length - 1])
      .filter((frame) => frame?.status === "returning")
      .map((frame) => [frame.n, frame.result]);

    expect(returning).toEqual([
      [1, 1],
      [2, 2],
      [3, 6],
      [4, 24],
    ]);
    expect(steps[steps.length - 1].message).toBe("Final result: 24");
  });
});
