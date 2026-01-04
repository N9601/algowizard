"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateDijkstraSteps } from "../../../../src/lib/engine/algorithms/dijkstra";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

/* ---------- Static weighted graph (for now) ---------- */
const nodes = [
  { id: 0, x: 100, y: 80 },
  { id: 1, x: 250, y: 50 },
  { id: 2, x: 400, y: 80 },
  { id: 3, x: 200, y: 200 },
  { id: 4, x: 350, y: 200 },
];

const edges = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 0, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 2 },
];

const weightedGraph = {
  0: [{ to: 1, weight: 2 }, { to: 3, weight: 1 }],
  1: [{ to: 2, weight: 3 }],
  2: [],
  3: [{ to: 4, weight: 2 }],
  4: [{ to: 2, weight: 1 }],
};

export default function DijkstraPage() {
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  useEffect(() => {
    const steps = generateDijkstraSteps(weightedGraph, 0);

    controllerRef.current = new StepController(steps, (s) => {
      setStep(s);
      setProgress(
        controllerRef.current!.currentStepIndex /
          controllerRef.current!.steps.length
      );
    });

    controllerRef.current.setSpeed(speed);
    return () => controllerRef.current?.pause();
  }, [speed]);

 const togglePlay = () => {
    if (!controllerRef.current) return;

    if (isPlaying) {
      controllerRef.current.pause();
    } else {
      controllerRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="graph" />

      <AlgorithmLayout
        title="Dijkstra’s Algorithm"
        description="Finds the shortest paths from a source node to all other nodes in a weighted graph."
        time="O(V²)"
        space="O(V)"
        category="Graph"
        difficulty="Hard"
      >
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          activeNode={step?.activeNode}
          visited={step?.visited}
        />

        <Controls
          onPlay={togglePlay}
          onStep={() => controllerRef.current?.stepForward()}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />

        <Pseudocode algorithm="dijkstra" />
      </AlgorithmLayout>
    </>
  );
}
