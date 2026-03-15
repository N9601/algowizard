"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type HeroNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  level: number;
};

const quickPoints = [
  "Saved states",
  "AI study chat",
  "Smooth speed controls",
];

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let frame = 0;
    let animationFrame = 0;

    const levels = 5;
    const nodes: HeroNode[] = [];

    for (let level = 0; level < levels; level += 1) {
      const count = Math.pow(2, level);

      for (let index = 0; index < count; index += 1) {
        nodes.push({
          x: ((index + 1) * width) / (count + 1),
          y: ((level + 1) * height) / (levels + 1),
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          level,
        });
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);

      const gridOffsetX = (mouseRef.current.x / Math.max(width, 1) - 0.5) * 24;
      const gridOffsetY = (mouseRef.current.y / Math.max(height, 1) - 0.5) * 24;

      context.strokeStyle = "rgba(255,255,255,0.035)";

      for (let x = 0; x <= width; x += 72) {
        context.beginPath();
        context.moveTo(x + gridOffsetX, 0);
        context.lineTo(x + gridOffsetX, height);
        context.stroke();
      }

      for (let y = 0; y <= height; y += 72) {
        context.beginPath();
        context.moveTo(0, y + gridOffsetY);
        context.lineTo(width, y + gridOffsetY);
        context.stroke();
      }

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }

      for (let index = 0; index < nodes.length; index += 1) {
        const parent = nodes[index];

        for (let otherIndex = 0; otherIndex < nodes.length; otherIndex += 1) {
          const child = nodes[otherIndex];

          if (child.level !== parent.level + 1) {
            continue;
          }

          const dx = parent.x - child.x;
          const dy = parent.y - child.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 220) {
            context.strokeStyle = `rgba(96,165,250,${0.11 - distance / 2600})`;
            context.beginPath();
            context.moveTo(parent.x, parent.y);
            context.lineTo(child.x, child.y);
            context.stroke();
          }
        }
      }

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        const pulse = 1.4 + Math.sin(frame * 0.015 + index) * 0.25;

        context.fillStyle = "rgba(125,211,252,0.78)";
        context.beginPath();
        context.arc(node.x, node.y, pulse, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050b14] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_30%),linear-gradient(180deg,#07101b_0%,#050b14_68%,#040811_100%)]" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_35%,rgba(5,11,20,0.48)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(191 219 254)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 13l4-4 4 4" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-medium uppercase tracking-[0.24em] text-white/45">
                AlgoWizard
              </span>
              <span className="font-display block text-[1.05rem] font-semibold text-white">
                Visualizer
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/visualizer"
              className="rounded-full border border-white/10 px-4 py-2 text-white/72 transition hover:bg-white/[0.05] hover:text-white"
            >
              Explore
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/10 px-4 py-2 text-white/72 transition hover:bg-white/[0.05] hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-400"
            >
              Create account
            </Link>
          </nav>
        </header>

        <section className="flex flex-1 items-center justify-center py-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.28em] text-blue-200/72">
              Interactive Algorithm Practice
            </p>
            <h1
              className="font-display animate-fade-up mt-6 text-5xl font-semibold leading-[0.95] text-white md:text-7xl"
              style={{ animationDelay: "0.12s" }}
            >
              Understand algorithms step by step in a focused visual workspace.
            </h1>
            <p
              className="font-ui animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/66 md:text-[1.15rem]"
              style={{ animationDelay: "0.22s" }}
            >
              Step through sorting, searching, graphs, and data structures with saved
              states, smoother controls, and contextual study help.
            </p>

            <div
              className="animate-fade-up mt-10 flex flex-wrap justify-center gap-3"
              style={{ animationDelay: "0.32s" }}
            >
              <Link
                href="/visualizer"
                className="rounded-full bg-blue-500 px-7 py-3 text-sm font-semibold tracking-[0.01em] text-white transition hover:bg-blue-400"
              >
                Launch visualizer
              </Link>
              <Link
                href="/visualizer/sorting"
                className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-3 text-sm font-medium tracking-[0.01em] text-white/74 transition hover:bg-white/[0.08] hover:text-white"
              >
                Start with sorting
              </Link>
            </div>

            <div
              className="animate-fade-up mt-10 flex flex-wrap justify-center gap-3"
              style={{ animationDelay: "0.42s" }}
            >
              {quickPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/62 backdrop-blur-sm"
                >
                  {point}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-center pb-3">
          <Link
            href="/visualizer"
            className="text-xs font-semibold uppercase tracking-[0.28em] text-white/38 transition hover:text-white/62"
          >
            Enter workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
