"use client";

import { useEffect, useRef, useState } from "react";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import { StepController } from "src/lib/engine/controller";
import { generateRecursionSteps } from "src/lib/engine/algorithms/recursion";
import { RecursionStep } from "src/lib/engine/types";
import { describeRecursionStep } from "src/lib/education/stepNarration";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

const ROUTE = "/visualizer/datastructures/recursion";

export default function RecursionPage() {
  const [step, setStep] = useState<RecursionStep | null>(null);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(650);
  const [isPlaying, setIsPlaying] = useState(false);
  const [depth, setDepth] = useState(5);
  const [pendingDepth, setPendingDepth] = useState(5);

  const controllerRef = useRef<StepController<RecursionStep> | null>(null);

  const initialize = (nextDepth = 5) => {
    const steps = generateRecursionSteps(nextDepth);

    controllerRef.current = new StepController(steps, (newStep) => {
      setStep(newStep);
      setProgress(
        controllerRef.current!.currentStepIndex /
          controllerRef.current!.steps.length
      );
    });

    setDepth(nextDepth);
    setPendingDepth(nextDepth);
  };

  useEffect(() => {
    // Initial setup
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initialize(5);
    return () => controllerRef.current?.pause();
  }, []);

  useEffect(() => {
    controllerRef.current?.setSpeed(speed);
  }, [speed]);

  const togglePlay = () => {
    if (!controllerRef.current) return;

    if (isPlaying) controllerRef.current.pause();
    else controllerRef.current.play();

    setIsPlaying(!isPlaying);
  };

  const regenerate = () => {
    const randomDepth = Math.floor(Math.random() * 3) + 4; // 4–6
    initialize(randomDepth);
    setStep(null);
    setProgress(0);
    setIsPlaying(false);
  };

  const applyCustomDepth = () => {
    const bounded = Math.min(10, Math.max(1, pendingDepth));
    initialize(bounded);
    setStep(null);
    setProgress(0);
    setIsPlaying(false);
  };

  const { isLoading, loadError, loadedTitle } = useSavedVisualization<{
    n: number;
  }>({
    expectedRoute: ROUTE,
    applyState: (config) => {
      const candidate = Number((config as { n?: number }).n ?? 5);
      const bounded = Number.isFinite(candidate)
        ? Math.min(10, Math.max(1, Math.round(candidate)))
        : 5;
      initialize(bounded);
      setStep(null);
      setProgress(0);
      setIsPlaying(false);
    },
  });

  const stackEmpty = !step?.stack.length;

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="datastructure" />

      <AlgorithmLayout
        title="Recursion Call Stack"
        description="Trace how a factorial function grows the call stack and then unwinds it back to the base case."
        time="O(n)"
        space="O(n)"
        category="Data Structure"
        difficulty="Easy"
        progressPercent={Math.round(progress * 100)}
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80">
            <div className="font-medium text-white">
              Visualizing factorial of <span className="text-sky-200">n</span>.
            </div>
            <div className="flex items-center gap-2">
              <label className="text-white/60 text-xs uppercase tracking-[0.14em]">
                n
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={pendingDepth}
                onChange={(e) => setPendingDepth(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyCustomDepth();
                }}
                className="w-20 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
              />
              <button
                type="button"
                onClick={applyCustomDepth}
                className="rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-sky-400 transition"
              >
                Update
              </button>
              <span className="text-xs text-white/50">
                Current n = {depth} (1–10 recommended)
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-white/70">
            Newest frame appears on the right. Each frame shows the active call
            or the value being returned.
          </div>

          <div className="flex flex-wrap items-end justify-center gap-3">
            {stackEmpty && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-white/60">
                Call stack is empty.
              </div>
            )}

            {step?.stack.map((frame, idx) => (
              <div
                key={`${frame.n}-${idx}-${frame.status}`}
                className="w-40 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 shadow-xl backdrop-blur"
              >
                <div className="text-xs uppercase tracking-[0.12em] text-white/40">
                  Frame {idx + 1}
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  f({frame.n})
                </div>
                <div className="mt-3 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sky-200">
                  {frame.status === "returning"
                    ? `Returning ${frame.result}`
                    : "Call in progress"}
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center font-mono text-sm text-blue-100">
            {step?.message ?? "Press play to watch the recursion unfold."}
          </div>
        </div>

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={describeRecursionStep(step)}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={regenerate}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SaveVisualizationButton
            title={`Recursion n=${depth}`}
            algorithmSlug="recursion-call-stack"
            route={ROUTE}
            disabled={isLoading}
            getPayload={() => ({ n: depth })}
          />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80">
            <div className="font-semibold text-white">Saved states</div>
            <p className="mt-2 text-white/65">
              Open this page with <code className="rounded bg-white/10 px-1">?saved=ID</code>{" "}
              to restore a saved recursion depth tied to your account.
            </p>
            {isLoading ? (
              <p className="mt-2 text-xs text-white/60">Loading saved state…</p>
            ) : null}
            {loadedTitle ? (
              <p className="mt-2 text-xs text-sky-200">
                Loaded saved state: {loadedTitle}
              </p>
            ) : null}
            {loadError ? (
              <p className="mt-2 text-xs text-rose-200">
                {loadError}
              </p>
            ) : null}
          </div>
        </div>
      </AlgorithmLayout>
    </>
  );
}
