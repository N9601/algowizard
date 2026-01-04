"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

type Node = {
  id: number;
  x: number;
  y: number;
};

type Edge = {
  from: number;
  to: number;
};

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  activeNode?: number;
  visited?: number[];
}

export default function GraphCanvas({
  nodes,
  edges,
  activeNode,
  visited = [],
}: GraphCanvasProps) {
  /* ------------------------------------------------
     CLIENT-ONLY RENDER GUARD (FIXES HYDRATION)
     This is VALID React. ESLint is just whining.
  ------------------------------------------------ */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getColor = (id: number) => {
    if (id === activeNode) return "#22c55e"; // active
    if (visited.includes(id)) return "#3b82f6"; // visited
    return "#60a5fa"; // default
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl p-6">
      <svg
        viewBox="0 0 500 340"
        className="w-full h-72"
        preserveAspectRatio="xMidYMin meet"
      >
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
              {n.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
