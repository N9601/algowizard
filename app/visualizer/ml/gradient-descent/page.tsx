"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "components/visualizer/Navbar";
import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "components/visualizer/AlgorithmLayout";
import Controls from "components/visualizer/Controls";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { generateGDSteps, GDStep, loss } from "src/lib/engine/algorithms/gradientDescent";
import { StepController } from "src/lib/engine/controller";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

type SavedGD = {
  start: { x: number; y: number };
  lr: number;
  speed: number;
};

export default function GradientDescentPage() {
  const [start, setStart] = useState<{ x: number; y: number }>({ x: 3, y: 2 });
  const [lr, setLr] = useState(0.15);
  const [step, setStep] = useState<GDStep | null>(null);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(450);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GDStep> | null>(null);
  const initializedRef = useRef(false);

  const savedState = useSavedVisualization<SavedGD>({
    expectedRoute: "/visualizer/ml/gradient-descent",
    applyState: (saved) => {
      controllerRef.current?.pause();
      controllerRef.current?.reset();
      setStart(saved.start ?? { x: 3, y: 2 });
      setLr(saved.lr ?? 0.15);
      setSpeed(saved.speed ?? 450);
      setStep(null);
      setProgress(0);
      setIsPlaying(false);
    },
  });

  const steps = useMemo(() => generateGDSteps(start, lr, 40), [start, lr]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    rebuild();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    rebuild();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  useEffect(() => {
    controllerRef.current?.setSpeed(speed);
  }, [speed]);

  const rebuild = () => {
    if (!steps.length) return;
    controllerRef.current = new StepController(steps, (s) => {
      setStep(s);
      if (controllerRef.current) {
        setProgress(
          controllerRef.current.currentStepIndex /
            controllerRef.current.steps.length
        );
      }
    });
    controllerRef.current.setSpeed(speed);
    setStep(steps[0]);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!controllerRef.current) return;
    if (isPlaying) controllerRef.current.pause();
    else controllerRef.current.play();
    setIsPlaying((v) => !v);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="sorting" />

      <AlgorithmLayout
        title="Gradient Descent"
        description="Move against the gradient on a smooth 2D loss surface. Adjust the learning rate to see convergence change."
        time="O(T)"
        space="O(1)"
        category="Machine Learning"
        difficulty="Easy"
        progressPercent={Math.round(progress * 100)}
        actions={
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <label className="text-white/70">Start x:</label>
              <input
                type="number"
                step="0.2"
                value={start.x}
                onChange={(e) => setStart((s) => ({ ...s, x: Number(e.target.value) }))}
                className="w-20 rounded-md border border-white/15 bg-white/[0.06] px-2 py-1 text-white"
              />
              <label className="text-white/70">Start y:</label>
              <input
                type="number"
                step="0.2"
                value={start.y}
                onChange={(e) => setStart((s) => ({ ...s, y: Number(e.target.value) }))}
                className="w-20 rounded-md border border-white/15 bg-white/[0.06] px-2 py-1 text-white"
              />
              <label className="text-white/70">Learning rate:</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="0.6"
                value={lr}
                onChange={(e) =>
                  setLr(Math.min(0.6, Math.max(0.01, Number(e.target.value))))
                }
                className="w-24 rounded-md border border-white/15 bg-white/[0.06] px-2 py-1 text-white"
              />
              <button
                type="button"
                onClick={() => setStart({ x: 3, y: 2 })}
                className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
              >
                Reset start
              </button>
            </div>
            <SaveVisualizationButton
              title="Gradient Descent"
              algorithmSlug="gradient-descent"
              route="/visualizer/ml/gradient-descent"
              disabled={!step}
              getPayload={() => ({
                start,
                lr,
                speed,
              })}
            />
            {savedState.loadedTitle ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                Loaded saved state: {savedState.loadedTitle}
              </div>
            ) : null}
            {savedState.loadError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                {savedState.loadError}
              </div>
            ) : null}
          </div>
        }
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <LossViz current={step} />
        </div>

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={`Iteration ${step?.iteration ?? 0} • Loss ${step ? step.z.toFixed(3) : "-"}`}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(controllerRef.current?.steps[0] ?? null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setStart({ x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 });
            setIsPlaying(false);
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />
      </AlgorithmLayout>
    </>
  );
}

function LossViz({ current }: { current: GDStep | null }) {
  if (!current) return null;

  const samples = 28;
  const xs = Array.from({ length: samples }, (_, i) => -3 + (6 * i) / (samples - 1));
  const ys = xs;
  const points: Array<{ x: number; y: number; z: number }> = [];

  for (const x of xs) {
    for (const y of ys) {
      points.push({ x, y, z: loss(x, y) });
    }
  }

  const minZ = Math.min(...points.map((p) => p.z));
  const maxZ = Math.max(...points.map((p) => p.z));

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm text-white/70">
        Loss surface (z = 0.1(x² + 2y²) + 0.5 sin x)
      </div>
      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1b]">
        {points.map((p, idx) => {
          const left = ((p.x + 3) / 6) * 100;
          const top = ((p.y + 3) / 6) * 100;
          const t = (p.z - minZ) / (maxZ - minZ + 1e-6);
          const c = `hsl(${220 - 120 * t} 80% 60%)`;
          return (
            <span
              key={idx}
              className="absolute h-[6px] w-[6px] rounded-full"
              style={{ left: `${left}%`, top: `${top}%`, background: c, opacity: 0.7 }}
            />
          );
        })}
        <div
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-pink-500 shadow-[0_0_0_8px_rgba(236,72,153,0.25)]"
          style={{
            left: `${((current.x + 3) / 6) * 100}%`,
            top: `${((current.y + 3) / 6) * 100}%`,
          }}
          title={`Loss ${current.z.toFixed(3)}`}
        />
      </div>
    </div>
  );
}
