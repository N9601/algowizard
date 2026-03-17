"use client";

import { memo, useEffect, useRef } from "react";

type Point = { x: number; y: number; label?: number; cluster?: number };
type Centroid = { x: number; y: number };

type ScatterCanvasProps = {
  points: Point[];
  centroids?: Centroid[];
  width?: number;
  height?: number;
  onClick?: (p: { x: number; y: number }) => void;
  decisionBoundary?: ImageData;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function colorFor(index: number) {
  const palette = [
    "#60a5fa",
    "#f472b6",
    "#34d399",
    "#f59e0b",
    "#a78bfa",
    "#fb7185",
  ];
  return palette[index % palette.length];
}

const ScatterCanvas = memo(function ScatterCanvas({
  points,
  centroids = [],
  width = 520,
  height = 360,
  onClick,
  decisionBoundary,
}: ScatterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (decisionBoundary) {
      ctx.putImageData(decisionBoundary, 0, 0);
    }

    // Draw points
    for (const p of points) {
      ctx.beginPath();
      ctx.fillStyle =
        typeof p.cluster === "number"
          ? colorFor(p.cluster)
          : typeof p.label === "number"
            ? colorFor(p.label)
            : "#ffffff";
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Draw centroids
    for (let i = 0; i < centroids.length; i++) {
      const c = centroids[i];
      ctx.beginPath();
      ctx.fillStyle = colorFor(i);
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      ctx.arc(c.x, c.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }, [points, centroids, width, height, decisionBoundary]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full cursor-crosshair rounded-2xl border border-white/10 bg-[#0a0f1b]"
      onClick={(e) => {
        if (!onClick) return;
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const x = clamp(e.clientX - rect.left, 0, rect.width);
        const y = clamp(e.clientY - rect.top, 0, rect.height);
        onClick({ x, y });
      }}
    />
  );
});

export default ScatterCanvas;
