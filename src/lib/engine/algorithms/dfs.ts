import { GraphStep } from "../types";

export function generateDFSSteps(
  adjacencyList: Record<number, number[]>,
  startNode: number
): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const stack: number[] = [startNode];

  while (stack.length > 0) {
    const node = stack.pop()!;

    steps.push({
      activeNode: node,
      visited: Array.from(visited),
      stack: [...stack],
    });

    if (!visited.has(node)) {
      visited.add(node);

      steps.push({
        activeNode: node,
        visited: Array.from(visited),
        stack: [...stack],
      });

      const neighbors = adjacencyList[node] || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const next = neighbors[i];
        if (!visited.has(next)) {
          stack.push(next);
        }
      }
    }
  }

  steps.push({
    visited: Array.from(visited),
    done: true,
  });

  return steps;
}
