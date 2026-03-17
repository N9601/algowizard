"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "components/visualizer/Navbar";
import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "components/visualizer/AlgorithmLayout";
import Controls from "components/visualizer/Controls";
import ScatterCanvas from "components/visualizer/ScatterCanvas";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { generateKMeansSteps, KMeansStep } from "src/lib/engine/algorithms/kmeans";
import { StepController } from "src/lib/engine/controller";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

type Point = { x: number; y: number };
type SavedKMeans = {
  points: Point[];
  k: number;
  speed: number;
};

const WIDTH = 520;
const HEIGHT = 360;

function randomPoints(count = 40): Point[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
  }));
}

export default function KMeansPage() {
  const [points, setPoints] = useState<Point[]>(() => randomPoints());
  const [k, setK] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(400);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<KMeansStep | null>(null);

  const controllerRef = useRef<StepController<KMeansStep> | null>(null);

  const savedState = useSavedVisualization<SavedKMeans>({
    expectedRoute: "/visualizer/ml/k-means",
    applyState: (saved) => {
      controllerRef.current?.pause();
      controllerRef.current?.reset();
      setPoints(saved.points ?? randomPoints());
      setK(saved.k ?? 3);
      setSpeed(saved.speed ?? 400);
      setProgress(0);
      setIsPlaying(false);
      setCurrentStep(null);
    },
  });

  const steps = useMemo(() => generateKMeansSteps(points, k), [points, k]);

  useEffect(() => {
    if (!steps.length) return;
    controllerRef.current = new StepController(steps, () => {
      setCurrentIndex((i) => controllerRef.current?.currentStepIndex ?? i);
      setCurrentStep(controllerRef.current?.steps[controllerRef.current.currentStepIndex] ?? null);
      if (controllerRef.current) {
        setProgress(
          controllerRef.current.currentStepIndex /
            controllerRef.current.steps.length
        );
      }
    });
    controllerRef.current.setSpeed(speed);
    setTimeout(() => {
      setCurrentIndex(0);
      setCurrentStep(steps[0] ?? null);
      setProgress(0);
      setIsPlaying(false);
    }, 0);
  }, [steps, speed]);

  const previousStep =
    currentStep && currentIndex > 0 ? steps[currentIndex - 1] : null;
  const centroidShift =
    currentStep && previousStep
      ? avgShift(previousStep.centroids, currentStep.centroids)
      : 0;
  const narration = currentStep
    ? `Iteration ${currentStep.iteration}: assign points, then recenter centroids (avg shift ${centroidShift.toFixed(2)}).`
    : "Ready to start k-Means.";

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
        title="k-Means Clustering"
        description="Assign each point to the nearest centroid, then recenter centroids until they stop moving."
        time="O(nkT)"
        space="O(n + k)"
        category="Machine Learning"
        difficulty="Easy"
        progressPercent={Math.round(progress * 100)}
        actions={
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <label className="text-white/70">k:</label>
              <input
                type="number"
                min={1}
                max={6}
                value={k}
                onChange={(e) => setK(Math.min(6, Math.max(1, Number(e.target.value))))}
                className="w-16 rounded-md border border-white/15 bg-white/[0.06] px-2 py-1 text-white"
              />
              <button
                type="button"
                onClick={() => setPoints(randomPoints())}
                className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
              >
                Random points
              </button>
              <button
                type="button"
                onClick={() => setPoints([])}
                className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
              >
                Clear
              </button>
            </div>
            <SaveVisualizationButton
              title="k-Means"
              algorithmSlug="k-means"
              route="/visualizer/ml/k-means"
              disabled={!points.length}
              getPayload={() => ({
                points,
                k,
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
          <ScatterCanvas
            points={(currentStep?.points ?? points).map((p) => ({
              ...p,
              label: (p as { cluster?: number }).cluster,
            }))}
            centroids={currentStep?.centroids}
            width={WIDTH}
            height={HEIGHT}
            onClick={(p) => setPoints((prev) => [...prev, { x: p.x, y: p.y }])}
          />
          <div className="mt-2 text-xs text-white/60">
            Click to add points. k controls the number of centroids. {narration}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/65">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-3 w-3 rounded-sm bg-[#60a5fa]" /> Cluster 1
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-3 w-3 rounded-sm bg-[#f472b6]" /> Cluster 2
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-3 w-3 rounded-sm bg-[#34d399]" /> Cluster 3+
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-3 w-3 rounded-sm bg-white/80" /> Centroids
            </span>
          </div>
        </div>

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={`Iteration ${currentStep?.iteration ?? 0} • Centroid shift ${centroidShift.toFixed(2)}`}
          onReset={() => {
            controllerRef.current?.reset();
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setPoints(randomPoints());
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

function avgShift(a: { x: number; y: number }[], b: { x: number; y: number }[]) {
  if (!a.length || !b.length) return 0;
  const count = Math.min(a.length, b.length);
  let total = 0;
  for (let i = 0; i < count; i++) {
    const dx = a[i].x - b[i].x;
    const dy = a[i].y - b[i].y;
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total / count;
}
