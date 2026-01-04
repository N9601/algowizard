export default function ColorLegend() {
  return (
    <div className="bg-slate-900/70 rounded-xl p-5 shadow-md">
      <h3 className="font-semibold text-white mb-3">
        Color Legend
      </h3>

      <div className="flex flex-wrap gap-4 text-sm">
        <Legend color="bg-blue-500" label="Unsorted" />
        <Legend color="bg-yellow-400" label="Comparing" />
        <Legend color="bg-red-500" label="Swapping" />
        <Legend color="bg-green-500" label="Sorted" />
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
