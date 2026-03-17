"use client";

type Cell = "X" | "O" | null;

type Props = {
  board: Cell[];
  highlight?: number[];
  onMove?: (index: number) => void;
};

export default function TicTacToeBoard({ board, highlight = [], onMove }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((cell, idx) => {
        const isHighlight = highlight.includes(idx);
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onMove?.(idx)}
            className={`flex aspect-square items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-2xl font-bold text-white transition hover:border-white/25 hover:bg-white/[0.08] ${
              isHighlight ? "shadow-[0_0_0_3px_rgba(96,165,250,0.45)]" : ""
            }`}
          >
            {cell ?? ""}
          </button>
        );
      })}
    </div>
  );
}
