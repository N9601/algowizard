import { describe, expect, it, vi } from "vitest";

import { generateBinaryTreeInsertSteps } from "../algorithms/binaryTreeInsert";
import { generateHeapInsertSteps } from "../algorithms/heapInsertSteps";
import { generateTree } from "../graph/treeGenerator";

// GraphCanvas draws a 500 x 340 viewBox with node circles of radius 18.
const RADIUS = 18;

function expectInsideCanvas(nodes: { x: number; y: number }[]) {
  for (const node of nodes) {
    expect(node.x - RADIUS).toBeGreaterThanOrEqual(0);
    expect(node.x + RADIUS).toBeLessThanOrEqual(500);
    expect(node.y - RADIUS).toBeGreaterThanOrEqual(0);
    expect(node.y + RADIUS).toBeLessThanOrEqual(340);
  }
}

describe("graph layouts", () => {
  it("keeps every node of random trees on the canvas", () => {
    for (let run = 0; run < 500; run++) {
      expectInsideCanvas(generateTree().nodes);
    }
  });

  it("keeps a degenerate chain on the canvas", () => {
    // Always attaching to the newest node produces a chain of depth 7.
    const random = vi.spyOn(Math, "random").mockReturnValue(0.9999);
    const { nodes } = generateTree(7);
    random.mockRestore();

    expect(new Set(nodes.map((node) => node.y)).size).toBe(7);
    expectInsideCanvas(nodes);
  });

  it("centers the binary tree and heap layouts on the canvas", () => {
    const values = [0, 1, 4, 2, 3, 5, 6];

    for (const steps of [
      generateBinaryTreeInsertSteps(values),
      generateHeapInsertSteps(values),
    ]) {
      const last = steps[steps.length - 1];
      expectInsideCanvas(last.nodes);
      expect(last.nodes[0].x).toBe(250);
    }
  });
});
