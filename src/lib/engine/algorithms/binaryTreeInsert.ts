export interface TreeNode {
  id: number;
  x: number;
  y: number;
}

export interface TreeEdge {
  from: number;
  to: number;
}

export interface BinaryTreeInsertStep {
  nodes: TreeNode[];
  edges: TreeEdge[];
  activeNode?: number;
}

export function generateBinaryTreeInsertSteps(values: number[]): BinaryTreeInsertStep[] {

  const steps: BinaryTreeInsertStep[] = [];
  const inserted: number[] = [];

  for (let i = 0; i < values.length; i++) {

    inserted.push(values[i]);

    const nodes: TreeNode[] = inserted.map((id, idx) => {

      const level = Math.floor(Math.log2(idx + 1));
      const pos = idx - (2 ** level - 1);
      const nodesInLevel = 2 ** level;

      const width = 600;

      return {
        id,
        x: (width / (nodesInLevel + 1)) * (pos + 1),
        y: level * 100 + 60
      };
    });

    const edges: TreeEdge[] = [];

    for (let j = 1; j < inserted.length; j++) {

      const parent = Math.floor((j - 1) / 2);

      edges.push({
        from: inserted[parent],
        to: inserted[j]
      });
    }

    steps.push({
      nodes,
      edges,
      activeNode: values[i]
    });
  }

  return steps;
}