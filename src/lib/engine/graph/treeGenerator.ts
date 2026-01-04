
type Node = {
  id: number;
  x: number;
  y: number;
};

type Edge = {
  from: number;
  to: number;
};

export function generateTree(nodeCount = 7) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const adjacencyList: Record<number, number[]> = {};

  const width = 500;
  const levelGap = 80;

  // init adjacency list
  for (let i = 0; i < nodeCount; i++) {
    adjacencyList[i] = [];
  }

  /**
   * RANDOM TREE GENERATION
   * each node (except root) attaches to a random previous node
   */
  for (let i = 1; i < nodeCount; i++) {
    const parent = Math.floor(Math.random() * i);
    adjacencyList[parent].push(i);
    edges.push({ from: parent, to: i });
  }

  /**
   * LAYOUT: level by BFS depth
   */
  const levels: number[][] = [];
  const queue: { id: number; depth: number }[] = [{ id: 0, depth: 0 }];
  const visited = new Set<number>();

  while (queue.length) {
    const { id, depth } = queue.shift()!;
    visited.add(id);

    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(id);

    for (const child of adjacencyList[id]) {
      if (!visited.has(child)) {
        queue.push({ id: child, depth: depth + 1 });
      }
    }
  }

  levels.forEach((level, depth) => {
    const gap = width / (level.length + 1);
    level.forEach((id, index) => {
      nodes.push({
        id,
        x: gap * (index + 1),
        y: 50 + depth * levelGap,
      });
    });
  });

  return { nodes, edges, adjacencyList };
}