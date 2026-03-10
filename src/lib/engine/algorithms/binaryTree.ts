import { BinaryTreeStep, BinaryTreeOperation } from "../types";

export function generateBinaryTreeSteps(
  operations: BinaryTreeOperation[]
): BinaryTreeStep[] {

  const steps: BinaryTreeStep[] = [];
  const nodes: number[] = [];

  for (const op of operations) {

    if (op.type === "insert") {

      nodes.push(op.value);

      steps.push({
        nodes: nodes.map(v => ({
          value: v
        })),
        active: op.value,
        message: `Inserted ${op.value}`
      });
    }

    if (op.type === "reset") {

      nodes.length = 0;

      steps.push({
        nodes: [],
        message: "Tree reset"
      });

    }

  }

  return steps;
}