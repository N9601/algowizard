/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { generateLinearSearchSteps } from "../../../../src/lib/engine/algorithms/linearSearch";
import { StepController } from "../../../../src/lib/engine/controller";
import { SearchStep } from "../../../../src/lib/engine/types";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import ArrayBars from "../../../../components/visualizer/ArrayBars";
import Controls from "../../../../components/visualizer/Controls";
import Pseudocode from "../../../../components/visualizer/Pseudocode";

/* ======================
   Helpers
====================== */
function randomArray(size = 15) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 100) + 1
  );
}

export default function LinearSearchPage() {
  const [mounted, setMounted] = useState(false);
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [step, setStep] = useState<SearchStep | null>(null);
  const [speed, setSpeed] = useState(500);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<SearchStep> | null>(null);
  const initializedRef = useRef(false);

  /* ======================
     Hydration guard
  ====================== */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ======================
     Init after mount
  ====================== */
  useEffect(() => {
    if (!mounted || initializedRef.current) return;
    initializedRef.current = true;

    const arr = randomArray();
    setArray(arr);
    setTarget(arr[Math.floor(Math.random() * arr.length)]);
  }, [mounted]);

  /* ======================
     Controller
  ====================== */
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

    controllerRef.current.setSpeed(speed);
    return () => controllerRef.current?.pause();
  }, [array, target, speed]);

  /* ======================
     Play / Pause
  ====================== */
  const togglePlay = () => {
    if (!controllerRef.current) return;

    if (isPlaying) controllerRef.current.pause();
    else controllerRef.current.play();

    setIsPlaying((p) => !p);
  };

  if (!mounted) return null;

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
      >
        {/* Target */}
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm font-medium">Target:</span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-24 rounded-md border px-2 py-1 bg-transparent"
          />
        </div>

        {/* Bars */}
        <ArrayBars
          array={step?.array ?? array}
          currentIndex={step?.currentIndex}
          foundIndex={step?.foundIndex}
          
        />

        {/* Not found message */}
        {step?.notFound && (
          <div className="mt-4 text-center text-red-400 font-semibold">
            Target not found in array
          </div>
        )}

        {/* Controls */}
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