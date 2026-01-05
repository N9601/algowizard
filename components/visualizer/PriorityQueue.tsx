export default function PriorityQueue({
  queue,
}: {
  queue: { node: number; priority: number }[];
}) {
  if (!queue.length) return null;

  return (
    <div className="bg-slate-900/70 rounded-xl p-4 w-56">
      <h3 className="text-white font-semibold mb-3">
        Priority Queue
      </h3>

      <ul className="space-y-2">
        {queue.map((q, i) => (
          <li
            key={i}
            className="flex justify-between text-sm text-gray-200"
          >
            <span>Node {q.node}</span>
            <span>{q.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
