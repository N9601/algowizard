import { describe, expect, it } from "vitest";

import { generateBellmanFordSteps } from "../algorithms/bellmanFord";
import { generateBFSSteps } from "../algorithms/bfs";
import { generateDFSSteps } from "../algorithms/dfs";
import { generateDijkstraSteps } from "../algorithms/dijkstra";
import { generateTopoSteps } from "../algorithms/topologicalSort";
import { generateRandomDAG } from "../graph/dagGenerator";
import { generateTree } from "../graph/treeGenerator";
import { generateWeightedGraph } from "../graph/weightedGraphGenerator";

const diamond: Record<number, number[]> = {
  0: [1, 2],
  1: [3],
  2: [3],
  3: [],
  4: [],
};

describe("BFS", () => {
  it("visits nodes in breadth-first order and ignores unreachable nodes", () => {
    const steps = generateBFSSteps(diamond, 0);
    const last = steps[steps.length - 1];

    expect(last.done).toBe(true);
    expect(last.visited).toEqual([0, 1, 2, 3]);
  });

  it("reaches every node of a generated tree", () => {
    const { adjacencyList } = generateTree(9);
    const last = generateBFSSteps(adjacencyList, 0).at(-1)!;

    expect([...last.visited!].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe("DFS", () => {
  it("visits nodes in depth-first preorder", () => {
    const steps = generateDFSSteps(diamond, 0);
    const last = steps[steps.length - 1];

    expect(last.done).toBe(true);
    expect(last.visited).toEqual([0, 1, 3, 2]);
  });
});

describe("Dijkstra", () => {
  it("computes shortest distances on the sample weighted graph", () => {
    const graph = generateWeightedGraph();
    const last = generateDijkstraSteps(graph.adjacencyList, graph.start).at(-1)!;

    expect(last.done).toBe(true);
    expect(last.distances).toEqual({ 0: 0, 1: 5, 2: 7, 3: 11, 4: 14 });
  });

  it("keeps every settled node visited in the final step", () => {
    const graph = generateWeightedGraph();
    const last = generateDijkstraSteps(graph.adjacencyList, graph.start).at(-1)!;

    expect([...last.visited!].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });

  it("leaves unreachable nodes at Infinity", () => {
    const last = generateDijkstraSteps(
      { 0: [{ to: 1, weight: 2 }], 1: [], 2: [] },
      0
    ).at(-1)!;

    expect(last.distances).toEqual({ 0: 0, 1: 2, 2: Infinity });
  });
});

describe("Bellman-Ford", () => {
  it("matches Dijkstra on non-negative weights", () => {
    const graph = generateWeightedGraph();
    const last = generateBellmanFordSteps(
      graph.edges,
      graph.nodes.map((node) => node.id),
      graph.start
    ).at(-1)!;

    expect(last.distances).toEqual({ 0: 0, 1: 5, 2: 7, 3: 11, 4: 14 });
    expect(last.visited).toBeUndefined();
  });

  it("handles negative edges without a cycle", () => {
    const last = generateBellmanFordSteps(
      [
        { from: 0, to: 1, weight: 4 },
        { from: 0, to: 2, weight: 5 },
        { from: 2, to: 1, weight: -3 },
      ],
      [0, 1, 2],
      0
    ).at(-1)!;

    expect(last.distances).toEqual({ 0: 0, 1: 2, 2: 5 });
  });

  it("detects a negative cycle", () => {
    const last = generateBellmanFordSteps(
      [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: -1 },
        { from: 2, to: 1, weight: -1 },
      ],
      [0, 1, 2],
      0
    ).at(-1)!;

    expect(last.done).toBe(true);
    expect(last.visited?.length).toBeGreaterThan(0);
  });
});

describe("topological sort", () => {
  it("produces a valid ordering for generated DAGs", () => {
    for (let run = 0; run < 25; run++) {
      const { adjacencyList, edges } = generateRandomDAG(7);
      const order = generateTopoSteps(adjacencyList).at(-1)!.visited!;
      const position = new Map(order.map((node, index) => [node, index]));

      expect(order).toHaveLength(7);
      for (const edge of edges) {
        expect(position.get(edge.from)!).toBeLessThan(position.get(edge.to)!);
      }
    }
  });
});
