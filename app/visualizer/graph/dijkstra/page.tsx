"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import { GraphStep } from "../../../../src/lib/engine/types";
import { generateDijkstraSteps } from "../../../../src/lib/engine/algorithms/dijkstra";
import { generateWeightedGraph } from "../../../../src/lib/engine/graph/weightedGraphGenerator";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import Controls from "../../../../components/visualizer/Controls";
import Pseudocode from "../../../../components/visualizer/Pseudocode";
import ColorLegend from "../../../../components/visualizer/ColorLegend";

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

  const togglePlay = () => {
  if (!controllerRef.current) return;

  if (isPlaying) {
    controllerRef.current.pause();
  } else {
    controllerRef.current.play();
  }

  setIsPlaying(!isPlaying);
};

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="graph" />

      <AlgorithmLayout
        title="Dijkstra’s Algorithm"
        description="Finds shortest paths from a source node in a weighted graph."
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
          onNew={() => {
            const newGraph = generateWeightedGraph();

            const steps = generateDijkstraSteps(
              newGraph.adjacencyList,
              newGraph.start
            );

            controllerRef.current = new StepController(steps, (s) => {
              setStep(s);
              setProgress(
                controllerRef.current!.currentStepIndex /
                  controllerRef.current!.steps.length
              );
            });

            controllerRef.current.setSpeed(speed);

            setGraph(newGraph);
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />

        {/* ✅ THIS IS WHAT WAS MISSING */}
        <Pseudocode algorithm="dijkstra" />
      </AlgorithmLayout>
    </>
  );
}
