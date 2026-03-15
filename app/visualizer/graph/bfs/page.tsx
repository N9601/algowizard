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
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { describeGraphStep } from "src/lib/education/stepNarration";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

type SavedBfsState = {
  graph: ReturnType<typeof generateTree>;
  speed: number;
};

export default function BFSPage() {
  const [graph, setGraph] = useState<ReturnType<typeof generateTree> | null>(
    null
  );
  const [step, setStep] = useState<GraphStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<GraphStep> | null>(null);

  const savedState = useSavedVisualization<SavedBfsState>({
    expectedRoute: "/visualizer/graph/bfs",
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
        actions={
          <div className="space-y-3">
            <SaveVisualizationButton
              title="Breadth-First Search State"
              algorithmSlug="bfs"
              route="/visualizer/graph/bfs"
              disabled={!graph}
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
        />

        <Controls
          onPlay={togglePlay}
            onStepForward={() => controllerRef.current?.stepForward()}
  onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={describeGraphStep("bfs", step)}
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
