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
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { describeGraphStep } from "src/lib/education/stepNarration";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

type GraphData = {
  nodes: { id: number; x: number; y: number }[];
  edges: { from: number; to: number }[];
  adjacencyList: Record<number, number[]>;
};

type SavedTopologicalState = {
  graph: GraphData;
  speed: number;
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

  const savedState = useSavedVisualization<SavedTopologicalState>({
    expectedRoute: "/visualizer/graph/topological",
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

    return () => controllerRef.current?.pause();
  }, [graph]);

  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setSpeed(speed);
  }, [speed]);

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
        progressPercent={Math.round(progress * 100)}
        actions={
          <div className="space-y-3">
            <SaveVisualizationButton
              title="Topological Sort State"
              algorithmSlug="topological-sort"
              route="/visualizer/graph/topological"
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
            onStepForward={() => controllerRef.current?.stepForward()}
  onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={describeGraphStep("topological", step)}
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
