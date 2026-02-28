import { StackStep, StackOperation } from "../types";

export function generateStackSteps(
  initial: string[],
  operations: StackOperation[],
  maxSize: number
): StackStep[] {
  const steps: StackStep[] = [];

  const stack = [...initial]; // fixed prefer-const

  for (const op of operations) {
    if (op.type === "push") {
      if (stack.length >= maxSize) {
        steps.push({
          stack: [...stack],
          operation: "push",
          value: op.value,
          message: "Stack Overflow",
        });
        continue;
      }

      stack.push(op.value);

      steps.push({
        stack: [...stack],
        operation: "push",
        value: op.value,
        message: `Pushed ${op.value}`,
      });
    }

    if (op.type === "pop") {
      if (stack.length === 0) {
        steps.push({
          stack: [...stack],
          operation: "pop",
          message: "Stack Underflow",
        });
        continue;
      }

      const removed = stack.pop();

      steps.push({
        stack: [...stack],
        operation: "pop",
        value: removed,
        message: `Popped ${removed}`,
      });
    }
  }

  return steps;
}