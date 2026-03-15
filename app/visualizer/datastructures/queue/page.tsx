"use client";

import { useEffect, useRef, useState } from "react";

import { StepController } from "../../../../src/lib/engine/controller";
import { QueueStep, QueueOperation } from "../../../../src/lib/engine/types";
import { generateQueueSteps } from "../../../../src/lib/engine/algorithms/queue";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import { describeQueueStep } from "src/lib/education/stepNarration";

export default function QueuePage() {
  const [step, setStep] = useState<QueueStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<QueueStep> | null>(null);

  const maxSize = 6;

  useEffect(() => {
    const operations: QueueOperation[] = [
      { type: "enqueue", value: "10" },
      { type: "enqueue", value: "20" },
      { type: "enqueue", value: "30" },
      { type: "dequeue" },
      { type: "enqueue", value: "40" },
    ];

    const steps = generateQueueSteps([], operations, maxSize);

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
        title="Queue Data Structure"
        description="Implements FIFO (First In First Out)."
        time="O(1)"
        space="O(n)"
        category="Data Structure"
        difficulty="Easy"
        progressPercent={Math.round(progress * 100)}
      >
        {/* Queue Visualization */}
        <div className="flex justify-center">
          <div className="flex gap-3 border-4 border-blue-500 rounded-2xl p-6 bg-white/5 backdrop-blur-xl shadow-2xl">

            {step?.queue.length === 0 && (
              <div className="text-gray-400">
                Empty Queue
              </div>
            )}

            {step?.queue.map((item, index) => {
              const isFront = index === 0;
              const isRear = index === step.queue.length - 1;

              return (
                <div
                  key={index}
                  className={`px-6 py-3 rounded-xl font-semibold
                  ${
                    isFront
                      ? "bg-green-500"
                      : isRear
                      ? "bg-blue-500"
                      : "bg-blue-400/70"
                  }`}
                >
                  {item}
                </div>
              );
            })}
          </div>
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
          statusText={describeQueueStep(step)}
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
