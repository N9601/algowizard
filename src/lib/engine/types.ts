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
  | "dijkstra"
  | "bellman-ford"
  | "bfs"
  | "dfs"
  | "topological";

/* ================================
   GRAPH STEP (FIXED)
================================ */

export interface GraphStep {
  activeNode?: number;
  visited?: number[];

  // DFS
  stack?: number[];

  // BFS / Topological
  queue?: number[];

  // Topological sort
  inDegree?: Record<number, number>;

  // Shortest paths
  distances?: Record<number, number>;

  // Dijkstra
  priorityQueue?: { node: number; priority: number }[];

  // ✅ Bellman-Ford
  negativeCycleNodes?: number[];

  done?: boolean;
}
