/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateDFSSteps } from "../../../../src/lib/engine/algorithms/dfs";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

const nodes = [
  { id: 1, x: 80, y: 60 },
  { id: 2, x: 200, y: 40 },
  { id: 3, x: 320, y: 60 },
  { id: 4, x: 140, y: 160 },
  { id: 5, x: 260, y: 160 },
];

const edges = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 1, to: 4 },
  { from: 4, to: 5 },
];

const adjacencyList = {
  1: [2, 4],
  2: [3],
  3: [],
  4: [5],
  5: [],
};

export default function DFSPage() {
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  useEffect(() => {
    const steps = generateDFSSteps(adjacencyList, 1);

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
        title="Depth-First Search"
        description="DFS explores as far as possible along each branch before backtracking."
        time="O(V + E)"
        space="O(V)"
        category="Graph"
        difficulty="Medium"
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

        <Pseudocode algorithm="dfs" />
      </AlgorithmLayout>
    </>
  );
}
