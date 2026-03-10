import { QueueStep, QueueOperation } from "../types";

export function generateQueueSteps(
  initial: string[],
  operations: QueueOperation[],
  maxSize: number
): QueueStep[] {
  const steps: QueueStep[] = [];
  const queue = [...initial];

  for (const op of operations) {
    if (op.type === "enqueue") {
      if (queue.length >= maxSize) {
        steps.push({
          queue: [...queue],
          operation: "enqueue",
          value: op.value,
          message: "Queue Overflow",
        });
        continue;
      }

      queue.push(op.value);

      steps.push({
        queue: [...queue],
        operation: "enqueue",
        value: op.value,
        message: `Enqueued ${op.value}`,
      });
    }

    if (op.type === "dequeue") {
      if (queue.length === 0) {
        steps.push({
          queue: [...queue],
          operation: "dequeue",
          message: "Queue Underflow",
        });
        continue;
      }

      const removed = queue.shift();

      steps.push({
        queue: [...queue],
        operation: "dequeue",
        value: removed,
        message: `Dequeued ${removed}`,
      });
    }

    if (op.type === "reset") {
      queue.length = 0;

      steps.push({
        queue: [],
        operation: "reset",
        message: "Queue Reset",
      });
    }
  }

  return steps;
}