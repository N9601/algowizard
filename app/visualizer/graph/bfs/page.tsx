/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateBFSSteps } from "../../../../src/lib/engine/algorithms/bfs";
import { generateTree } from "../../../../src/lib/engine/graph/treeGenerator";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

export default function BFSPage() {
  const [graph, setGraph] = useState<ReturnType<typeof generateTree> | null>(
    null
  );
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  // client-only graph generation
  useEffect(() => {
    setGraph(generateTree());
  }, []);

  useEffect(() => {
    if (!graph) return;

    const steps = generateBFSSteps(graph.adjacencyList, 0);

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

  if (!graph) return null;

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="graph" />

      <AlgorithmLayout
        title="Breadth-First Search"
        description="BFS explores all neighboring nodes at the current depth before moving deeper."
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
          onStep={() => controllerRef.current?.stepForward()}
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

        <Pseudocode algorithm="bfs" />
      </AlgorithmLayout>
    </>
  );
}