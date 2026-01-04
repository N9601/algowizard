// app/visualizer/sorting/page.tsx

import Navbar from "components/visualizer/Navbar";
import AlgoCard from "components/visualizer/AlgoCard";


export default function SortingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0e1628] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-14 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">
            Sorting Algorithms
          </h1>
          <p className="text-white/70 leading-relaxed">
            Sorting algorithms are fundamental techniques used to rearrange a
            collection of elements into a specific order, most commonly
            ascending or descending. These algorithms differ in strategy,
            efficiency, and performance.
          </p>
        </div>

        {/* Algorithm Cards */}
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

          <AlgoCard
            title="Merge Sort"
            description="A divide and conquer algorithm that divides the array into halves."
            difficulty="Medium"
            tag="Sorting"
            href="/visualizer/sorting/merge-sort"
          />

          <AlgoCard
            title="Quick Sort"
            description="Divide and conquer algorithm that partitions around a pivot."
            difficulty="Medium"
            tag="Sorting"
            href="/visualizer/sorting/quick-sort"
          />

          <AlgoCard
            title="Heap Sort"
            description="A comparison-based sorting algorithm using a binary heap."
            difficulty="Hard"
            tag="Sorting"
            href="/visualizer/sorting/heap-sort"
          />
        </div>
      </main>
    </div>
  );
}
