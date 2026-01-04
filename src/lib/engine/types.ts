/* ================================
   Algorithm status
================================ */

export type AlgorithmStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

/* ================================
   Algorithm type (USED BY PSEUDOCODE)
================================ */

export type AlgorithmType =
  // Sorting
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "heap"
  // Searching
  | "linear"
  | "binary";

/* ================================
   SORTING STEP
================================ */

export interface SortingStep {
  array: number[];

  comparing?: [number, number];
  swapping?: [number, number];
  sortedIndices?: number[];
  activeRange?: [number, number];
}

/* ================================
   SEARCH STEP
================================ */

export interface SearchStep {
  array: number[];

  // Linear / Binary
  currentIndex?: number;

  // Binary search window
  low?: number;
  high?: number;

  // Found
  foundIndex?: number;

  // ❌ NOT FOUND (NEW)
  notFound?: boolean;

  // End of algorithm
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

  play(): void;
  pause(): void;
  stepForward(): void;
  reset(): void;
  setSpeed(speed: number): void;
}

/* ================================
   GRAPH STEP
================================ */

export interface GraphStep {
  activeNode?: number;
  visited?: number[];

  // traversal internals (optional, algorithm-specific)
  stack?: number[]; // DFS
  queue?: number[]; // BFS

  done?: boolean;
}