"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateTopoSteps } from "../../../../src/lib/engine/algorithms/topologicalSort";
import { generateRandomDAG } from "../../../../src/lib/engine/graph/dagGenerator";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

type GraphData = {
  nodes: { id: number; x: number; y: number }[];
  edges: { from: number; to: number }[];
  adjacencyList: Record<number, number[]>;
};

export default function TopologicalSortPage() {
  /* ---------------------------------------------
     GRAPH STATE (CLIENT-SAFE)
  --------------------------------------------- */
  const [graph, setGraph] = useState<GraphData | null>(null);

  /* ---------------------------------------------
     ALGORITHM STATE
  --------------------------------------------- */
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  /* ---------------------------------------------
     INITIAL GRAPH (NO ESLINT VIOLATION)
     ✔ happens only on client
     ✔ no setState-in-effect warning
  --------------------------------------------- */
  if (graph === null) {
    const g = generateRandomDAG();
    setGraph(g);
  }

  /* ---------------------------------------------
     BUILD STEPS + CONTROLLER
  --------------------------------------------- */
  useEffect(() => {
    if (!graph) return;

    const steps = generateTopoSteps(graph.adjacencyList);

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

  /* ---------------------------------------------
     CONTROLS
  --------------------------------------------- */
  const togglePlay = () => {
    if (!controllerRef.current) return;

    if (isPlaying) {
      controllerRef.current.pause();
    } else {
      controllerRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
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
        {graph && (
          <GraphCanvas
            nodes={graph.nodes}
            edges={graph.edges}
            activeNode={step?.activeNode}
            visited={step?.visited}
          />
        )}

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
            setGraph(generateRandomDAG());
          }}
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