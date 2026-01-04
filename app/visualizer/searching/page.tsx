import Navbar from "components/visualizer/Navbar";
import AlgoCard from "components/visualizer/AlgoCard";


export default function SearchingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0e1628] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-14 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">
            Searching Algorithms
          </h1>
          <p className="text-white/70 leading-relaxed">
            Searching algorithms are techniques used to locate a specific
            element within a data structure. They vary in strategy, efficiency,
            and requirements depending on whether the data is sorted or
            unsorted.
          </p>
        </div>

        {/* Cards */}
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
            description="Efficiently finds a target value in a sorted array by repeatedly dividing the search space."
            difficulty="Medium"
            tag="Searching"
            href="/visualizer/searching/binary-search"
          />
        </div>
      </main>
    </div>
  )
}
