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
  | "binary"

  // Graph
  | "dfs"
  | "bfs"
  | "topological"
  | "dijkstra"
  | "bellman-ford";

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
  stepBackward(): void;
  reset(): void;
  setSpeed(speed: number): void;
}
