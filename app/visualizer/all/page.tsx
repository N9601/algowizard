"use client";

import { useMemo, useState } from "react";

import AlgoCard from "components/visualizer/AlgoCard";
import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import Navbar from "components/visualizer/Navbar";

type Difficulty = "Easy" | "Medium" | "Hard";

type AlgoEntry = {
  title: string;
  href: string;
  tag: string;
  difficulty: Difficulty;
  description: string;
};

const ALGORITHMS: AlgoEntry[] = [
  { title: "Bubble Sort", href: "/visualizer/sorting/bubble-sort", tag: "Sorting", difficulty: "Easy", description: "Adjacent swaps to bubble larger values rightward." },
  { title: "Selection Sort", href: "/visualizer/sorting/selection-sort", tag: "Sorting", difficulty: "Easy", description: "Select the minimum and place it at the front." },
  { title: "Insertion Sort", href: "/visualizer/sorting/insertion-sort", tag: "Sorting", difficulty: "Easy", description: "Insert each value into a growing sorted prefix." },
  { title: "Merge Sort", href: "/visualizer/sorting/merge-sort", tag: "Sorting", difficulty: "Medium", description: "Divide, sort halves, and merge back together." },
  { title: "Quick Sort", href: "/visualizer/sorting/quick-sort", tag: "Sorting", difficulty: "Medium", description: "Partition around a pivot and recurse on partitions." },
  { title: "Heap Sort", href: "/visualizer/sorting/heap-sort", tag: "Sorting", difficulty: "Hard", description: "Build a max heap and pop the root to sort." },

  { title: "Linear Search", href: "/visualizer/searching/linear-search", tag: "Searching", difficulty: "Easy", description: "Scan each element until the target is found." },
  { title: "Binary Search", href: "/visualizer/searching/binary-search", tag: "Searching", difficulty: "Easy", description: "Halve the search range on each comparison." },

  { title: "A* Pathfinding", href: "/visualizer/pathfinding/a-star", tag: "Pathfinding", difficulty: "Medium", description: "Heuristic-guided shortest path on a grid." },
  { title: "BFS Pathfinding", href: "/visualizer/pathfinding/bfs", tag: "Pathfinding", difficulty: "Easy", description: "Level-order expansion to find unweighted shortest paths." },
  { title: "Dijkstra (Grid)", href: "/visualizer/pathfinding/dijkstra", tag: "Pathfinding", difficulty: "Medium", description: "Priority-queue expansion for weighted shortest paths." },

  { title: "Depth-First Search", href: "/visualizer/graph/dfs", tag: "Graph", difficulty: "Medium", description: "Explore a branch fully before backtracking." },
  { title: "Breadth-First Search", href: "/visualizer/graph/bfs", tag: "Graph", difficulty: "Medium", description: "Visit nodes level by level with a queue." },
  { title: "Topological Sort", href: "/visualizer/graph/topological", tag: "Graph", difficulty: "Hard", description: "Order DAG nodes so prerequisites appear first." },
  { title: "Bellman-Ford", href: "/visualizer/graph/bellman-ford", tag: "Graph", difficulty: "Hard", description: "Relax all edges repeatedly; handles negatives." },

  { title: "Stack", href: "/visualizer/datastructures/stack", tag: "Data Structure", difficulty: "Easy", description: "LIFO push and pop with step narration." },
  { title: "Queue", href: "/visualizer/datastructures/queue", tag: "Data Structure", difficulty: "Easy", description: "FIFO enqueue/dequeue simulation." },
  { title: "Linked List", href: "/visualizer/datastructures/linked-list", tag: "Data Structure", difficulty: "Medium", description: "Pointer-based inserts and deletes." },
  { title: "Binary Tree", href: "/visualizer/datastructures/tree", tag: "Data Structure", difficulty: "Medium", description: "Insert nodes and watch structure grow." },
  { title: "Heap (Structure)", href: "/visualizer/datastructures/heap", tag: "Data Structure", difficulty: "Medium", description: "Insert while maintaining heap property." },
  { title: "Recursion", href: "/visualizer/datastructures/recursion", tag: "Data Structure", difficulty: "Easy", description: "Trace call-stack growth and unwind." },

  { title: "k-Means", href: "/visualizer/ml/k-means", tag: "ML", difficulty: "Easy", description: "Assign points to centroids and recenter." },
  { title: "Gradient Descent", href: "/visualizer/ml/gradient-descent", tag: "ML", difficulty: "Easy", description: "Step downhill on a 2D loss surface." },
  { title: "Neural Network", href: "/visualizer/ml/neural-network", tag: "ML", difficulty: "Medium", description: "Two-layer classifier with live activations." },

  { title: "Minimax", href: "/visualizer/decision/minimax", tag: "Decision AI", difficulty: "Easy", description: "Game tree search for optimal play." },
  { title: "Alpha–Beta", href: "/visualizer/decision/alpha-beta", tag: "Decision AI", difficulty: "Medium", description: "Prune branches that cannot change the outcome." },
].sort((a, b) => a.title.localeCompare(b.title));

export default function AllAlgorithmsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return ALGORITHMS;
    return ALGORITHMS.filter((a) =>
      `${a.title} ${a.tag} ${a.description}`.toLowerCase().includes(term)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <Navbar />
      <AlgorithmBackground variant="landing" />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Glossary
          </p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Everything in one place.
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-white/68">
            A flat list of every visualizer—no categories, just jump straight to what you need.
          </p>
          <div className="mt-4 max-w-xl">
            <label className="relative block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.65" y1="16.65" x2="21" y2="21" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any algorithm"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/20"
              />
            </label>
            <p className="mt-2 text-xs text-white/50">
              Showing {filtered.length} of {ALGORITHMS.length}
            </p>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <AlgoCard
              key={item.href}
              title={item.title}
              description={item.description}
              difficulty={item.difficulty}
              tag={item.tag}
              href={item.href}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
