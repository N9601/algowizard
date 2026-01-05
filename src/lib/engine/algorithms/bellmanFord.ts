import { GraphStep } from "../types";

type Edge = { from: number; to: number; weight: number };

export function generateBellmanFordSteps(
  edges: Edge[],
  nodes: number[],
  start: number
): GraphStep[] {
  const steps: GraphStep[] = [];
  const dist: Record<number, number> = {};

  for (const n of nodes) dist[n] = Infinity;
  dist[start] = 0;

  // Relax edges |V|-1 times
  for (let i = 0; i < nodes.length - 1; i++) {
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

  // Detect negative cycle
  const cycleNodes = new Set<number>();
  for (const e of edges) {
    if (dist[e.from] + e.weight < dist[e.to]) {
      cycleNodes.add(e.from);
      cycleNodes.add(e.to);
    }
  }

  if (cycleNodes.size > 0) {
    steps.push({
      negativeCycleNodes: [...cycleNodes],
      distances: { ...dist },
      done: true,
    });
  } else {
    steps.push({
      distances: { ...dist },
      done: true,
    });
  }

  return steps;
}
