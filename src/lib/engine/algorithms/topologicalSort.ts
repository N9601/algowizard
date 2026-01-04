import { GraphStep } from "../types";

export function generateTopoSteps(
  adjacencyList: Record<number, number[]>
): GraphStep[] {
  const steps: GraphStep[] = [];

  const inDegree: Record<number, number> = {};
  const nodes = Object.keys(adjacencyList).map(Number);

  // init in-degrees
  for (const node of nodes) inDegree[node] = 0;
  for (const node of nodes) {
    for (const neighbor of adjacencyList[node]) {
      inDegree[neighbor]++;
    }
  }

  const queue: number[] = [];
  const visited: number[] = [];

  for (const node of nodes) {
    if (inDegree[node] === 0) queue.push(node);
  }

  while (queue.length > 0) {
    const node = queue.shift()!;
    visited.push(node);

    steps.push({
      activeNode: node,
      visited: [...visited],
      queue: [...queue],
      inDegree: { ...inDegree },
    });

    for (const neighbor of adjacencyList[node]) {
      inDegree[neighbor]--;

      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  steps.push({
    visited: [...visited],
    done: true,
  });

  return steps;
}