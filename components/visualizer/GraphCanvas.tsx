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

function formatNodeLabel(id: number, distances?: Record<number, number>) {
  const distance = distances?.[id];

  if (distance === undefined) return id;
  return Number.isFinite(distance) ? distance : "∞";
}

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
    <svg
      viewBox="0 0 500 340"
      className="w-full h-72"
      role="img"
      aria-label={`Graph with ${nodes.length} nodes and ${edges.length} edges`}
    >
      {/* edges */}
      {edges.map((e, i) => {
        const from = nodes.find((n) => n.id === e.from);
        const to = nodes.find((n) => n.id === e.to);
        if (!from || !to) return null;

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
            {e.weight !== undefined ? (
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 6}
                textAnchor="middle"
                fontSize="12"
                fill="#e2e8f0"
                stroke="#07111b"
                strokeWidth="4"
                paintOrder="stroke"
              >
                {e.weight}
              </text>
            ) : null}
          </g>
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
            {formatNodeLabel(n.id, distances)}
          </text>
        </g>
      ))}
    </svg>
  );
}
