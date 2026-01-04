import { GraphStep } from "../types";

type WeightedAdjList = Record<number, { to: number; weight: number }[]>;

export function generateDijkstraSteps(
  graph: WeightedAdjList,
  start: number
): GraphStep[] {
  const steps: GraphStep[] = [];

  const distances: Record<number, number> = {};
  const visited = new Set<number>();
  const nodes = Object.keys(graph).map(Number);

  nodes.forEach((n) => (distances[n] = Infinity));
  distances[start] = 0;

  while (visited.size < nodes.length) {
    let current: number | null = null;
    let min = Infinity;

    for (const n of nodes) {
      if (!visited.has(n) && distances[n] < min) {
        min = distances[n];
        current = n;
      }
    }

    if (current === null) break;

    visited.add(current);

    steps.push({
      activeNode: current,
      visited: Array.from(visited),
      distances: { ...distances },
    });

    for (const edge of graph[current]) {
      const alt = distances[current] + edge.weight;
      if (alt < distances[edge.to]) {
        distances[edge.to] = alt;

        steps.push({
          activeNode: edge.to,
          visited: Array.from(visited),
          distances: { ...distances },
        });
      }
    }
  }

  steps.push({
    visited: Array.from(visited),
    distances: { ...distances },
    done: true,
  });

  return steps;
}