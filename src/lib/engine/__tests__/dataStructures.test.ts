import { describe, expect, it } from "vitest";

import { generateHeapInsertSteps } from "../algorithms/heapInsertSteps";
import { generateQueueSteps } from "../algorithms/queue";
import { generateStackSteps } from "../algorithms/stack";

describe("stack", () => {
  it("pushes and pops in LIFO order", () => {
    const steps = generateStackSteps(
      [],
      [
        { type: "push", value: "A" },
        { type: "push", value: "B" },
        { type: "pop" },
      ],
      5
    );

    expect(steps.map((step) => step.stack)).toEqual([["A"], ["A", "B"], ["A"]]);
    expect(steps[2].value).toBe("B");
  });

  it("reports overflow and underflow without changing the stack", () => {
    const overflow = generateStackSteps(["A"], [{ type: "push", value: "B" }], 1);
    const underflow = generateStackSteps([], [{ type: "pop" }], 3);

    expect(overflow[0]).toMatchObject({ stack: ["A"], message: "Stack Overflow" });
    expect(underflow[0]).toMatchObject({ stack: [], message: "Stack Underflow" });
  });
});

describe("queue", () => {
  it("enqueues and dequeues in FIFO order", () => {
    const steps = generateQueueSteps(
      ["A"],
      [{ type: "enqueue", value: "B" }, { type: "dequeue" }],
      5
    );

    expect(steps.map((step) => step.queue)).toEqual([["A", "B"], ["B"]]);
    expect(steps[1].value).toBe("A");
  });

  it("reports overflow and underflow", () => {
    const overflow = generateQueueSteps(["A"], [{ type: "enqueue", value: "B" }], 1);
    const underflow = generateQueueSteps([], [{ type: "dequeue" }], 3);

    expect(overflow[0].message).toBe("Queue Overflow");
    expect(underflow[0].message).toBe("Queue Underflow");
  });
});

describe("min-heap insert", () => {
  it("keeps the heap property after every insert", () => {
    const steps = generateHeapInsertSteps([9, 4, 7, 1, 8, 2, 6]);

    for (const step of steps) {
      const heap = step.nodes.map((node) => node.id);
      for (let i = 1; i < heap.length; i++) {
        expect(heap[Math.floor((i - 1) / 2)]).toBeLessThanOrEqual(heap[i]);
      }
    }

    expect(steps.at(-1)!.nodes[0].id).toBe(1);
  });
});
