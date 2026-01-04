"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateTopoSteps } from "../../../../src/lib/engine/algorithms/topologicalSort";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

/* DAG */
const nodes = [
  { id: 0, x: 250, y: 50 },
  { id: 1, x: 125, y: 130 },
  { id: 2, x: 250, y: 130 },
  { id: 3, x: 375, y: 130 },
  { id: 4, x: 250, y: 210 },
];

const edges = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
];

const adjacencyList = {
  0: [1, 2],
  1: [3],
  2: [3],
  3: [4],
  4: [],
};

export default function TopologicalSortPage() {
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  useEffect(() => {
    const steps = generateTopoSteps(adjacencyList);

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
    isPlaying
      ? controllerRef.current.pause()
      : controllerRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="graph" />

      <AlgorithmLayout
        title="Topological Sort"
        description="Orders vertices of a DAG such that for every directed edge u → v, u comes before v."
        time="O(V + E)"
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
          onNew={() => controllerRef.current?.reset()}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />

        <Pseudocode algorithm="topological" />
      </AlgorithmLayout>
    </>
  );
}