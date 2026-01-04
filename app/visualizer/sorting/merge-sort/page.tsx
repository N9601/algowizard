"use client";

import { useEffect, useRef, useState } from "react";
import { generateMergeSortSteps } from "../../../../src/lib/engine/algorithms/mergeSort";
import { StepController } from "../../../../src/lib/engine/controller";
import { SortingStep } from "../../../../src/lib/engine/types";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import ArrayBars from "../../../../components/visualizer/ArrayBars";
import Controls from "../../../../components/visualizer/Controls";
import ColorLegend from "../../../../components/visualizer/ColorLegend";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

function randomArray(size = 15) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

export default function MergeSortPage() {
  const [array, setArray] = useState<number[]>([]);
  const [step, setStep] = useState<SortingStep | null>(null);
  const [speed, setSpeed] = useState(500);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controller = useRef<StepController<SortingStep> | null>(null);
  const init = useRef(false);

  useEffect(() => {
    if (init.current) return;
    init.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArray(randomArray());
  }, []);

  useEffect(() => {
    if (!array.length) return;

    const steps = generateMergeSortSteps(array);
    controller.current = new StepController(steps, (s) => {
      setStep(s);
      setProgress(
        controller.current!.currentStepIndex / controller.current!.steps.length
      );
    });

    controller.current.setSpeed(speed);
    return () => controller.current?.pause();
  }, [array, speed]);

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
        title="Merge Sort"
        description="Merge Sort is a divide-and-conquer algorithm that splits the array into halves, recursively sorts them, and merges the results. It guarantees O(n log n) time complexity but requires additional memory."
        time="O(n log n)"
        space="O(n)"
        category="Sorting"
        difficulty="Medium"
      >
        <ArrayBars
  array={step?.array ?? array}
  comparing={step?.comparing}
  swapping={step?.swapping}
  sortedIndices={step?.sortedIndices}
  activeRange={step?.activeRange}
/>


        <Controls
          onPlay={togglePlay}
          onStep={() => controller.current?.stepForward()}
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
        <Pseudocode algorithm="merge" />
      </AlgorithmLayout>
    </>
  );
}
