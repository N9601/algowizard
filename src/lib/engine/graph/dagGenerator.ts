export function generateRandomDAG(nodeCount = 5) {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: i,
    x: 100 + i * 80,
    y: 80 + (i % 2) * 80,
  }));

  const adjacencyList: Record<number, number[]> = {};
  const edges: { from: number; to: number }[] = [];


  nodes.forEach((n) => (adjacencyList[n.id] = []));

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (Math.random() < 0.4) {
        adjacencyList[i].push(j);
        edges.push({ from: i, to: j });
      }
    }
  }

  return { nodes, edges, adjacencyList };
}