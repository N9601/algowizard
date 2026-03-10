// app/visualizer/datastructures/page.tsx

import Navbar from "components/visualizer/Navbar";
import AlgoCard from "components/visualizer/AlgoCard";

export default function DataStructuresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0e1628] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-14 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">
            Data Structures
          </h1>

          <p className="text-white/70 leading-relaxed">
            Data structures organize and store data efficiently so that
            operations such as insertion, deletion, searching, and traversal
            can be performed effectively. Understanding data structures is
            essential for designing efficient algorithms.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <AlgoCard
            title="Stack"
            description="A linear data structure following Last In First Out (LIFO)."
            difficulty="Easy"
            tag="Data Structure"
            href="/visualizer/datastructures/stack"
          />

          <AlgoCard
            title="Queue"
            description="A linear structure following First In First Out (FIFO)."
            difficulty="Easy"
            tag="Data Structure"
            href="/visualizer/datastructures/queue"
          />

          <AlgoCard
            title="Linked List"
            description="Nodes connected using references."
            difficulty="Medium"
            tag="Data Structure"
            href="/visualizer/datastructures/linked-list"
          />

          <AlgoCard
            title="Binary Tree"
            description="Hierarchical structure with parent-child nodes."
            difficulty="Medium"
            tag="Data Structure"
            href="/visualizer/datastructures/tree"
          />

          <AlgoCard
            title="Heap"
            description="Tree-based structure used in priority queues."
            difficulty="Hard"
            tag="Data Structure"
            href="/visualizer/datastructures/heap"
          />

        </div>
      </main>
    </div>
  );
}