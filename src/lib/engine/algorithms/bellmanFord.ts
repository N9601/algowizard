import { GraphStep } from "../types";

type Edge = {
  from: number;
  to: number;
  weight: number;
};

export function generateBellmanFordSteps(
  nodes: number[],
  edges: Edge[],
  source: number
): GraphStep[] {
  const steps: GraphStep[] = [];

  const distances: Record<number, number> = {};
  nodes.forEach((n) => (distances[n] = Infinity));
  distances[source] = 0;

  // Initial state
  steps.push({
    activeNode: source,
    distances: { ...distances },
  });

  // Relax edges |V| - 1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    for (const { from, to, weight } of edges) {
      if (
        distances[from] !== Infinity &&
        distances[from] + weight < distances[to]
      ) {
        distances[to] = distances[from] + weight;

        steps.push({
          activeNode: to,
          distances: { ...distances },
        });
      }
    }
  }

  // Final step
  steps.push({
    distances: { ...distances },
    done: true,
  });

  return steps;
}