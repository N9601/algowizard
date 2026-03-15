"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";

import {
  generateHeapInsertSteps,
  HeapStep,
} from "../../../../src/lib/engine/algorithms/heapInsertSteps";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";
import { describeHeapInsertStep } from "src/lib/education/stepNarration";

const HEAP_VALUES = [7, 3, 10, 1, 5, 8, 12];
const HEAP_STEPS = generateHeapInsertSteps(HEAP_VALUES);

export default function HeapPage() {
  const [step, setStep] = useState<HeapStep | null>(HEAP_STEPS[0]);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<HeapStep> | null>(null);

  useEffect(() => {
    controllerRef.current = new StepController(HEAP_STEPS, (s) => {
      setStep(s);

      setProgress(
        controllerRef.current!.currentStepIndex /
          controllerRef.current!.steps.length
      );
    });

    return () => controllerRef.current?.pause();
  }, []);

  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setSpeed(speed);
  }, [speed]);

  const togglePlay = () => {
    if (!controllerRef.current) return;

    if (isPlaying) controllerRef.current.pause();
    else controllerRef.current.play();

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="datastructure" />

      <AlgorithmLayout
        title="Min Heap"
        description="A binary tree where the parent node is always smaller than its children."
        time="O(log n)"
        space="O(n)"
        category="Data Structure"
        difficulty="Medium"
      >
        <GraphCanvas
          nodes={step?.nodes ?? []}
          edges={step?.edges ?? []}
          activeNode={step?.activeNode}
        />

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={describeHeapInsertStep(step)}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(HEAP_STEPS[0]);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setStep(HEAP_STEPS[0]);
            setProgress(0);
            setIsPlaying(false);
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />
      </AlgorithmLayout>
    </>
  );
}
