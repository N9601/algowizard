"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "components/visualizer/Navbar";
import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "components/visualizer/AlgorithmLayout";
import Controls from "components/visualizer/Controls";
import ScatterCanvas from "components/visualizer/ScatterCanvas";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import {
  forward,
  NNPoint,
  NNState,
  trainStep,
} from "src/lib/engine/algorithms/neuralNet";
import { StepController } from "src/lib/engine/controller";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

type SavedNN = {
  points: NNPoint[];
  weights1: number[];
  weights2: number[];
  speed: number;
  lr: number;
};

const WIDTH = 520;
const HEIGHT = 360;

function randomPoints(count = 40): NNPoint[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
    label: Math.random() > 0.5 ? 1 : 0,
  }));
}

function randomWeights() {
  return Array.from({ length: 6 }, () => (Math.random() - 0.5) * 0.8);
}

function randomWeights2() {
  return Array.from({ length: 3 }, () => (Math.random() - 0.5) * 0.8);
}

export default function NeuralNetPage() {
  const [points, setPoints] = useState<NNPoint[]>(() => randomPoints());
  const [weights1, setWeights1] = useState<number[]>(randomWeights());
  const [weights2, setWeights2] = useState<number[]>(randomWeights2());
  const [lr, setLr] = useState(0.05);
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<NNState> | null>(null);

  const savedState = useSavedVisualization<SavedNN>({
    expectedRoute: "/visualizer/ml/neural-network",
    applyState: (saved) => {
      controllerRef.current?.pause();
      controllerRef.current?.reset();
      setPoints(saved.points ?? randomPoints());
      setWeights1(saved.weights1 ?? randomWeights());
      setWeights2(saved.weights2 ?? randomWeights2());
      setLr(saved.lr ?? 0.05);
      setSpeed(saved.speed ?? 500);
      setStepIdx(0);
      setProgress(0);
      setIsPlaying(false);
    },
  });

  const states = useMemo(() => {
    const steps: NNState[] = [];
    let w1 = [...weights1];
    let w2 = [...weights2];
    const stepsCount = 40;
    for (let i = 0; i < stepsCount; i++) {
      steps.push({ points, weights1: [...w1], weights2: [...w2] });
      const updated = trainStep({ points, weights1: w1, weights2: w2 }, lr);
      w1 = updated.weights1;
      w2 = updated.weights2;
    }
    return steps;
  }, [points, weights1, weights2, lr]);

  useEffect(() => {
    if (!states.length) return;
    controllerRef.current = new StepController(states, () => {
      if (!controllerRef.current) return;
      setStepIdx(controllerRef.current.currentStepIndex);
      setProgress(
        controllerRef.current.currentStepIndex /
          controllerRef.current.steps.length
      );
    });
    controllerRef.current.setSpeed(speed);
    setTimeout(() => setIsPlaying(false), 0);
  }, [states, speed]);

  useEffect(() => {
    if (!controllerRef.current) return;
    setStepIdx(controllerRef.current.currentStepIndex);
  }, [states.length]);

  const togglePlay = () => {
    if (!controllerRef.current) return;
    if (isPlaying) controllerRef.current.pause();
    else controllerRef.current.play();
    setIsPlaying((v) => !v);
  };

  const current = states[stepIdx];
  const forwardPoints = current ? forward(current) : [];

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="graph" />

      <AlgorithmLayout
        title="Neural Network (2-layer)"
        description="A tiny two-layer net classifying 2D points. See activations and how training shifts the decision boundary."
        time="O(T · n)"
        space="O(n)"
        category="Machine Learning"
        difficulty="Medium"
        progressPercent={Math.round(progress * 100)}
        actions={
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <label className="text-white/70">Learning rate:</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="0.3"
                value={lr}
                onChange={(e) =>
                  setLr(Math.min(0.3, Math.max(0.01, Number(e.target.value))))
                }
                className="w-24 rounded-md border border-white/15 bg-white/[0.06] px-2 py-1 text-white"
              />
              <button
                type="button"
                onClick={() => {
                  setPoints(randomPoints());
                  setWeights1(randomWeights());
                  setWeights2(randomWeights2());
                }}
                className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
              >
                Randomize data & weights
              </button>
              <button
                type="button"
                onClick={() => setPoints([])}
                className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
              >
                Clear points
              </button>
            </div>
            <SaveVisualizationButton
              title="Neural Net"
              algorithmSlug="neural-network"
              route="/visualizer/ml/neural-network"
              disabled={!points.length}
              getPayload={() => ({
                points,
                weights1,
                weights2,
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
          <ScatterCanvas
            points={forwardPoints.map((p) => ({ x: p.x, y: p.y, label: p.label, cluster: p.prob > 0.5 ? 1 : 0 }))}
            centroids={[]}
            width={WIDTH}
            height={HEIGHT}
            onClick={(p) =>
              setPoints((prev) => [
                ...prev,
                { x: p.x, y: p.y, label: Math.random() > 0.5 ? 1 : 0 },
              ])
            }
          />
          <div className="mt-2 text-xs text-white/60">
            Click to add points. Labels are random on add; tweak LR and play training steps.
          </div>
        </div>

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={`Step ${stepIdx} • Points ${points.length}`}
          onReset={() => {
            controllerRef.current?.reset();
            setStepIdx(0);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setPoints(randomPoints());
            setWeights1(randomWeights());
            setWeights2(randomWeights2());
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
