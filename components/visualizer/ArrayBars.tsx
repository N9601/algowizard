"use client";

interface ArrayBarsProps {
  array: number[];

  /* ===== Sorting ===== */
  comparing?: [number, number];
  swapping?: [number, number];
  sortedIndices?: number[];
  activeRange?: [number, number];

  /* ===== Searching ===== */
  currentIndex?: number;
  foundIndex?: number;
  low?: number;
  high?: number;
}

export default function ArrayBars({
  array,

  /* sorting */
  comparing,
  swapping,
  sortedIndices = [],
  activeRange,

  /* searching */
  currentIndex,
  foundIndex,
  low,
  high,
}: ArrayBarsProps) {
  const max = Math.max(...array, 1);

  const isSearching =
    currentIndex !== undefined ||
    foundIndex !== undefined ||
    (low !== undefined && high !== undefined);

  return (
    <div className="flex items-end justify-center gap-2 h-64 w-full px-4">
      {array.map((value, i) => {
        let color = "bg-blue-500"; // default

        /* =====================
           SEARCH MODE
        ===================== */
        if (isSearching) {
          if (low !== undefined && high !== undefined) {
            if (i < low || i > high) {
              color = "bg-gray-700";
            }
          }

          if (currentIndex === i) {
            color = "bg-yellow-400";
          }

          if (foundIndex === i) {
            color = "bg-green-500";
          }
        }

        /* =====================
           SORT MODE
        ===================== */
        else {
          if (sortedIndices.includes(i)) {
            color = "bg-green-500";
          }

          if (activeRange && i >= activeRange[0] && i <= activeRange[1]) {
            color = "bg-yellow-300";
          }

          if (comparing?.includes(i)) {
            color = "bg-yellow-400";
          }

          if (swapping?.includes(i)) {
            color = "bg-red-500";
          }
        }

        return (
          <div
            key={i}
            className={`relative flex-1 rounded-md transition-all duration-300 ${color}`}
            style={{ height: `${(value / max) * 100}%` }}
          >
            <span className="absolute bottom-1 w-full text-center text-xs text-white">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}