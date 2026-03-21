"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "components/visualizer/Navbar";
import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import ArrayBars from "components/visualizer/ArrayBars";
import Controls from "components/visualizer/Controls";
import { StepController } from "src/lib/engine/controller";
import { generateBinarySearchSteps } from "src/lib/engine/algorithms/binarySearch";
import { generateLinearSearchSteps } from "src/lib/engine/algorithms/linearSearch";
import { describeSearchStep } from "src/lib/education/stepNarration";
import type { SearchStep } from "src/lib/engine/types";

type Algo = "linear" | "binary";

const ALGO_OPTIONS: { id: Algo; label: string; detail: string }[] = [
  { id: "linear", label: "Linear Search", detail: "Checks each element in order." },
  { id: "binary", label: "Binary Search", detail: "Halves the search interval on sorted data." },
];

function generateArray(size = 15) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1).sort(
    (a, b) => a - b
  );
}

export default function CompareSearching() {
  const [array, setArray] = useState<number[]>(() => generateArray());
  const [target, setTarget] = useState<number>(() =>
    Math.floor(Math.random() * 100)
  );
  const [leftAlgo, setLeftAlgo] = useState<Algo>("linear");
  const [rightAlgo, setRightAlgo] = useState<Algo>("binary");
  const [leftStep, setLeftStep] = useState<SearchStep | null>(null);
  const [rightStep, setRightStep] = useState<SearchStep | null>(null);
  const [leftProgress, setLeftProgress] = useState(0);
  const [rightProgress, setRightProgress] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [isPlaying, setIsPlaying] = useState(false);

  const leftController = useRef<StepController<SearchStep> | null>(null);
  const rightController = useRef<StepController<SearchStep> | null>(null);

  const leftSteps = useMemo(
    () =>
      leftAlgo === "binary"
        ? generateBinarySearchSteps(array, target)
        : generateLinearSearchSteps(array, target),
    [array, target, leftAlgo]
  );
  const rightSteps = useMemo(
    () =>
      rightAlgo === "binary"
        ? generateBinarySearchSteps(array, target)
        : generateLinearSearchSteps(array, target),
    [array, target, rightAlgo]
  );

  useEffect(() => {
    leftController.current = new StepController(leftSteps, (s) => {
      setLeftStep(s);
      setLeftProgress(
        leftController.current
          ? leftController.current.currentStepIndex /
              Math.max(leftController.current.steps.length, 1)
          : 0
      );
    });
    leftController.current.setSpeed(speed);
    setTimeout(() => {
      setLeftStep(leftSteps[0] ?? null);
      setLeftProgress(0);
      setIsPlaying(false);
    }, 0);
  }, [leftSteps, speed]);

  useEffect(() => {
    rightController.current = new StepController(rightSteps, (s) => {
      setRightStep(s);
      setRightProgress(
        rightController.current
          ? rightController.current.currentStepIndex /
              Math.max(rightController.current.steps.length, 1)
          : 0
      );
    });
    rightController.current.setSpeed(speed);
    setTimeout(() => {
      setRightStep(rightSteps[0] ?? null);
      setRightProgress(0);
      setIsPlaying(false);
    }, 0);
  }, [rightSteps, speed]);

  const togglePlay = () => {
    if (!leftController.current || !rightController.current) return;
    if (isPlaying) {
      leftController.current.pause();
      rightController.current.pause();
      setIsPlaying(false);
    } else {
      leftController.current.play();
      rightController.current.play();
      setIsPlaying(true);
    }
  };

  const reset = () => {
    leftController.current?.reset();
    rightController.current?.reset();
    setLeftStep(leftController.current?.steps[0] ?? null);
    setRightStep(rightController.current?.steps[0] ?? null);
    setLeftProgress(0);
    setRightProgress(0);
    setIsPlaying(false);
  };

  const newArray = () => {
    const arr = generateArray();
    setArray(arr);
    setTarget(arr[Math.floor(Math.random() * arr.length)]);
    reset();
  };

  const overallProgress = (leftProgress + rightProgress) / 2;

  const leftMeta = ALGO_OPTIONS.find((o) => o.id === leftAlgo)!;
  const rightMeta = ALGO_OPTIONS.find((o) => o.id === rightAlgo)!;

  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <Navbar />
      <AlgorithmBackground variant="searching" />

      <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 py-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Compare Searching
              </p>
              <h1 className="mt-3 text-4xl font-bold text-white">
                Compare linear vs binary search on the same array.
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/62">
                See how scanning compares with halving intervals when the data is sorted.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <SelectCard
                label="Left algorithm"
                value={leftAlgo}
                options={ALGO_OPTIONS}
                onChange={(value) => {
                  setIsPlaying(false);
                  setLeftAlgo(value as Algo);
                }}
              />
              <SelectCard
                label="Right algorithm"
                value={rightAlgo}
                options={ALGO_OPTIONS}
                onChange={(value) => {
                  setIsPlaying(false);
                  setRightAlgo(value as Algo);
                }}
              />
            </div>
          </div>
        </section>

        <Controls
          onPlay={togglePlay}
          onStepForward={() => {
            leftController.current?.stepForward();
            rightController.current?.stepForward();
          }}
          onStepBack={() => {
            leftController.current?.stepBackward();
            rightController.current?.stepBackward();
          }}
          onReset={reset}
          onNew={newArray}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={overallProgress}
          isPlaying={isPlaying}
          statusText={`Array: ${array.join(", ")} • Target: ${target}`}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <SearchPanel
            title={leftMeta.label}
            detail={leftMeta.detail}
            array={leftStep?.array ?? array}
            step={leftStep}
            progress={leftProgress}
            target={target}
            narration={describeSearchStep(leftAlgo, leftStep, array, target)}
          />
          <SearchPanel
            title={rightMeta.label}
            detail={rightMeta.detail}
            array={rightStep?.array ?? array}
            step={rightStep}
            progress={rightProgress}
            target={target}
            narration={describeSearchStep(rightAlgo, rightStep, array, target)}
          />
        </div>
      </main>
    </div>
  );
}

function SelectCard({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {label}
      </div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id} className="bg-[#071019]">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SearchPanel({
  title,
  detail,
  array,
  step,
  progress,
  target,
  narration,
}: {
  title: string;
  detail: string;
  array: number[];
  step: SearchStep | null;
  progress: number;
  target: number;
  narration: string;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#07111b]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
            Searching panel
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/58">{detail}</p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/72">
          Target: {target}
        </div>
      </div>

      <div className="mt-6">
        <ArrayBars
          array={step?.array ?? array}
          currentIndex={step?.currentIndex}
          low={step?.low}
          high={step?.high}
          foundIndex={step?.foundIndex}
        />
      </div>

      <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
            Current step
          </div>
          <div className="text-sm text-white/50">{Math.round(progress * 100)}%</div>
        </div>
        <p className="mt-2 text-sm leading-6 text-white/74">{narration}</p>
      </div>
    </section>
  );
}
