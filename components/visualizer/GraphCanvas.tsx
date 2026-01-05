"use client";

type Node = {
  id: number;
  x: number;
  y: number;
};

type Edge = {
  from: number;
  to: number;
  weight?: number;
};

export default function GraphCanvas({
  nodes,
  edges,
  activeNode,
  visited = [],
  distances,
  negativeCycleNodes = [],
}: {
  nodes: Node[];
  edges: Edge[];
  activeNode?: number;
  visited?: number[];
  distances?: Record<number, number>;
  negativeCycleNodes?: number[];
}) {
  const getColor = (id: number) => {
    if (negativeCycleNodes.includes(id)) return "#ef4444"; // red
    if (id === activeNode) return "#22c55e"; // green
    if (visited.includes(id)) return "#3b82f6"; // blue
    return "#60a5fa";
  };

  return (
    <svg viewBox="0 0 500 340" className="w-full h-72">
      {/* edges */}
      {edges.map((e, i) => {
        const from = nodes.find((n) => n.id === e.from);
        const to = nodes.find((n) => n.id === e.to);
        if (!from || !to) return null;

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
          <circle cx={n.x} cy={n.y} r={18} fill={getColor(n.id)} />
          <text
            x={n.x}
            y={n.y + 5}
            textAnchor="middle"
            fontSize="12"
            fill="white"
            fontWeight="bold"
          >
            {distances?.[n.id] ?? n.id}
          </text>
        </g>
      ))}
    </svg>
  );
}
