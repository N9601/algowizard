"use client";

import { useEffect, useRef, useState } from "react";

import { GraphStep } from "../../../../src/lib/engine/types";
import { StepController } from "../../../../src/lib/engine/controller";
import { generateBellmanFordSteps } from "../../../../src/lib/engine/algorithms/bellmanFord";
import { generateWeightedGraph } from "../../../../src/lib/engine/graph/weightedGraphGenerator";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Controls from "../../../../components/visualizer/Controls";
import ColorLegend from "../../../../components/visualizer/ColorLegend";

export default function BellmanFordPage() {
  const [graph, setGraph] = useState(() => generateWeightedGraph());
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  useEffect(() => {
    const steps = generateBellmanFordSteps(
      graph.edges,
      graph.nodes.map((n) => n.id),
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

  return (
    <>
      <Navbar />

      <AlgorithmLayout
        title="Bellman–Ford Algorithm"
        description="Shortest paths with negative edge support"
        time="O(VE)"
        space="O(V)"
        category="Graph"
        difficulty="Hard"
      >
        <GraphCanvas
          nodes={graph.nodes}
          edges={graph.edges}
          {...step}
        />

        <ColorLegend />

        <Controls
          onPlay={() => {
            if (!controllerRef.current) return;
            isPlaying
              ? controllerRef.current.pause()
              : controllerRef.current.play();
            setIsPlaying(!isPlaying);
          }}
          onStep={() => controllerRef.current?.stepForward()}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setGraph(generateWeightedGraph());
            setStep(null);
            setProgress(0);
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
