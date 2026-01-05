export type WeightedGraph = {
  nodes: { id: number; x: number; y: number }[];
  edges: { from: number; to: number; weight: number }[];
  adjacencyList: Record<number, { to: number; weight: number }[]>;
  start: number;
};

export function generateWeightedGraph(
  nodeCount = 6
): WeightedGraph {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: i,
    x: 80 + i * 70,
    y: 120 + (i % 2) * 80,
  }));

  const adjacencyList: WeightedGraph["adjacencyList"] = {};
  const edges: WeightedGraph["edges"] = [];

  nodes.forEach((n) => (adjacencyList[n.id] = []));

  for (let i = 0; i < nodeCount - 1; i++) {
    const weight = Math.floor(Math.random() * 9) + 1;

    adjacencyList[i].push({ to: i + 1, weight });
    edges.push({ from: i, to: i + 1, weight });

    if (Math.random() > 0.5 && i + 2 < nodeCount) {
      const w2 = Math.floor(Math.random() * 9) + 1;
      adjacencyList[i].push({ to: i + 2, weight: w2 });
      edges.push({ from: i, to: i + 2, weight: w2 });
    }
  }

  return {
    nodes,
    edges,
    adjacencyList,
    start: 0,
  };
}