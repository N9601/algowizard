"use client";

import { useEffect, useRef, useState } from "react";
import { generateLinearSearchSteps } from "../../../../src/lib/engine/algorithms/linearSearch";
import { StepController } from "../../../../src/lib/engine/controller";
import { SearchStep } from "../../../../src/lib/engine/types";

import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import ArrayBars from "../../../../components/visualizer/ArrayBars";
import Controls from "../../../../components/visualizer/Controls";
import Navbar from "../../../../components/visualizer/Navbar";
import Pseudocode from "../../../../components/visualizer/Pseudocode";
import UserArrayInput from "../../../../components/visualizer/UserArrayInput";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { describeSearchStep } from "src/lib/education/stepNarration";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";
function randomArray(size = 15) {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 100) + 1
  );
}

type SavedLinearSearchState = {
  array: number[];
  target: number;
  speed: number;
};

export default function LinearSearchPage() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [step, setStep] = useState<SearchStep | null>(null);
  const [speed, setSpeed] = useState(500);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<SearchStep> | null>(null);
  const initializedRef = useRef(false);

  const savedState = useSavedVisualization<SavedLinearSearchState>({
    expectedRoute: "/visualizer/searching/linear-search",
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

    const arr = randomArray();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArray(arr);
    setTarget(arr[Math.floor(Math.random() * arr.length)]);
  }, []);

  useEffect(() => {
    if (!array.length) return;

    const steps = generateLinearSearchSteps(array, target);

    controllerRef.current = new StepController(steps, (s) => {
      setStep(s);
      setProgress(
        controllerRef.current!.currentStepIndex /
          controllerRef.current!.steps.length
      );
    });

    return () => controllerRef.current?.pause();
  }, [array, target]);

  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setSpeed(speed);
  }, [speed]);

  const applyCustomArray = (values: number[]) => {
    controllerRef.current?.pause();
    controllerRef.current?.reset();
    setStep(null);
    setProgress(0);
    setIsPlaying(false);
    setArray(values);
    setTarget(values[Math.floor(values.length / 2)] ?? 0);
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
        title="Linear Search"
        description="Linear Search checks each element sequentially until the target is found or the list ends."
        time="O(n)"
        space="O(1)"
        category="Searching"
        difficulty="Easy"
        progressPercent={Math.round(progress * 100)}
        actions={
          <div className="space-y-3">
            <SaveVisualizationButton
              title="Linear Search State"
              algorithmSlug="linear-search"
              route="/visualizer/searching/linear-search"
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
            title="Custom array"
            helper="Enter comma-separated numbers (3–30 values)."
            defaultValues={array}
            includeTarget
            target={target}
            onTargetChange={setTarget}
            onApply={applyCustomArray}
            onRandom={() => {
              controllerRef.current?.reset();
              const arr = randomArray();
              setStep(null);
              setProgress(0);
              setIsPlaying(false);
              setArray(arr);
              setTarget(arr[Math.floor(arr.length * 0.5)]);
            }}
          />
        </div>

        <ArrayBars
          array={step?.array ?? array}
          currentIndex={step?.currentIndex}
          foundIndex={step?.foundIndex}
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
          statusText={describeSearchStep("linear", step, array, target)}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            const arr = randomArray();
            setArray(arr);
            setTarget(arr[Math.floor(Math.random() * arr.length)]);
            setIsPlaying(false);
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />

        <Pseudocode algorithm="linear" />
      </AlgorithmLayout>
    </>
  );
}
