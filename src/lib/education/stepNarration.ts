import type {
  GraphStep,
  LinkedListStep,
  QueueStep,
  SearchStep,
  SortingStep,
  StackStep,
  RecursionStep,
} from "../engine/types";
import type { BinaryTreeInsertStep } from "../engine/algorithms/binaryTreeInsert";
import type { HeapStep } from "../engine/algorithms/heapInsertSteps";

type SortingAlgorithm =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "heap";

type SearchAlgorithm = "linear" | "binary";
type GraphAlgorithm =
  | "bfs"
  | "dfs"
  | "topological"
  | "dijkstra"
  | "bellman-ford";

function formatIndex(index: number) {
  return `index ${index}`;
}

function formatNodeList(nodes?: number[]) {
  if (!nodes?.length) {
    return "none";
  }

  return nodes.join(", ");
}

export function describeSortingStep(
  algorithm: SortingAlgorithm,
  step: SortingStep | null,
  array: number[]
) {
  if (!step) {
    return `Ready to begin ${algorithm} sort on ${array.length} values. Press play to watch the first operation.`;
  }

  if (step.done || step.sortedIndices?.length === step.array.length) {
    return "The array is fully sorted from left to right.";
  }

  if (step.swapping) {
    const [left, right] = step.swapping;
    const valueLeft = step.array[left];
    const valueRight = step.array[right];

    if (algorithm === "quick") {
      return `Quick sort is swapping ${formatIndex(left)} and ${formatIndex(
        right
      )} to place a value on the correct side of the pivot.`;
    }

    if (algorithm === "heap") {
      return `Heap sort is swapping ${formatIndex(left)} and ${formatIndex(
        right
      )} to restore heap order before locking the maximum value.`;
    }

    if (algorithm === "insertion") {
      return `Insertion sort moves ${valueLeft} leftward by swapping it with ${valueRight}.`;
    }

    return `Swapping ${formatIndex(left)} and ${formatIndex(
      right
    )} to improve the ordering of the array.`;
  }

  if (step.comparing) {
    const [left, right] = step.comparing;
    const valueLeft = step.array[left];
    const valueRight = step.array[right];

    switch (algorithm) {
      case "bubble":
        return `Bubble sort compares adjacent values ${valueLeft} and ${valueRight} to see whether they are out of order.`;
      case "selection":
        return `Selection sort compares the current minimum candidate at ${formatIndex(
          left
        )} with ${formatIndex(right)}.`;
      case "insertion":
        return `Insertion sort checks whether ${valueLeft} should stay before ${valueRight}.`;
      case "merge":
        return `Merge sort compares the front values of two sorted halves inside the active range.`;
      case "quick":
        return `Quick sort compares ${valueLeft} against the pivot value ${valueRight}.`;
      case "heap":
        return `Heap sort checks whether child ${formatIndex(left)} should replace the current largest value at ${formatIndex(
          right
        )}.`;
    }
  }

  if (step.activeRange) {
    return `Merge sort is writing values back into the merged range ${step.activeRange[0]} to ${step.activeRange[1]}.`;
  }

  if (step.sortedIndices?.length) {
    return `Confirmed sorted positions: ${step.sortedIndices.join(", ")}.`;
  }

  return "The algorithm is preparing its next comparison.";
}

export function describeSearchStep(
  algorithm: SearchAlgorithm,
  step: SearchStep | null,
  array: number[],
  target: number
) {
  if (!step) {
    return `Ready to search for ${target} in ${array.length} values.`;
  }

  if (step.foundIndex !== undefined) {
    return `Found the target ${target} at ${formatIndex(step.foundIndex)}.`;
  }

  if (step.notFound) {
    return algorithm === "binary"
      ? `Binary search exhausted the active range, so ${target} is not in the array.`
      : `Linear search checked every element and did not find ${target}.`;
  }

  if (step.currentIndex !== undefined && algorithm === "linear") {
    return `Linear search is checking ${formatIndex(step.currentIndex)} with value ${step.array[step.currentIndex]}.`;
  }

  if (step.currentIndex !== undefined && algorithm === "binary") {
    return `Binary search is inspecting midpoint ${formatIndex(
      step.currentIndex
    )} while the active window is ${step.low} to ${step.high}.`;
  }

  return "The search is preparing its next decision.";
}

export function describeGraphStep(
  algorithm: GraphAlgorithm,
  step: GraphStep | null
) {
  if (!step) {
    return `Ready to begin ${algorithm.replace("-", " ")}.`;
  }

  if (step.done) {
    if (algorithm === "bellman-ford" && step.activeNode !== undefined && step.visited?.length) {
      return `Bellman-Ford detected a negative cycle affecting nodes ${formatNodeList(
        step.visited
      )}.`;
    }

    return `The ${algorithm.replace("-", " ")} run is complete.`;
  }

  switch (algorithm) {
    case "bfs":
      return `BFS is visiting node ${step.activeNode} and the queue now holds ${formatNodeList(
        step.queue
      )}.`;
    case "dfs":
      return `DFS is exploring node ${step.activeNode}. Remaining stack: ${formatNodeList(
        step.stack
      )}.`;
    case "topological":
      return `Topological sort removes node ${step.activeNode} from the zero in-degree queue and appends it to the order.`;
    case "dijkstra":
      return `Dijkstra is finalizing the shortest known path to node ${step.activeNode}; current distance is ${
        step.activeNode !== undefined ? step.distances?.[step.activeNode] : "unknown"
      }.`;
    case "bellman-ford":
      return `Bellman-Ford just relaxed a path to node ${step.activeNode}; current distance is ${
        step.activeNode !== undefined ? step.distances?.[step.activeNode] : "unknown"
      }.`;
  }
}

export function describeStackStep(step: StackStep | null) {
  if (!step) {
    return "Ready to simulate stack operations. Press play to begin the LIFO sequence.";
  }

  return step.message
    ? `${step.message}. Current stack: ${step.stack.join(", ") || "empty"}.`
    : "The stack is waiting for the next operation.";
}

export function describeQueueStep(step: QueueStep | null) {
  if (!step) {
    return "Ready to simulate queue operations. Press play to begin the FIFO sequence.";
  }

  return step.message
    ? `${step.message}. Current queue: ${step.queue.join(", ") || "empty"}.`
    : "The queue is waiting for the next operation.";
}

export function describeLinkedListStep(step: LinkedListStep | null) {
  if (!step) {
    return "Ready to simulate linked-list insertions and deletions.";
  }

  return step.message
    ? `${step.message}. Current list: ${step.list.join(" -> ") || "empty"}.`
    : "The linked list is waiting for the next operation.";
}

export function describeTreeStep(step: BinaryTreeInsertStep | null) {
  if (!step) {
    return "Ready to build the binary tree level by level.";
  }

  return `Inserted node ${step.activeNode}. The tree now contains ${step.nodes.length} node${
    step.nodes.length === 1 ? "" : "s"
  }.`;
}

export function describeHeapInsertStep(step: HeapStep | null) {
  if (!step) {
    return "Ready to insert values into the heap.";
  }

  return `Inserted ${step.activeNode} and restored the heap property. Heap size is now ${step.nodes.length}.`;
}

export function describeRecursionStep(step: RecursionStep | null) {
  if (!step) {
    return "Ready to trace recursion. Press play to watch the call stack grow and unwind.";
  }

  if (step.done) {
    return "The recursion finished and fully unwound to the caller.";
  }

  const top = step.stack[step.stack.length - 1];
  const stackView =
    step.stack
      .map((frame) =>
        frame.status === "returning" && frame.result !== undefined
          ? `f(${frame.n})=${frame.result}`
          : `f(${frame.n})`
      )
      .join(" → ") || "empty";

  const active =
    top && top.status === "returning" && top.result !== undefined
      ? `Active frame: f(${top.n}) = ${top.result}.`
      : top
        ? `Active frame: f(${top.n}).`
        : "";

  return `${step.message}. ${active} Stack: ${stackView}.`;
}
