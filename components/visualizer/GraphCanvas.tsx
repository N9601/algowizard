"use client";

interface GraphCanvasProps {
  nodes: { id: number; x: number; y: number }[];
  edges: { from: number; to: number }[];
  activeNode?: number;
  visited?: number[];
}

export default function GraphCanvas({
  nodes,
  edges,
  activeNode,
  visited = [],
}: GraphCanvasProps) {
  const getColor = (id: number) => {
    if (id === activeNode) return "#facc15"; // yellow
    if (visited.includes(id)) return "#22c55e"; // green
    return "#3b82f6"; // blue
  };

  return (
    <svg viewBox="0 0 500 300" className="w-full h-72">
      {/* edges */}
      {edges.map((e, i) => {
        const from = nodes.find((n) => n.id === e.from)!;
        const to = nodes.find((n) => n.id === e.to)!;
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#64748b"
            strokeWidth="2"
          />
        );
      })}

      {/* nodes */}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="18" fill={getColor(n.id)} />
          <text
            x={n.x}
            y={n.y + 5}
            textAnchor="middle"
            fontSize="12"
            fill="white"
            fontWeight="bold"
          >
            {n.id}
          </text>
        </g>
      ))}
    </svg>
  );
}
