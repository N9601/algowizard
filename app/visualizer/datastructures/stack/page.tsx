"use client";

import { useEffect, useRef, useState } from "react";
import { StepController } from "../../../../src/lib/engine/controller";
import {
  StackStep,
  StackOperation,
} from "../../../../src/lib/engine/types";
import { generateStackSteps } from "../../../../src/lib/engine/algorithms/stack";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import { describeStackStep } from "src/lib/education/stepNarration";

export default function StackPage() {
  const [step, setStep] = useState<StackStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<StackStep> | null>(null);

  const maxSize = 6;

  useEffect(() => {
    const operations: StackOperation[] = [
      { type: "push", value: "10" },
      { type: "push", value: "20" },
      { type: "push", value: "30" },
      { type: "pop" },
      { type: "push", value: "40" },
    ];

    const steps = generateStackSteps([], operations, maxSize);

    controllerRef.current = new StepController(steps, s => {
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
        title="Stack Data Structure"
        description="Implements LIFO (Last In First Out)."
        time="O(1)"
        space="O(n)"
        category="Data Structure"
        difficulty="Easy"
      >
        {/* Visualization */}
        <div className="flex justify-center">
          <div className="w-64 h-[420px] border-4 border-blue-500 rounded-3xl flex flex-col-reverse items-center p-4 bg-white/5 backdrop-blur-xl shadow-2xl">
            {step?.stack.length === 0 && (
              <div className="text-gray-400 mt-auto">
                Empty Stack
              </div>
            )}

            {step?.stack.map((item, index) => {
              const isTop = index === step.stack.length - 1;

              return (
                <div
                  key={index}
                  className={`w-full text-center py-3 mb-3 rounded-xl font-semibold transition-all duration-300 ${
                    isTop
                      ? "bg-blue-500 scale-105 shadow-lg"
                      : "bg-blue-400/70"
                  }`}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        {/* Operation Message */}
        {step?.message && (
          <div className="text-center mt-6 text-blue-400 font-semibold">
            {step.message}
          </div>
        )}

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={describeStackStep(step)}
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
