import { GraphStep } from "../types";

type AdjList = Record<number, { to: number; weight: number }[]>;

export function generateDijkstraSteps(
  graph: AdjList,
  start: number
): GraphStep[] {
  const steps: GraphStep[] = [];

  const distances: Record<number, number> = {};
  const visited = new Set<number>();

  // ✅ const fixes ESLint prefer-const
  const pq: { node: number; priority: number }[] = [];

  for (const node in graph) {
    distances[+node] = Infinity;
  }

  distances[start] = 0;
  pq.push({ node: start, priority: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.priority - b.priority);
    const current = pq.shift();
    if (!current) break;

    const node = current.node;

    if (visited.has(node)) continue;
    visited.add(node);

    steps.push({
      activeNode: node,
      visited: [...visited],
      distances: { ...distances },
      priorityQueue: [...pq],
    });

    for (const edge of graph[node]) {
      const alt = distances[node] + edge.weight;

      if (alt < distances[edge.to]) {
        distances[edge.to] = alt;
        pq.push({ node: edge.to, priority: alt });

        steps.push({
          activeNode: edge.to,
          visited: [...visited],
          distances: { ...distances },
          priorityQueue: [...pq],
        });
      }
    }
  }

  steps.push({
    distances: { ...distances },
    done: true,
  });

  return steps;
}
