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
            Data structures are fundamental ways of organizing and storing data
            so it can be accessed and modified efficiently. Understanding how
            they work is essential for building efficient algorithms and
            scalable systems.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <AlgoCard
            title="Stack"
            description="A Last-In First-Out (LIFO) structure where elements are added and removed from the top."
            difficulty="Easy"
            tag="Data Structure"
            href="/visualizer/datastructures/stack"
          />

          <AlgoCard
            title="Queue"
            description="A First-In First-Out (FIFO) structure where elements are processed in order."
            difficulty="Easy"
            tag="Data Structure"
            href="/visualizer/datastructures/queue"
          />

          <AlgoCard
            title="Linked List"
            description="A linear data structure where elements are connected using pointers."
            difficulty="Medium"
            tag="Data Structure"
            href="/visualizer/datastructures/linked-list"
          />

          <AlgoCard
            title="Binary Tree"
            description="A hierarchical structure where each node can have up to two children."
            difficulty="Medium"
            tag="Data Structure"
            href="/visualizer/datastructures/tree"
          />

          <AlgoCard
            title="Heap"
            description="A specialized binary tree used to implement priority queues efficiently."
            difficulty="Medium"
            tag="Data Structure"
            href="/visualizer/datastructures/heap"
          />

        </div>
      </main>
    </div>
  );
}