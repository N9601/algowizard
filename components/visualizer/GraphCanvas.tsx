"use client";

type Node = { id: number; x: number; y: number };
type Edge = { from: number; to: number; weight?: number };

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  activeNode?: number;
  visited?: number[];
  distances?: Record<number, number>;
}

export default function GraphCanvas({
  nodes,
  edges,
  activeNode,
  visited = [],
  distances,
}: GraphCanvasProps) {
  const getColor = (id: number) => {
    if (id === activeNode) return "#22c55e";
    if (visited.includes(id)) return "#3b82f6";
    return "#60a5fa";
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl p-6">
      <svg viewBox="0 0 500 300" className="w-full h-72">
        {/* edges */}
        {edges.map((e, i) => {
          const from = nodes.find(n => n.id === e.from)!;
          const to = nodes.find(n => n.id === e.to)!;
          return (
            <g key={i}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#64748b"
                strokeWidth="2"
              />
              {e.weight !== undefined && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 5}
                  fill="white"
                  fontSize="11"
                >
                  {e.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* nodes */}
        {nodes.map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={18} fill={getColor(n.id)} />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fontSize="12"
              fill="white"
              fontWeight="bold"
            >
              {distances?.[n.id] === Infinity
                ? "∞"
                : distances?.[n.id] ?? n.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}