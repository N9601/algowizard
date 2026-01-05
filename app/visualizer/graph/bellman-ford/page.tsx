"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateBellmanFordSteps } from "../../../../src/lib/engine/algorithms/bellmanFord";
import { generateWeightedGraph } from "../../../../src/lib/engine/graph/weightedGraphGenerator";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

export default function BellmanFordPage() {
  const [graph, setGraph] = useState<any>(null);
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  useEffect(() => {
    setGraph(generateWeightedGraph());
  }, []);

  useEffect(() => {
    if (!graph) return;

    const steps = generateBellmanFordSteps(
      graph.adjacencyList,
      graph.start
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
  }, [graph, speed]);

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
        title="Bellman–Ford Algorithm"
        description="Shortest paths with negative edge support."
        time="O(VE)"
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
            distances={step?.distances}
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
            controllerRef.current?.pause();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
            setGraph(generateWeightedGraph());
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