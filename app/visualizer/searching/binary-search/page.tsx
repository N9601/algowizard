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

function randomSortedArray(size = 15) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 100) + 1
  ).sort((a, b) => a - b);
}

export default function BinarySearchPage() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [step, setStep] = useState<SearchStep | null>(null);
  const [speed, setSpeed] = useState(500);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<SearchStep> | null>(null);
  const initializedRef = useRef(false);

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

    controllerRef.current.setSpeed(speed);
    return () => controllerRef.current?.pause();
  }, [array, target, speed]);

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
      >
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm font-medium">Target:</span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-24 rounded-md border px-2 py-1"
          />
        </div>

        <ArrayBars
          array={step?.array ?? array}
          currentIndex={step?.currentIndex}
          foundIndex={step?.foundIndex}
          low={step?.low}
          high={step?.high}
          notFound={step?.notFound}
        />

        {step?.notFound && (
          <div className="mt-4 text-center text-red-400 font-semibold">
            Target not found in array
          </div>
        )}

        <Controls
          onPlay={togglePlay}
          onStep={() => controllerRef.current?.stepForward()}
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