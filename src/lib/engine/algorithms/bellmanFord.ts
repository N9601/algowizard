import { GraphStep } from "../types";

type Edge = { from: number; to: number; weight: number };

export function generateBellmanFordSteps(
  edges: Edge[],
  nodes: number[],
  start: number
): GraphStep[] {
  const steps: GraphStep[] = [];
  const dist: Record<number, number> = {};

  nodes.forEach(n => (dist[n] = Infinity));
  dist[start] = 0;

  // Relax edges |V|-1 times
  for (let i = 1; i < nodes.length; i++) {
    for (const e of edges) {
      if (dist[e.from] + e.weight < dist[e.to]) {
        dist[e.to] = dist[e.from] + e.weight;

        steps.push({
          activeNode: e.to,
          distances: { ...dist },
        });
      }
    }
  }

  // 🚨 NEGATIVE CYCLE DETECTION
  for (const e of edges) {
    if (dist[e.from] + e.weight < dist[e.to]) {
      steps.push({
        activeNode: e.to,
        distances: { ...dist },
        visited: [e.from, e.to], // flash cycle nodes
        done: true,
      });
      return steps;
    }
  }

  steps.push({ distances: { ...dist }, done: true });
  return steps;
}
