"use client";

import { AlgorithmType, PSEUDOCODE } from "../../src/lib/education/pseudocode";

interface PseudocodeProps {
  algorithm: AlgorithmType;
}

export default function Pseudocode({ algorithm }: PseudocodeProps) {
  return (
    <div className="rounded-xl bg-slate-900 p-5 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold text-slate-200">
        Pseudocode
      </h3>

      <pre className="overflow-x-auto rounded-md bg-slate-950 p-4 text-sm text-slate-200">
        {PSEUDOCODE[algorithm].map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    </div>
  );
}


