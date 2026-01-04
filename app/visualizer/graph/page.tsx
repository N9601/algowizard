import Navbar from "components/visualizer/Navbar";
import AlgoCard from "components/visualizer/AlgoCard";


export default function GraphPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0e1628] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-14 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">
            Graph Algorithms
          </h1>
          <p className="text-white/70 leading-relaxed">
            Graph algorithms operate on nodes and edges to solve problems such
            as traversal, shortest paths, and connectivity. They are widely used
            in networking, maps, and real-world system modeling.
          </p>
        </div>

        {/* Cards */}
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
            description="Explores all neighboring nodes at the current depth before moving deeper."
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

          <AlgoCard
            title="Topological Sort"
            description="Linearly orders nodes such that for every directed edge (u, v), node u comes before v."
            difficulty="Hard"
            tag="Graph"
            href="/visualizer/graph/topological"
          />

          <AlgoCard
            title="Bellman-Ford Algorithm"
            description="Computes shortest paths from a single source and can handle negative edge weights."
            difficulty="Hard"
            tag="Graph"
            href="/visualizer/graph/bellman-ford"
          />
        </div>
      </main>
    </div>
  )
}
