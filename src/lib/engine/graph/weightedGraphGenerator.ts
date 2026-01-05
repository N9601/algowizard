// src/lib/engine/graph/weightedGraphGenerator.ts

export type WeightedGraph = {
  nodes: { id: number; x: number; y: number }[];
  edges: { from: number; to: number; weight: number }[];
  adjacencyList: Record<number, { to: number; weight: number }[]>;
  start: number;
};

export function generateWeightedGraph(): WeightedGraph {
  const nodes = [
    { id: 0, x: 100, y: 120 },
    { id: 1, x: 200, y: 60 },
    { id: 2, x: 200, y: 180 },
    { id: 3, x: 320, y: 60 },
    { id: 4, x: 320, y: 180 },
  ];

  const edges = [
    { from: 0, to: 1, weight: 5 },
    { from: 0, to: 2, weight: 7 },
    { from: 1, to: 3, weight: 6 },
    { from: 2, to: 4, weight: 9 },
    { from: 3, to: 4, weight: 3 },
  ];

  const adjacencyList: Record<number, { to: number; weight: number }[]> = {};

  for (const n of nodes) adjacencyList[n.id] = [];
  for (const e of edges) adjacencyList[e.from].push({ to: e.to, weight: e.weight });

  return {
    nodes,
    edges,
    adjacencyList,
    start: 0,
  };
}
