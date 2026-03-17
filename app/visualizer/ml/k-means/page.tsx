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
    },
  });

  const steps = useMemo(() => generateKMeansSteps(points, k), [points, k]);

  useEffect(() => {
    if (!steps.length) return;
    controllerRef.current = new StepController(steps, () => {
      setCurrentIndex((i) => controllerRef.current?.currentStepIndex ?? i);
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
      setProgress(0);
      setIsPlaying(false);
    }, 0);
  }, [steps, speed]);

  const currentStep = steps[currentIndex] ?? steps[0] ?? null;

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
              label: p.cluster,
            }))}
            centroids={currentStep?.centroids}
            width={WIDTH}
            height={HEIGHT}
            onClick={(p) => setPoints((prev) => [...prev, { x: p.x, y: p.y }])}
          />
          <div className="mt-2 text-xs text-white/60">
            Click to add points. k controls the number of centroids.
          </div>
        </div>

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={`Iteration ${currentStep?.iteration ?? 0}`}
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
