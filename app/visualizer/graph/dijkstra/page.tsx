"use client";

import { useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateDijkstraSteps } from "../../../../src/lib/engine/algorithms/dijkstra";
import { generateWeightedGraph } from "../../../../src/lib/engine/graph/weightedGraphGenerator";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

export default function DijkstraPage() {
  // ✅ generate graph ONCE on client
  const [graph, setGraph] = useState(generateWeightedGraph);
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  const buildController = (g = graph) => {
    const steps = generateDijkstraSteps(g.adjacencyList, g.start);
    controllerRef.current = new StepController(steps, (s) => {
      setStep(s);
      setProgress(
        controllerRef.current!.currentStepIndex /
          controllerRef.current!.steps.length
      );
    });
    controllerRef.current.setSpeed(speed);
  };

  const togglePlay = () => {
    if (!controllerRef.current) buildController();
    isPlaying
      ? controllerRef.current?.pause()
      : controllerRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="graph" />

      <AlgorithmLayout
        title="Dijkstra’s Algorithm"
        description="Shortest paths from a source node in a weighted graph."
        time="O(V²)"
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
            const g = generateWeightedGraph();
            setGraph(g);
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
            buildController(g);
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