/* ================================
   Algorithm status
================================ */

export type AlgorithmStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

/* ================================
   SORTING STEP
================================ */

export interface SortingStep {
  array: number[];

  comparing?: [number, number];
  swapping?: [number, number];
  sortedIndices?: number[];
  activeRange?: [number, number];

  done?: boolean;
}

/* ================================
   SEARCH STEP
================================ */

export interface SearchStep {
  array: number[];

  currentIndex?: number;

  low?: number;
  high?: number;

  foundIndex?: number;
  notFound?: boolean;

  done?: boolean;
}

/* ================================
   GRAPH STEP
================================ */

export interface GraphStep {
  activeNode?: number;
  visited?: number[];

  // DFS
  stack?: number[];

  // BFS / Topological
  queue?: number[];

  // Topological sort (Kahn)
  inDegree?: Record<number, number>;

  // Shortest paths
  distances?: Record<number, number>;

  // Dijkstra
  priorityQueue?: {
    node: number;
    priority: number;
  }[];

  // Bellman-Ford
  negativeCycleNodes?: number[];

  done?: boolean;
}

/* ================================
   PATHFINDING STEP
================================ */

export interface PathfindingStep {
  current: [number, number] | null;
  frontier: string[];
  visited: string[];
  path: string[];
  walls: string[];
  start: [number, number];
  goal: [number, number];
  found: boolean;
}

/* ================================
   STACK TYPES
================================ */

// Operations used by generator
export type StackOperation =
  | { type: "push"; value: string }
  | { type: "pop" }
  | { type: "reset" };

// Step emitted by engine
export interface StackStep {
  stack: string[];
  operation: "push" | "pop" | "reset";
  value?: string;
  message?: string;
  done?: boolean;
}

/* ================================
   RECURSION TYPES
================================ */

export interface RecursionFrame {
  n: number;
  status: "call" | "returning";
  result?: number;
}

export interface RecursionStep {
  stack: RecursionFrame[];
  message: string;
  done?: boolean;
}

/* ================================
   GENERIC CONTROLLER
================================ */

export interface AlgorithmController<TStep> {
  status: AlgorithmStatus;
  steps: TStep[];
  currentStepIndex: number;
  speed: number;

  play(speed?: number): void;
  pause(): void;
  stepForward(): void;
  stepBackward(): void;
  reset(): void;
  setSpeed(speed: number): void;
}

/* ================================
   QUEUE TYPES
================================ */

export type QueueOperation =
  | { type: "enqueue"; value: string }
  | { type: "dequeue" }
  | { type: "reset" };

export interface QueueStep {
  queue: string[];
  operation: "enqueue" | "dequeue" | "reset";
  value?: string;
  message?: string;
  done?: boolean;
}

/* ================================
   LINKED LIST TYPES
================================ */

export type LinkedListOperation =
  | { type: "insert"; value: string }
  | { type: "delete" }
  | { type: "reset" };

export interface LinkedListStep {
  list: string[];
  operation: "insert" | "delete" | "reset";
  value?: string;
  message?: string;
  done?: boolean;
}
