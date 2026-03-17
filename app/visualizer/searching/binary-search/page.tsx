/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { generateBinarySearchSteps } from "../../../../src/lib/engine/algorithms/binarySearch";
import { StepController } from "../../../../src/lib/engine/controller";
import { SearchStep } from "../../../../src/lib/engine/types";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import ArrayBars from "../../../../components/visualizer/ArrayBars";
import Controls from "../../../../components/visualizer/Controls";
import Pseudocode from "../../../../components/visualizer/Pseudocode";
import UserArrayInput from "../../../../components/visualizer/UserArrayInput";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { describeSearchStep } from "src/lib/education/stepNarration";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

function randomSortedArray(size = 15) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 100) + 1
  ).sort((a, b) => a - b);
}

type SavedBinarySearchState = {
  array: number[];
  target: number;
  speed: number;
};

export default function BinarySearchPage() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [step, setStep] = useState<SearchStep | null>(null);
  const [speed, setSpeed] = useState(500);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<SearchStep> | null>(null);
  const initializedRef = useRef(false);

  const savedState = useSavedVisualization<SavedBinarySearchState>({
    expectedRoute: "/visualizer/searching/binary-search",
    applyState: (saved) => {
      if (!saved.array?.length) return;
      controllerRef.current?.pause();
      controllerRef.current?.reset();
      setArray(saved.array);
      setTarget(saved.target);
      setSpeed(saved.speed ?? 500);
      setStep(null);
      setProgress(0);
      setIsPlaying(false);
    },
  });

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const arr = randomSortedArray();
    setArray(arr);
    setTarget(arr[Math.floor(Math.random() * arr.length)]);
  }, []);

  useEffect(() => {
    if (!array.length) return;

    const steps = generateBinarySearchSteps(array, target);

    controllerRef.current = new StepController(steps, (s) => {
      setStep(s);
      setProgress(
        controllerRef.current!.currentStepIndex /
          controllerRef.current!.steps.length
      );

      if (s.done) {
        setIsPlaying(false);
      }
    });

    return () => controllerRef.current?.pause();
  }, [array, target]);

  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setSpeed(speed);
  }, [speed]);

  const applyCustomArray = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    controllerRef.current?.pause();
    controllerRef.current?.reset();
    setStep(null);
    setProgress(0);
    setIsPlaying(false);
    setArray(sorted);
    setTarget(sorted[Math.floor(sorted.length / 2)] ?? 0);
  };

  const togglePlay = () => {
    if (!controllerRef.current) return;

    if (isPlaying) controllerRef.current.pause();
    else controllerRef.current.play();

    setIsPlaying((p) => !p);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="searching" />

      <AlgorithmLayout
        title="Binary Search"
        description="Binary Search repeatedly divides the search interval in half to locate the target in a sorted array."
        time="O(log n)"
        space="O(1)"
        category="Searching"
        difficulty="Easy"
        progressPercent={Math.round(progress * 100)}
        actions={
          <div className="space-y-3">
            <SaveVisualizationButton
              title="Binary Search State"
              algorithmSlug="binary-search"
              route="/visualizer/searching/binary-search"
              disabled={array.length === 0}
              getPayload={() => ({
                array,
                target,
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
            title="Custom array (sorted)"
            helper="Enter comma-separated numbers (3–30 values). We will sort them for you."
            defaultValues={array}
            includeTarget
            target={target}
            onTargetChange={setTarget}
            onApply={applyCustomArray}
            onRandom={() => {
              controllerRef.current?.reset();
              const arr = randomSortedArray();
              setStep(null);
              setProgress(0);
              setIsPlaying(false);
              setArray(arr);
              setTarget(arr[Math.floor(arr.length / 2)]);
            }}
          />
        </div>

        <ArrayBars
          array={step?.array ?? array}
          currentIndex={step?.currentIndex}
          foundIndex={step?.foundIndex}
          low={step?.low}
          high={step?.high}
          
        />

        {step?.notFound && (
          <div className="mt-4 text-center text-red-400 font-semibold">
            Target not found in array
          </div>
        )}

        <Controls
          onPlay={togglePlay}
            onStepForward={() => controllerRef.current?.stepForward()}
  onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={describeSearchStep("binary", step, array, target)}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            const arr = randomSortedArray();
            setArray(arr);
            setTarget(arr[Math.floor(Math.random() * arr.length)]);
            setIsPlaying(false);
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />

        <Pseudocode algorithm="binary" />
      </AlgorithmLayout>
    </>
  );
}
