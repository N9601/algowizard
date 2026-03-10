"use client";

import { useEffect, useRef, useState } from "react";

import { StepController } from "../../../../src/lib/engine/controller";
import {
  LinkedListStep,
  LinkedListOperation
} from "../../../../src/lib/engine/types";

import { generateLinkedListSteps } from "../../../../src/lib/engine/algorithms/linkedList";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";

export default function LinkedListPage() {

  const [step, setStep] = useState<LinkedListStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<LinkedListStep> | null>(null);

  useEffect(() => {

    const operations: LinkedListOperation[] = [
      { type: "insert", value: "10" },
      { type: "insert", value: "20" },
      { type: "insert", value: "30" },
      { type: "delete" },
      { type: "insert", value: "40" },
    ];

    const steps = generateLinkedListSteps([], operations);

    controllerRef.current = new StepController(steps, s => {
      setStep(s);
      setProgress(
        controllerRef.current!.currentStepIndex /
        controllerRef.current!.steps.length
      );
    });

    controllerRef.current.setSpeed(speed);

    return () => controllerRef.current?.pause();

  }, [speed]);

  const togglePlay = () => {

    if (!controllerRef.current) return;

    if (isPlaying)
      controllerRef.current.pause();
    else
      controllerRef.current.play();

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="datastructure" />

      <AlgorithmLayout
        title="Linked List"
        description="A sequence of nodes where each node points to the next node."
        time="O(n)"
        space="O(n)"
        category="Data Structure"
        difficulty="Medium"
      >

        {/* Linked List Visualization */}

        <div className="flex justify-center items-center gap-6 flex-wrap">

          {step?.list.length === 0 && (
            <div className="text-gray-400">
              Empty List
            </div>
          )}

          {step?.list.map((item, index) => (
            <div
              key={index}
              className="flex items-center"
            >
              <div className="px-6 py-3 bg-blue-500 rounded-xl font-semibold">
                {item}
              </div>

              {index !== step.list.length - 1 && (
                <div className="mx-4 text-blue-400 text-xl">
                  →
                </div>
              )}
            </div>
          ))}

        </div>

        {step?.message && (
          <div className="text-center mt-6 text-blue-400 font-semibold">
            {step.message}
          </div>
        )}

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {}}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />

      </AlgorithmLayout>
    </>
  );
}