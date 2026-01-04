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


function generateRandomArray(size = 15) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 100) + 1
  );
}

export default function BubbleSortPage() {
  const [array, setArray] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<SortingStep | null>(null);
  const [speed, setSpeed] = useState(500);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<SortingStep> | null>(null);
  const initializedRef = useRef(false);

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

    controllerRef.current.setSpeed(speed);

    return () => controllerRef.current?.pause();
  }, [array, speed]);

  // Keep speed synced
  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setSpeed(speed);
  }, [speed]);

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
      >
        <ArrayBars
          array={currentStep?.array ?? array}
          comparing={currentStep?.comparing}
          swapping={currentStep?.swapping}
          sortedIndices={currentStep?.sortedIndices}
        />

        <Controls
          onPlay={handlePlayPause}
          onStep={() => controllerRef.current?.stepForward()}
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
