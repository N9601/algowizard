"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateBellmanFordSteps } from "../../../../src/lib/engine/algorithms/bellmanFord";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

/* ---------- STATIC GRAPH (NO HYDRATION ISSUES) ---------- */

const nodes = [
  { id: 0, x: 80, y: 80 },
  { id: 1, x: 200, y: 40 },
  { id: 2, x: 320, y: 80 },
  { id: 3, x: 140, y: 180 },
  { id: 4, x: 260, y: 180 },
];

const edges = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 2 },
  { from: 1, to: 2, weight: -1 },
  { from: 1, to: 3, weight: 2 },
  { from: 2, to: 4, weight: 3 },
  { from: 3, to: 4, weight: -2 },
];

export default function BellmanFordPage() {
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  useEffect(() => {
    const steps = generateBellmanFordSteps(
      nodes.map((n) => n.id),
      edges,
      0
    );

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
        title="Bellman–Ford Algorithm"
        description="Finds shortest paths from a source vertex to all vertices, even with negative weights."
        time="O(V × E)"
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

        <Pseudocode algorithm="bellman-ford" />
      </AlgorithmLayout>
    </>
  );
}