import { BinaryTreeInsertStep } from "../algorithms/binaryTreeInsert";

export function generateBinaryTreeInsertSteps(values: number[]) {

  const steps: BinaryTreeInsertStep[] = [];

  const inserted: number[] = [];

  for (let i = 0; i < values.length; i++) {

    inserted.push(values[i]);

    const nodes = inserted.map((id, idx) => {

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

    const edges: { from: number; to: number }[] = [];

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
