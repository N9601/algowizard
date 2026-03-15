"use client";

import { useEffect, useRef, useState } from "react";

import { generateSelectionSortSteps } from "../../../../src/lib/engine/algorithms/selectionSort";
import { StepController } from "../../../../src/lib/engine/controller";
import { SortingStep } from "../../../../src/lib/engine/types";

import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import ArrayBars from "../../../../components/visualizer/ArrayBars";
import Controls from "../../../../components/visualizer/Controls";
import ColorLegend from "../../../../components/visualizer/ColorLegend";
import Pseudocode from "../../../../components/visualizer/Pseudocode";
import Navbar from "../../../../components/visualizer/Navbar";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { describeSortingStep } from "src/lib/education/stepNarration";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

function generateRandomArray(size = 15) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 100) + 1
  );
}

type SavedSelectionSortState = {
  array: number[];
  speed: number;
};

export default function SelectionSortPage() {
  const [array, setArray] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<SortingStep | null>(null);
  const [speed, setSpeed] = useState(500);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<SortingStep> | null>(null);
  const initializedRef = useRef(false);

  const savedState = useSavedVisualization<SavedSelectionSortState>({
    expectedRoute: "/visualizer/sorting/selection-sort",
    applyState: (saved) => {
      if (!saved.array?.length) return;
      controllerRef.current?.pause();
      controllerRef.current?.reset();
      setArray(saved.array);
      setSpeed(saved.speed ?? 500);
      setCurrentStep(null);
      setProgress(0);
      setIsPlaying(false);
    },
  });

  // Initialize array (client-only)
  useEffect(() => {
  if (initializedRef.current) return;
  initializedRef.current = true;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  setArray(generateRandomArray());
}, []);


  // Create controller when array changes
  useEffect(() => {
  if (array.length === 0) return;

  const steps = generateSelectionSortSteps(array);

  controllerRef.current = new StepController(steps, (step) => {
    setCurrentStep(step);

    if (!controllerRef.current) return;

    setProgress(
      controllerRef.current.currentStepIndex /
        controllerRef.current.steps.length
    );
  });

  return () => controllerRef.current?.pause();
}, [array]);


  // Sync speed
  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setSpeed(speed);
  }, [speed]);

  const handlePlayPause = () => {
    if (!controllerRef.current) return;

    if (isPlaying) {
      controllerRef.current.pause();
      setIsPlaying(false);
    } else {
      controllerRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="sorting" />

      <AlgorithmLayout
        title="Selection Sort"
        description="Selection Sort is a simple comparison-based sorting algorithm that works by repeatedly selecting the smallest element from the unsorted portion of the array and moving it to the beginning. Unlike Bubble Sort, it performs only O(n) swaps, making it useful when write operations are expensive. However, its O(n²) time complexity makes it inefficient for large datasets. Selection Sort is not stable, meaning equal elements may not preserve their original relative order."
        time="O(n²)"
        space="O(1)"
        category="Sorting"
        difficulty="Easy"
        actions={
          <div className="space-y-3">
            <SaveVisualizationButton
              title="Selection Sort State"
              algorithmSlug="selection-sort"
              route="/visualizer/sorting/selection-sort"
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
          array={currentStep?.array ?? array}
          comparing={currentStep?.comparing}
          swapping={currentStep?.swapping}
          sortedIndices={currentStep?.sortedIndices}
        />

        <Controls
          onPlay={handlePlayPause}
            onStepForward={() => controllerRef.current?.stepForward()}
  onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={describeSortingStep("selection", currentStep, array)}
          onReset={() => {
            controllerRef.current?.reset();
            setCurrentStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setCurrentStep(null);
            setProgress(0);
            setIsPlaying(false);
            setArray(generateRandomArray());
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />

        <div className="mt-6 space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-md">
            <ColorLegend />
          </div>

          <Pseudocode algorithm="selection" />

        </div>
      </AlgorithmLayout>
    </>
  );
}
