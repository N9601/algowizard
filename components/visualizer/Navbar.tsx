"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import AuthNav from "components/auth/AuthNav";

export default function Navbar() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

  const isActive = (path: string) => {
    if (path === "/visualizer") {
      return pathname === "/visualizer";
    }

    return pathname.startsWith(path);
  };

  const navItem = (label: string, href: string) => (
    <Link
      key={href}
      href={href}
      className={`rounded-full px-3 py-2 text-sm transition ${
        isActive(href)
          ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "text-white/56 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      <span>{label}</span>
    </Link>
  );

  const mainLinks = [
    { label: "Home", href: "/visualizer" },
    { label: "Compare", href: "/visualizer/compare" },
    { label: "Sorting", href: "/visualizer/sorting" },
    { label: "Searching", href: "/visualizer/searching" },
    { label: "Pathfinding", href: "/visualizer/pathfinding" },
    { label: "ML", href: "/visualizer/ml" },
  ];

  const moreLinks = [
    { label: "Decision", href: "/visualizer/decision" },
    { label: "Graph", href: "/visualizer/graph" },
    { label: "Structures", href: "/visualizer/datastructures" },
  ];

  const algorithmLinks = [
    { label: "Bubble Sort", href: "/visualizer/sorting/bubble-sort" },
    { label: "Selection Sort", href: "/visualizer/sorting/selection-sort" },
    { label: "Insertion Sort", href: "/visualizer/sorting/insertion-sort" },
    { label: "Merge Sort", href: "/visualizer/sorting/merge-sort" },
    { label: "Quick Sort", href: "/visualizer/sorting/quick-sort" },
    { label: "Heap Sort", href: "/visualizer/sorting/heap-sort" },
    { label: "Linear Search", href: "/visualizer/searching/linear-search" },
    { label: "Binary Search", href: "/visualizer/searching/binary-search" },
    { label: "A* Pathfinding", href: "/visualizer/pathfinding/a-star" },
    { label: "BFS Pathfinding", href: "/visualizer/pathfinding/bfs" },
    { label: "Dijkstra (Grid)", href: "/visualizer/pathfinding/dijkstra" },
    { label: "DFS", href: "/visualizer/graph/dfs" },
    { label: "BFS", href: "/visualizer/graph/bfs" },
    { label: "Topological Sort", href: "/visualizer/graph/topological" },
    { label: "Bellman-Ford", href: "/visualizer/graph/bellman-ford" },
    { label: "Stack", href: "/visualizer/datastructures/stack" },
    { label: "Queue", href: "/visualizer/datastructures/queue" },
    { label: "Linked List", href: "/visualizer/datastructures/linked-list" },
    { label: "Binary Tree", href: "/visualizer/datastructures/tree" },
    { label: "Heap (Structure)", href: "/visualizer/datastructures/heap" },
    { label: "Recursion", href: "/visualizer/datastructures/recursion" },
    { label: "k-Means", href: "/visualizer/ml/k-means" },
    { label: "Gradient Descent", href: "/visualizer/ml/gradient-descent" },
    { label: "Neural Network", href: "/visualizer/ml/neural-network" },
    { label: "Minimax", href: "/visualizer/decision/minimax" },
    { label: "Alpha–Beta", href: "/visualizer/decision/alpha-beta" },
  ];

  return (
    <nav className="sticky top-0 z-30 border-b border-white/10 bg-[#07101a]/78 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="mx-auto flex max-w-[88rem] flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(191 219 254)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 13l4-4 4 4" />
            </svg>
          </span>

          <span className="leading-tight">
            <span className="block text-[11px] font-medium uppercase tracking-[0.26em] text-white/40">
              AlgoWizard
            </span>
            <span className="block text-[1.05rem] font-semibold text-white">
              Visualizer
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
            {mainLinks.map((link) => navItem(link.label, link.href))}
            <div className="relative group">
              <button
                type="button"
                className={`rounded-full px-3 py-2 text-sm transition ${
                  moreLinks.some((link) => isActive(link.href))
                    ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    : "text-white/56 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                More
              </button>
              <div className="pointer-events-none absolute right-0 top-full z-40 mt-2 w-44 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                <div className="overflow-hidden rounded-[1rem] border border-white/10 bg-[#071019]/95 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block rounded-[0.8rem] px-3 py-2 text-sm transition hover:bg-white/[0.06] ${
                        isActive(link.href) ? "text-white" : "text-white/75"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="relative"
              onMouseEnter={() => setShowSearch(true)}
              onMouseLeave={() => setShowSearch(false)}
            >
              <button
                type="button"
                aria-label="All algorithms"
                className={`rounded-full p-2 text-sm transition ${
                  showSearch
                    ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    : "text-white/56 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
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
              </button>
              <div
                className={`absolute right-0 top-full z-40 mt-2 w-72 rounded-2xl border border-white/10 bg-[#071019]/95 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition ${
                  showSearch ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  All Algorithms
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  {algorithmLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-2 text-white/80 transition hover:bg-white/[0.07] hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <AuthNav />
        </div>
      </div>
    </nav>
  );
}
