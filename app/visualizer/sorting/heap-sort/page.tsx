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

function randomArray(size = 15) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

export default function HeapSortPage() {
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

    const steps = generateHeapSortSteps(array);
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
        title="Heap Sort"
        description="Heap Sort uses a binary heap to repeatedly extract the maximum element and place it at the end of the array. It guarantees O(n log n) time complexity and sorts in place."
        time="O(n log n)"
        space="O(1)"
        category="Sorting"
        difficulty="Medium"
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
