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
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { describeGraphStep } from "src/lib/education/stepNarration";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

type SavedDijkstraState = {
  graph: ReturnType<typeof generateWeightedGraph>;
  speed: number;
};

export default function DijkstraPage() {
  const [graph, setGraph] = useState(() => generateWeightedGraph());
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  const savedState = useSavedVisualization<SavedDijkstraState>({
    expectedRoute: "/visualizer/graph/dijkstra",
    applyState: (saved) => {
      controllerRef.current?.pause();
      controllerRef.current?.reset();
      setGraph(saved.graph);
      setSpeed(saved.speed ?? 600);
      setStep(null);
      setProgress(0);
      setIsPlaying(false);
    },
  });

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

    return () => controllerRef.current?.pause();
  }, [graph]);

  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setSpeed(speed);
  }, [speed]);

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
        actions={
          <div className="space-y-3">
            <SaveVisualizationButton
              title="Dijkstra State"
              algorithmSlug="dijkstra"
              route="/visualizer/graph/dijkstra"
              getPayload={() => ({
                graph,
                speed,
              })}
            />
            {savedState.loadedTitle ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                Loaded saved state: {savedState.loadedTitle}
              </div>
            ) : null}
            {savedState.loadError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                {savedState.loadError}
              </div>
            ) : null}
          </div>
        }
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
          statusText={describeGraphStep("dijkstra", step)}
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
