interface ControlsProps {
  onPlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onNew: () => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  progress: number;
  isPlaying: boolean;
}

export default function Controls({
  onPlay,
  onStep,
  onReset,
  onNew,
  speed,
  onSpeedChange,
  progress,
  isPlaying,
}: ControlsProps) {
  // UI slider: 0 (slow) → 100 (fast)
  const uiSpeed = Math.round(((1000 - speed) / (1000 - 50)) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-white/10 shadow-xl p-6 space-y-6">
      {/* Glow accent */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />

      {/* TOP ACTIONS */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Step Back */}
        <button
          onClick={onStep}
          className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-blue-400 flex items-center justify-center transition"
          title="Step"
        >
          ◀
        </button>

        {/* Play / Pause */}
        <button
          onClick={onPlay}
          className={`px-8 py-3 rounded-full font-semibold text-white transition-all shadow-lg
            ${
              isPlaying
                ? "bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/30 hover:scale-105"
                : "bg-gradient-to-r from-emerald-500 to-green-500 shadow-emeraldald-500/30 hover:scale-105"
            }
          `}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* Step Forward */}
        <button
          onClick={onStep}
          className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-blue-400 flex items-center justify-center transition"
          title="Step"
        >
          ▶
        </button>
      </div>

      {/* PROGRESS */}
      <div className="relative z-10 space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Progress</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* SPEED */}
      <div className="relative z-10 space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Slow</span>
          <span>Fast</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={uiSpeed}
          onChange={(e) => {
            const ui = Number(e.target.value);
            const engineSpeed = 1000 - (ui / 100) * (1000 - 50);
            onSpeedChange(Math.round(engineSpeed));
          }}
          className="w-full accent-blue-500 cursor-pointer"
        />
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="relative z-10 flex gap-4">
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-gray-200 transition"
        >
          Reset
        </button>

        <button
          onClick={onNew}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md hover:scale-[1.02] transition"
        >
          New Array
        </button>
      </div>
    </div>
  );
}
