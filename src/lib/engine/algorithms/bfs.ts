import { GraphStep } from "../types";

export function generateBFSSteps(
  adjacencyList: Record<number, number[]>,
  startNode: number
): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const queue: number[] = [startNode];

  visited.add(startNode);

  steps.push({
    activeNode: startNode,
    visited: Array.from(visited),
    queue: [...queue],
  });

  while (queue.length > 0) {
    const node = queue.shift()!;

    steps.push({
      activeNode: node,
      visited: Array.from(visited),
      queue: [...queue],
    });

    for (const neighbor of adjacencyList[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        steps.push({
          activeNode: neighbor,
          visited: Array.from(visited),
          queue: [...queue],
        });
      }
    }
  }

  steps.push({
    visited: Array.from(visited),
    done: true,
  });

  return steps;
}