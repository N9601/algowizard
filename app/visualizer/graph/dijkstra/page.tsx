"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateDijkstraSteps } from "../../../../src/lib/engine/algorithms/dijkstra";
import { generateWeightedGraph } from "../../../../src/lib/engine/graph/weightedGraphGenerator";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Controls from "../../../../components/visualizer/Controls";
import ColorLegend from "../../../../components/visualizer/ColorLegend";
import PriorityQueue from "../../../../components/visualizer/PriorityQueue";

export default function DijkstraPage() {
  const [graph, setGraph] = useState(() => generateWeightedGraph());
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  useEffect(() => {
    const steps = generateDijkstraSteps(
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

  return (
    <>
      <Navbar />
      <AlgorithmLayout
        title="Dijkstra’s Algorithm"
        description="Shortest paths from a source node in a weighted graph."
        time="O(V²)"
        space="O(V)"
        category="Graph"
        difficulty="Hard"
      >
        <div className="flex gap-6">
          <GraphCanvas nodes={graph.nodes} edges={graph.edges} {...step} />
          <PriorityQueue queue={step?.priorityQueue ?? []} />
        </div>

        <ColorLegend />

        <Controls
          onPlay={() => {
            isPlaying
              ? controllerRef.current?.pause()
              : controllerRef.current?.play();
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
