"use client";

import { useEffect, useRef, useState } from "react";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import { StepController } from "src/lib/engine/controller";
import { generateRecursionSteps } from "src/lib/engine/algorithms/recursion";
import { RecursionStep } from "src/lib/engine/types";
import { describeRecursionStep } from "src/lib/education/stepNarration";

export default function RecursionPage() {
  const [step, setStep] = useState<RecursionStep | null>(null);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(650);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<RecursionStep> | null>(null);

  const initialize = (depth = 5) => {
    const steps = generateRecursionSteps(depth);

    controllerRef.current = new StepController(steps, (newStep) => {
      setStep(newStep);
      setProgress(
        controllerRef.current!.currentStepIndex /
          controllerRef.current!.steps.length
      );
    });
  };

  useEffect(() => {
    initialize(5);
    return () => controllerRef.current?.pause();
  }, []);

  useEffect(() => {
    controllerRef.current?.setSpeed(speed);
  }, [speed]);

  const togglePlay = () => {
    if (!controllerRef.current) return;

    if (isPlaying) controllerRef.current.pause();
    else controllerRef.current.play();

    setIsPlaying(!isPlaying);
  };

  const regenerate = () => {
    const depth = Math.floor(Math.random() * 3) + 4; // 4–6
    initialize(depth);
    setStep(null);
    setProgress(0);
    setIsPlaying(false);
  };

  const stackEmpty = !step?.stack.length;

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="datastructure" />

      <AlgorithmLayout
        title="Recursion Call Stack"
        description="Trace how a factorial function grows the call stack and then unwinds it back to the base case."
        time="O(n)"
        space="O(n)"
        category="Data Structure"
        difficulty="Easy"
        progressPercent={Math.round(progress * 100)}
      >
        <div className="space-y-6">
          <div className="text-center text-sm text-white/70">
            Newest frame appears on the right. Each frame shows the active call
            or the value being returned.
          </div>

          <div className="flex flex-wrap items-end justify-center gap-3">
            {stackEmpty && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-white/60">
                Call stack is empty.
              </div>
            )}

            {step?.stack.map((frame, idx) => (
              <div
                key={`${frame.n}-${idx}-${frame.status}`}
                className="w-40 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 shadow-xl backdrop-blur"
              >
                <div className="text-xs uppercase tracking-[0.12em] text-white/40">
                  Frame {idx + 1}
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  f({frame.n})
                </div>
                <div className="mt-3 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sky-200">
                  {frame.status === "returning"
                    ? `Returning ${frame.result}`
                    : "Call in progress"}
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center font-mono text-sm text-blue-100">
            {step?.message ?? "Press play to watch the recursion unfold."}
          </div>
        </div>

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={describeRecursionStep(step)}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={regenerate}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />
      </AlgorithmLayout>
    </>
  );
}
