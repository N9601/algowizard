const LEGENDS = {
  sorting: [
    { color: "bg-blue-500", label: "Unsorted" },
    { color: "bg-yellow-400", label: "Comparing" },
    { color: "bg-red-500", label: "Swapping" },
    { color: "bg-green-500", label: "Sorted" },
  ],
  // Matches the node fills in GraphCanvas.
  graph: [
    { color: "bg-green-500", label: "Active node" },
    { color: "bg-blue-500", label: "Visited" },
    { color: "bg-blue-400", label: "Not yet visited" },
  ],
};

export default function ColorLegend({
  variant = "sorting",
}: {
  variant?: keyof typeof LEGENDS;
}) {
  return (
    <div className="bg-slate-900/70 rounded-xl p-5 shadow-md">
      <h3 className="font-semibold text-white mb-3">
        Color Legend
      </h3>

      <div className="flex flex-wrap gap-4 text-sm">
        {LEGENDS[variant].map((item) => (
          <Legend key={item.label} color={item.color} label={item.label} />
        ))}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${color}`} />
      <span className="text-gray-300">{label}</span>
    </div>
  );
}
