/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateDFSSteps } from "../../../../src/lib/engine/algorithms/dfs";
import { generateTree } from "../../../../src/lib/engine/graph/treeGenerator";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

export default function DFSPage() {
  const [graph, setGraph] = useState<ReturnType<typeof generateTree> | null>(
    null
  );
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  // 🔹 Generate tree ONLY on client (fixes hydration)
  useEffect(() => {
    setGraph(generateTree());
  }, []);

  // 🔹 Rebuild DFS steps when graph or speed changes
  useEffect(() => {
    if (!graph) return;

    const steps = generateDFSSteps(graph.adjacencyList, 0);

    controllerRef.current = new StepController(steps, (s) => {
      setStep(s);
      setProgress(
        controllerRef.current!.currentStepIndex /
          controllerRef.current!.steps.length
      );
    });

    controllerRef.current.setSpeed(speed);

    return () => controllerRef.current?.pause();
  }, [graph, speed]);

  const togglePlay = () => {
  if (!controllerRef.current) return;

  if (isPlaying) {
    controllerRef.current.pause();
  } else {
    controllerRef.current.play();
  }

  setIsPlaying(!isPlaying);
};

  if (!graph) return null; // prevents SSR mismatch

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
          nodes={graph.nodes}
          edges={graph.edges}
          activeNode={step?.activeNode}
          visited={step?.visited}
        />

        <Controls
          onPlay={togglePlay}
            onStepForward={() => controllerRef.current?.stepForward()}
  onStepBack={() => controllerRef.current?.stepBackward()}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setGraph(generateTree());
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
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