export interface HeapNode {
  id: number;
  x: number;
  y: number;
}

export interface HeapEdge {
  from: number;
  to: number;
}

export interface HeapStep {
  nodes: HeapNode[];
  edges: HeapEdge[];
  activeNode?: number;
}

export function generateHeapInsertSteps(values: number[]): HeapStep[] {

  const steps: HeapStep[] = [];
  const heap: number[] = [];

  for (let i = 0; i < values.length; i++) {

    heap.push(values[i]);

    let idx = heap.length - 1;

    while (idx > 0) {

      const parent = Math.floor((idx - 1) / 2);

      if (heap[parent] <= heap[idx]) break;

      [heap[parent], heap[idx]] = [heap[idx], heap[parent]];

      idx = parent;
    }

    const nodes: HeapNode[] = heap.map((id, index) => {

      const level = Math.floor(Math.log2(index + 1));
      const pos = index - (2 ** level - 1);
      const nodesInLevel = 2 ** level;

      const width = 600;

      return {
        id,
        x: (width / (nodesInLevel + 1)) * (pos + 1),
        y: level * 100 + 60,
      };
    });

    const edges: HeapEdge[] = [];

    for (let j = 1; j < heap.length; j++) {

      const parent = Math.floor((j - 1) / 2);

      edges.push({
        from: heap[parent],
        to: heap[j],
      });
    }

    steps.push({
      nodes,
      edges,
      activeNode: heap[idx],
    });
  }

  return steps;
}