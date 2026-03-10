import { LinkedListStep, LinkedListOperation } from "../types";

export function generateLinkedListSteps(
  initial: string[],
  operations: LinkedListOperation[]
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const list = [...initial];

  for (const op of operations) {

    if (op.type === "insert") {
      list.push(op.value);

      steps.push({
        list: [...list],
        operation: "insert",
        value: op.value,
        message: `Inserted ${op.value}`,
      });
    }

    if (op.type === "delete") {
      if (list.length === 0) {
        steps.push({
          list: [...list],
          operation: "delete",
          message: "List is empty",
        });
        continue;
      }

      const removed = list.pop();

      steps.push({
        list: [...list],
        operation: "delete",
        value: removed,
        message: `Deleted ${removed}`,
      });
    }

    if (op.type === "reset") {
      list.length = 0;

      steps.push({
        list: [],
        operation: "reset",
        message: "List Reset",
      });
    }
  }

  return steps;
}