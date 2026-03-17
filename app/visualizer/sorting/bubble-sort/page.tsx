"use client";

import { useEffect, useRef, useState } from "react";

import { generateBubbleSortSteps } from "../../../../src/lib/engine/algorithms/bubbleSort";
import { StepController } from "../../../../src/lib/engine/controller";
import { SortingStep } from "../../../../src/lib/engine/types";

import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import ArrayBars from "../../../../components/visualizer/ArrayBars";
import Controls from "../../../../components/visualizer/Controls";
import ColorLegend from "../../../../components/visualizer/ColorLegend";
import Pseudocode from "../../../../components/visualizer/Pseudocode";
import Navbar from "../../../../components/visualizer/Navbar";
import UserArrayInput from "../../../../components/visualizer/UserArrayInput";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { describeSortingStep } from "src/lib/education/stepNarration";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";


function generateRandomArray(size = 15) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 100) + 1
  );
}

type SavedBubbleSortState = {
  array: number[];
  speed: number;
};

export default function BubbleSortPage() {
  const [array, setArray] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<SortingStep | null>(null);
  const [speed, setSpeed] = useState(500);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<SortingStep> | null>(null);
  const initializedRef = useRef(false);

  const savedState = useSavedVisualization<SavedBubbleSortState>({
    expectedRoute: "/visualizer/sorting/bubble-sort",
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

  // Client-only array init (SSR safe)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArray(generateRandomArray());
  }, []);

  // Create controller when array changes
  useEffect(() => {
    if (array.length === 0) return;

    const steps = generateBubbleSortSteps(array);

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

  // Keep speed synced
  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setSpeed(speed);
  }, [speed]);

  const applyCustomArray = (values: number[]) => {
    controllerRef.current?.pause();
    controllerRef.current?.reset();
    setCurrentStep(null);
    setProgress(0);
    setIsPlaying(false);
    setArray(values);
  };

  // Play / Pause toggle
  const handlePlayPause = () => {
    if (!controllerRef.current) return;

    if (isPlaying) {
      controllerRef.current.pause();
      setIsPlaying(false);
    } else {
      controllerRef.current.setSpeed(speed);
      controllerRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
     <Navbar />
      <AlgorithmBackground variant="sorting" />

      <AlgorithmLayout
        title="Bubble Sort"
        description="A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. With a time complexity of O(n²), it's inefficient for large datasets but easy to implement and understand. The algorithm gets its name because smaller elements bubble to the top of the list with each iteration."
        time="O(n²)"
        space="O(1)"
        category="Sorting"
        difficulty="Easy"
        progressPercent={Math.round(progress * 100)}
        actions={
          <div className="space-y-3">
            <SaveVisualizationButton
              title="Bubble Sort State"
              algorithmSlug="bubble-sort"
              route="/visualizer/sorting/bubble-sort"
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
        <div className="mb-4">
          <UserArrayInput
            title="Custom array"
            helper="Enter comma-separated numbers (3–30 values)."
            defaultValues={array}
            onApply={applyCustomArray}
            onRandom={() => {
              controllerRef.current?.reset();
              setCurrentStep(null);
              setProgress(0);
              setIsPlaying(false);
              setArray(generateRandomArray());
            }}
          />
        </div>

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
          statusText={describeSortingStep("bubble", currentStep, array)}
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

          <Pseudocode algorithm="bubble" />

        </div>
      </AlgorithmLayout>
    </>
  );
}
