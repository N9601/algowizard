"use client";

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
  | "dijkstra"
  | "topological"
  | "bellman-ford";

interface PseudocodeProps {
  algorithm: AlgorithmType;
}

/* ================================
   PSEUDOCODE DEFINITIONS
================================ */

const PSEUDOCODE: Record<AlgorithmType, string[]> = {
  /* ===== Sorting ===== */

  bubble: [
    "procedure bubbleSort(A)",
    "  n ← length(A)",
    "  repeat",
    "    swapped ← false",
    "    for i ← 1 to n - 1 do",
    "      if A[i - 1] > A[i] then",
    "        swap A[i - 1] and A[i]",
    "        swapped ← true",
    "      end if",
    "    end for",
    "    n ← n - 1",
    "  until not swapped",
    "end procedure",
  ],

  selection: [
    "procedure selectionSort(A)",
    "  n ← length(A)",
    "  for i ← 0 to n - 1 do",
    "    minIndex ← i",
    "    for j ← i + 1 to n - 1 do",
    "      if A[j] < A[minIndex] then",
    "        minIndex ← j",
    "      end if",
    "    end for",
    "    swap A[i] and A[minIndex]",
    "  end for",
    "end procedure",
  ],

  insertion: [
    "procedure insertionSort(A)",
    "  n ← length(A)",
    "  for i ← 1 to n - 1 do",
    "    key ← A[i]",
    "    j ← i - 1",
    "    while j ≥ 0 and A[j] > key do",
    "      A[j + 1] ← A[j]",
    "      j ← j - 1",
    "    end while",
    "    A[j + 1] ← key",
    "  end for",
    "end procedure",
  ],

  merge: [
    "procedure mergeSort(A)",
    "  if length(A) ≤ 1 return A",
    "  mid ← length(A) / 2",
    "  left ← mergeSort(A[0..mid])",
    "  right ← mergeSort(A[mid..n])",
    "  return merge(left, right)",
    "end procedure",
  ],

  quick: [
    "procedure quickSort(A, low, high)",
    "  if low < high then",
    "    p ← partition(A, low, high)",
    "    quickSort(A, low, p - 1)",
    "    quickSort(A, p + 1, high)",
    "  end if",
    "end procedure",
  ],

  heap: [
    "procedure heapSort(A)",
    "  buildMaxHeap(A)",
    "  for i ← n - 1 to 1 do",
    "    swap A[0] and A[i]",
    "    heapify(A, 0, i)",
    "  end for",
    "end procedure",
  ],

  /* ===== Searching ===== */

  linear: [
    "procedure linearSearch(A, target)",
    "  for i ← 0 to length(A) - 1 do",
    "    if A[i] = target then",
    "      return i",
    "    end if",
    "  end for",
    "  return -1",
    "end procedure",
  ],

  binary: [
    "procedure binarySearch(A, target)",
    "  low ← 0",
    "  high ← length(A) - 1",
    "  while low ≤ high do",
    "    mid ← (low + high) / 2",
    "    if A[mid] = target then",
    "      return mid",
    "    else if A[mid] < target then",
    "      low ← mid + 1",
    "    else",
    "      high ← mid - 1",
    "    end if",
    "  end while",
    "  return -1",
    "end procedure",
  ],

  /* ===== Graph ===== */

  dfs: [
    "procedure DFS(G, start)",
    "  stack ← [start]",
    "  visited ← ∅",
    "  while stack not empty do",
    "    node ← pop(stack)",
    "    if node not in visited then",
    "      mark node visited",
    "      for each neighbor of node do",
    "        push neighbor to stack",
    "      end for",
    "    end if",
    "  end while",
    "end procedure",
  ],

  bfs: [
    "procedure BFS(G, start)",
    "  queue ← [start]",
    "  visited ← {start}",
    "  while queue not empty do",
    "    node ← dequeue(queue)",
    "    for each neighbor of node do",
    "      if neighbor not visited then",
    "        mark neighbor visited",
    "        enqueue(neighbor)",
    "      end if",
    "    end for",
    "  end while",
    "end procedure",
  ],

  dijkstra: [
    "procedure Dijkstra(G, start)",
    "  for each vertex v in G do",
    "    dist[v] ← ∞",
    "  dist[start] ← 0",
    "  priorityQueue ← all vertices",
    "  while priorityQueue not empty do",
    "    u ← vertex with min dist",
    "    for each neighbor v of u do",
    "      if dist[u] + weight(u,v) < dist[v] then",
    "        dist[v] ← dist[u] + weight(u,v)",
    "      end if",
    "    end for",
    "  end while",
    "end procedure",
  ],

  topological: [
    "procedure TopologicalSort(G)",
    "  compute in-degree of each node",
    "  queue ← all nodes with in-degree 0",
    "  while queue not empty do",
    "    node ← dequeue(queue)",
    "    output node",
    "    for each neighbor of node do",
    "      decrease in-degree",
    "      if in-degree becomes 0 then",
    "        enqueue(neighbor)",
    "      end if",
    "    end for",
    "  end while",
    "end procedure",
  ],

  "bellman-ford": [
    "procedure BellmanFord(G, start)",
    "  for each vertex v in G do",
    "    dist[v] ← ∞",
    "  dist[start] ← 0",
    "  repeat |V| - 1 times",
    "    for each edge (u, v) do",
    "      if dist[u] + weight(u,v) < dist[v] then",
    "        dist[v] ← dist[u] + weight(u,v)",
    "      end if",
    "    end for",
    "  end repeat",
    "end procedure",
  ],
};

/* ================================
   COMPONENT
================================ */

export default function Pseudocode({ algorithm }: PseudocodeProps) {
  return (
    <div className="rounded-xl bg-slate-900 p-5 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold text-slate-200">
        Pseudocode
      </h3>

      <pre className="overflow-x-auto rounded-md bg-slate-950 p-4 text-sm text-slate-200">
        {PSEUDOCODE[algorithm].map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    </div>
  );
}


