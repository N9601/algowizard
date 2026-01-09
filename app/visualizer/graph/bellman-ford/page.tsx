"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateBellmanFordSteps } from "../../../../src/lib/engine/algorithms/bellmanFord";
import { generateWeightedGraph } from "../../../../src/lib/engine/graph/weightedGraphGenerator";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Controls from "../../../../components/visualizer/Controls";
import ColorLegend from "../../../../components/visualizer/ColorLegend";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

export default function BellmanFordPage() {
  const [graph, setGraph] = useState(() => generateWeightedGraph());
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  useEffect(() => {
    // Clean up old controller
    if (controllerRef.current) {
      controllerRef.current.pause();
    }

    const steps = generateBellmanFordSteps(
      graph.edges,
      graph.nodes.map(n => n.id),
      graph.start
    );

    controllerRef.current = new StepController(steps, s => {
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

  const handleNew = () => {
    // Stop current playback
    if (controllerRef.current) {
      controllerRef.current.pause();
    }

    // Generate new graph
    const newGraph = generateWeightedGraph();

    // Generate new steps
    const steps = generateBellmanFordSteps(
      newGraph.edges,
      newGraph.nodes.map(n => n.id),
      newGraph.start
    );

    // Create NEW controller
    controllerRef.current = new StepController(steps, s => {
      setStep(s);
      setProgress(
        controllerRef.current!.currentStepIndex /
          controllerRef.current!.steps.length
      );
    });

    controllerRef.current.setSpeed(speed);

    // Update graph state (triggers useEffect)
    setGraph(newGraph);
    setStep(null);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="graph" />

      <AlgorithmLayout
        title="Bellman–Ford Algorithm"
        description="Finds shortest paths and detects negative cycles."
        time="O(V·E)"
        space="O(V)"
        category="Graph"
        difficulty="Hard"
      >
        <GraphCanvas
          nodes={graph.nodes}
          edges={graph.edges}
          activeNode={step?.activeNode}
          visited={step?.visited}
          distances={step?.distances}
          negativeCycleNodes={step?.negativeCycleNodes}
        />

        <ColorLegend />

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
          onNew={handleNew}
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