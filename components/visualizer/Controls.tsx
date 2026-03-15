interface ControlsProps {
  onPlay: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onNew: () => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  progress: number;
  isPlaying: boolean;
  statusText?: string;
}

export default function Controls({
  onPlay,
  onStepForward,
  onStepBack,
  onReset,
  onNew,
  speed,
  onSpeedChange,
  progress,
  isPlaying,
  statusText,
}: ControlsProps) {
  // UI slider: 0 (slow) → 100 (fast)
  const uiSpeed = Math.round(((1000 - speed) / (1000 - 50)) * 100);

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-6">
        {statusText ? (
          <div className="rounded-[1.35rem] border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
              Step narration
            </div>
            <p className="mt-2 text-sm leading-6 text-white/74">{statusText}</p>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
        <button
          onClick={onStepBack}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/78 transition hover:bg-white/[0.06]"
          title="Previous Step"
        >
          ◀
        </button>

        <button
          onClick={onPlay}
          className={`rounded-full px-7 py-3 text-sm font-semibold text-white transition
            ${
              isPlaying
                ? "bg-white/12 hover:bg-white/18"
                : "bg-blue-500 hover:bg-blue-400"
            }
          `}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={onStepForward}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/78 transition hover:bg-white/[0.06]"
          title="Next Step"
        >
          ▶
        </button>
      </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-white/40">
          <span>Progress</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-blue-400 transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-white/40">
            <span>Animation</span>
            <span>{uiSpeed}%</span>
          </div>

          <div className="flex justify-between text-xs text-white/50">
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
          className="w-full cursor-pointer accent-blue-400"
        />
      </div>

        <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={onReset}
          className="rounded-2xl border border-white/10 bg-black/20 py-3 text-sm font-medium text-white/78 transition hover:bg-white/[0.06]"
        >
          Reset
        </button>

        <button
          onClick={onNew}
          className="rounded-2xl border border-white/10 bg-white/[0.06] py-3 text-sm font-medium text-white transition hover:bg-white/[0.1]"
        >
          New Example
        </button>
      </div>
    </div>
    </div>
  );
}
