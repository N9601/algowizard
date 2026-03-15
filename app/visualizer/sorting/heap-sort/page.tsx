"use client";

import { useEffect, useRef, useState } from "react";
import { generateHeapSortSteps } from "../../../../src/lib/engine/algorithms/heapSort";
import { StepController } from "../../../../src/lib/engine/controller";
import { SortingStep } from "../../../../src/lib/engine/types";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import ArrayBars from "../../../../components/visualizer/ArrayBars";
import Controls from "../../../../components/visualizer/Controls";
import ColorLegend from "../../../../components/visualizer/ColorLegend";
import Pseudocode from "../../../../components/visualizer/Pseudocode";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { describeSortingStep } from "src/lib/education/stepNarration";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

function randomArray(size = 15) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

type SavedHeapSortState = {
  array: number[];
  speed: number;
};

export default function HeapSortPage() {
  const [array, setArray] = useState<number[]>([]);
  const [step, setStep] = useState<SortingStep | null>(null);
  const [speed, setSpeed] = useState(500);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controller = useRef<StepController<SortingStep> | null>(null);
  const init = useRef(false);

  const savedState = useSavedVisualization<SavedHeapSortState>({
    expectedRoute: "/visualizer/sorting/heap-sort",
    applyState: (saved) => {
      if (!saved.array?.length) return;
      controller.current?.pause();
      controller.current?.reset();
      setArray(saved.array);
      setSpeed(saved.speed ?? 500);
      setStep(null);
      setProgress(0);
      setIsPlaying(false);
    },
  });

  useEffect(() => {
    if (init.current) return;
    init.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArray(randomArray());
  }, []);

  useEffect(() => {
    if (!array.length) return;

    const steps = generateHeapSortSteps(array);
    controller.current = new StepController(steps, (s) => {
      setStep(s);
      setProgress(
        controller.current!.currentStepIndex / controller.current!.steps.length
      );
    });

    return () => controller.current?.pause();
  }, [array]);

  useEffect(() => {
    if (!controller.current) return;
    controller.current.setSpeed(speed);
  }, [speed]);

  const togglePlay = () => {
    if (!controller.current) return;
    if (isPlaying) controller.current.pause();
    else controller.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="sorting" />

      <AlgorithmLayout
        title="Heap Sort"
        description="Heap Sort uses a binary heap to repeatedly extract the maximum element and place it at the end of the array. It guarantees O(n log n) time complexity and sorts in place."
        time="O(n log n)"
        space="O(1)"
        category="Sorting"
        difficulty="Medium"
        progressPercent={Math.round(progress * 100)}
        actions={
          <div className="space-y-3">
            <SaveVisualizationButton
              title="Heap Sort State"
              algorithmSlug="heap-sort"
              route="/visualizer/sorting/heap-sort"
              disabled={array.length === 0}
              getPayload={() => ({
                array,
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
        <ArrayBars
          array={step?.array ?? array}
          comparing={step?.comparing}
          swapping={step?.swapping}
          sortedIndices={step?.sortedIndices}
        />

        <Controls
          onPlay={togglePlay}
            onStepForward={() => controller.current?.stepForward()}
  onStepBack={() => controller.current?.stepBackward()}
          statusText={describeSortingStep("heap", step, array)}
          onReset={() => {
            controller.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controller.current?.reset();
            setIsPlaying(false);
            setArray(randomArray());
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />

        <ColorLegend />
        <Pseudocode algorithm="heap" />
      </AlgorithmLayout>
    </>
  );
}
