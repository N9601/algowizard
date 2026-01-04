import { ReactNode } from "react";

interface AlgorithmLayoutProps {
  title: string;
  description: string;
  time: string;
  space: string;
  category: string;
  difficulty: string;
  children: ReactNode;
}

export default function AlgorithmLayout({
  title,
  description,
  time,
  space,
  category,
  difficulty,
  children,
}: AlgorithmLayoutProps) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* HEADER (DARK, REWRITTEN CONTENT) */}
      <div className="bg-slate-900/70 backdrop-blur rounded-xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-white">
          {title}
        </h1>

        <p className="text-gray-300 mt-4 max-w-4xl leading-relaxed">
          {description}
        </p>

        {/* META INFO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <Meta label="Time Complexity" value={time} />
          <Meta label="Space Complexity" value={space} />
          <Meta label="Category" value={category} />
          <Meta label="Difficulty" value={difficulty} />
        </div>
      </div>

      {/* VISUALIZER PANEL (UNCHANGED) */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/80 rounded-lg px-4 py-3">
      <div className="text-sm text-gray-400">
        {label}
      </div>
      <div className="font-semibold text-white mt-1">
        {value}
      </div>
    </div>
  );
}
