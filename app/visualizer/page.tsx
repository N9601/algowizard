import Navbar from "components/visualizer/Navbar";
import AlgoCard from "components/visualizer/AlgoCard";
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0e1628] text-white">
      <Navbar />

      {/* ================= HERO ================= */}
<section className="py-24 bg-blue-500">
  <div className="max-w-7xl mx-auto px-6">
    <h1 className="text-5xl font-bold mb-4 text-white">
      Algorithm Visualizer
    </h1>
    <p className="text-white/90 max-w-2xl text-lg">
      Interactive visualizations designed to make algorithms easy to understand,
      step by step.
    </p>
  </div>
</section>

      {/* ================= CONTENT ================= */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-24 space-y-28">

          {/* -------- Sorting -------- */}
          <div>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Sorting Algorithms</h2>
              <Link
  href="/visualizer/sorting"
  className="btn-primary text-sm"
>
  View All
</Link>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AlgoCard
                title="Bubble Sort"
                description="A simple sorting algorithm that repeatedly swaps adjacent elements."
                difficulty="Easy"
                tag="Sorting"
                href="/visualizer/sorting/bubble-sort"
              />
              <AlgoCard
                title="Selection Sort"
                description="Repeatedly selects the minimum element and places it in order."
                difficulty="Easy"
                tag="Sorting"
                href="/visualizer/sorting/selection-sort"
              />
              <AlgoCard
                title="Insertion Sort"
                description="Builds the sorted array one element at a time."
                difficulty="Easy"
                tag="Sorting"
                href="/visualizer/sorting/insertion-sort"
              />
            </div>
          </div>

          {/* -------- Searching -------- */}
          <div>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Searching Algorithms</h2>
              <Link
  href="/visualizer/searching"
  className="btn-primary text-sm"
>
  View All
</Link>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AlgoCard
                title="Linear Search"
                description="Sequentially checks each element until the target value is found."
                difficulty="Easy"
                tag="Searching"
                href="/visualizer/searching/linear-search"
              />
              <AlgoCard
                title="Binary Search"
                description="Efficiently finds a target value in a sorted array."
                difficulty="Medium"
                tag="Searching"
                href="/visualizer/searching/binary-search"
              />
            </div>
          </div>

          {/* -------- Graph -------- */}
          <div>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Graph Algorithms</h2>
              <Link
  href="/visualizer/graph"
  className="btn-primary text-sm"
>
  View All
</Link>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AlgoCard
                title="Depth-First Search"
                description="Explores as far as possible along each branch before backtracking."
                difficulty="Medium"
                tag="Graph"
                href="/visualizer/graph/dfs"
              />
              <AlgoCard
                title="Breadth-First Search"
                description="Explores all neighboring nodes at the current depth."
                difficulty="Medium"
                tag="Graph"
                href="/visualizer/graph/bfs"
              />
              <AlgoCard
                title="Dijkstra’s Algorithm"
                description="Finds the shortest path between nodes in a weighted graph."
                difficulty="Hard"
                tag="Graph"
                href="/visualizer/graph/dijkstra"
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
