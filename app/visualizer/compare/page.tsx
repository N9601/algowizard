"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import ArrayBars from "components/visualizer/ArrayBars";
import Controls from "components/visualizer/Controls";
import Navbar from "components/visualizer/Navbar";
import { StepController } from "src/lib/engine/controller";
import {
  describeSortingStep,
} from "src/lib/education/stepNarration";
import { generateBubbleSortSteps } from "src/lib/engine/algorithms/bubbleSort";
import { generateHeapSortSteps } from "src/lib/engine/algorithms/heapSort";
import { generateInsertionSortSteps } from "src/lib/engine/algorithms/insertionSort";
import { generateMergeSortSteps } from "src/lib/engine/algorithms/mergeSort";
import { generateQuickSortSteps } from "src/lib/engine/algorithms/quickSort";
import { generateSelectionSortSteps } from "src/lib/engine/algorithms/selectionSort";
import type { SortingStep } from "src/lib/engine/types";

type CompareAlgorithm =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "heap";

type AlgorithmConfig = {
  id: CompareAlgorithm;
  label: string;
  time: string;
  detail: string;
  createSteps: (input: number[]) => SortingStep[];
};

const SORTING_COMPARE_OPTIONS: AlgorithmConfig[] = [
  {
    id: "bubble",
    label: "Bubble Sort",
    time: "O(n^2)",
    detail: "Great for understanding adjacent swaps.",
    createSteps: generateBubbleSortSteps,
  },
  {
    id: "selection",
    label: "Selection Sort",
    time: "O(n^2)",
    detail: "Useful for studying minimum selection.",
    createSteps: generateSelectionSortSteps,
  },
  {
    id: "insertion",
    label: "Insertion Sort",
    time: "O(n^2)",
    detail: "Shows how partially sorted prefixes grow.",
    createSteps: generateInsertionSortSteps,
  },
  {
    id: "merge",
    label: "Merge Sort",
    time: "O(n log n)",
    detail: "Highlights divide-and-conquer merging.",
    createSteps: generateMergeSortSteps,
  },
  {
    id: "quick",
    label: "Quick Sort",
    time: "O(n log n)",
    detail: "Shows pivot-based partitioning decisions.",
    createSteps: generateQuickSortSteps,
  },
  {
    id: "heap",
    label: "Heap Sort",
    time: "O(n log n)",
    detail: "Compares heap property maintenance against extraction.",
    createSteps: generateHeapSortSteps,
  },
];

function generateRandomArray(size = 15) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

function getAlgorithmConfig(id: CompareAlgorithm) {
  return (
    SORTING_COMPARE_OPTIONS.find((option) => option.id === id) ??
    SORTING_COMPARE_OPTIONS[0]
  );
}

export default function ComparePage() {
  const [baseArray, setBaseArray] = useState<number[]>(() => generateRandomArray());
  const [leftAlgorithm, setLeftAlgorithm] = useState<CompareAlgorithm>("bubble");
  const [rightAlgorithm, setRightAlgorithm] = useState<CompareAlgorithm>("quick");
  const [leftStep, setLeftStep] = useState<SortingStep | null>(null);
  const [rightStep, setRightStep] = useState<SortingStep | null>(null);
  const [leftProgress, setLeftProgress] = useState(0);
  const [rightProgress, setRightProgress] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [isPlaying, setIsPlaying] = useState(false);

  const leftControllerRef = useRef<StepController<SortingStep> | null>(null);
  const rightControllerRef = useRef<StepController<SortingStep> | null>(null);

  useEffect(() => {
    if (!baseArray.length) return;

    const config = getAlgorithmConfig(leftAlgorithm);
    const steps = config.createSteps(baseArray);

    leftControllerRef.current?.pause();
    leftControllerRef.current = new StepController(steps, (step) => {
      setLeftStep(step);
      if (!leftControllerRef.current) return;
      setLeftProgress(
        leftControllerRef.current.currentStepIndex /
          Math.max(leftControllerRef.current.steps.length, 1)
      );
    });

    return () => leftControllerRef.current?.pause();
  }, [baseArray, leftAlgorithm]);

  useEffect(() => {
    if (!baseArray.length) return;

    const config = getAlgorithmConfig(rightAlgorithm);
    const steps = config.createSteps(baseArray);

    rightControllerRef.current?.pause();
    rightControllerRef.current = new StepController(steps, (step) => {
      setRightStep(step);
      if (!rightControllerRef.current) return;
      setRightProgress(
        rightControllerRef.current.currentStepIndex /
          Math.max(rightControllerRef.current.steps.length, 1)
      );
    });

    return () => rightControllerRef.current?.pause();
  }, [baseArray, rightAlgorithm]);

  useEffect(() => {
    leftControllerRef.current?.setSpeed(speed);
    rightControllerRef.current?.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = window.setInterval(() => {
      const leftRunning = leftControllerRef.current?.status === "running";
      const rightRunning = rightControllerRef.current?.status === "running";

      if (!leftRunning && !rightRunning) {
        setIsPlaying(false);
      }
    }, 120);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  function handlePlayPause() {
    if (!leftControllerRef.current || !rightControllerRef.current) {
      return;
    }

    if (isPlaying) {
      leftControllerRef.current.pause();
      rightControllerRef.current.pause();
      setIsPlaying(false);
      return;
    }

    leftControllerRef.current.play();
    rightControllerRef.current.play();
    setIsPlaying(true);
  }

  function handleReset() {
    leftControllerRef.current?.reset();
    rightControllerRef.current?.reset();
    setLeftStep(null);
    setRightStep(null);
    setLeftProgress(0);
    setRightProgress(0);
    setIsPlaying(false);
  }

  function handleNew() {
    handleReset();
    setBaseArray(generateRandomArray());
  }

  const leftConfig = getAlgorithmConfig(leftAlgorithm);
  const rightConfig = getAlgorithmConfig(rightAlgorithm);
  const overallProgress = (leftProgress + rightProgress) / 2;

  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <Navbar />
      <AlgorithmBackground variant="sorting" />

      <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 py-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Compare Mode
              </p>
              <h1 className="mt-3 text-4xl font-bold text-white">
                Watch two sorting algorithms handle the same input.
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/62">
                Pick any two sorting algorithms, play them side by side, and use the
                narration below each panel to see exactly how their strategies diverge. Need
                to compare searching or pathfinding instead? Visit the links below.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/75">
                <Link
                  href="/visualizer/compare/searching"
                  className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 transition hover:border-white/20 hover:text-white"
                >
                  Compare searching →
                </Link>
                <Link
                  href="/visualizer/compare/pathfinding"
                  className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 transition hover:border-white/20 hover:text-white"
                >
                  Compare pathfinding →
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <SelectCard
                label="Left algorithm"
                value={leftAlgorithm}
                onChange={(value) => {
                  leftControllerRef.current?.pause();
                  setIsPlaying(false);
                  setLeftStep(null);
                  setLeftProgress(0);
                  setLeftAlgorithm(value as CompareAlgorithm);
                }}
              />
              <SelectCard
                label="Right algorithm"
                value={rightAlgorithm}
                onChange={(value) => {
                  rightControllerRef.current?.pause();
                  setIsPlaying(false);
                  setRightStep(null);
                  setRightProgress(0);
                  setRightAlgorithm(value as CompareAlgorithm);
                }}
              />
            </div>
          </div>
        </section>

        <Controls
          onPlay={handlePlayPause}
          onStepForward={() => {
            leftControllerRef.current?.stepForward();
            rightControllerRef.current?.stepForward();
          }}
          onStepBack={() => {
            leftControllerRef.current?.stepBackward();
            rightControllerRef.current?.stepBackward();
          }}
          onReset={handleReset}
          onNew={handleNew}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={overallProgress}
          isPlaying={isPlaying}
          statusText={`Both panels are using the same array: ${baseArray.join(", ") || "loading..."}.`}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <ComparePanel
            title={leftConfig.label}
            time={leftConfig.time}
            detail={leftConfig.detail}
            array={leftStep?.array ?? baseArray}
            comparing={leftStep?.comparing}
            swapping={leftStep?.swapping}
            sortedIndices={leftStep?.sortedIndices}
            activeRange={leftStep?.activeRange}
            progress={leftProgress}
            narration={describeSortingStep(leftAlgorithm, leftStep, baseArray)}
          />
          <ComparePanel
            title={rightConfig.label}
            time={rightConfig.time}
            detail={rightConfig.detail}
            array={rightStep?.array ?? baseArray}
            comparing={rightStep?.comparing}
            swapping={rightStep?.swapping}
            sortedIndices={rightStep?.sortedIndices}
            activeRange={rightStep?.activeRange}
            progress={rightProgress}
            narration={describeSortingStep(rightAlgorithm, rightStep, baseArray)}
          />
        </div>
      </main>
    </div>
  );
}

function SelectCard({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
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
        {SORTING_COMPARE_OPTIONS.map((option) => (
          <option key={option.id} value={option.id} className="bg-[#071019]">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ComparePanel({
  title,
  time,
  detail,
  array,
  comparing,
  swapping,
  sortedIndices,
  activeRange,
  progress,
  narration,
}: {
  title: string;
  time: string;
  detail: string;
  array: number[];
  comparing?: [number, number];
  swapping?: [number, number];
  sortedIndices?: number[];
  activeRange?: [number, number];
  progress: number;
  narration: string;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#07111b]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
            Sorting panel
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/58">{detail}</p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/72">
          {time}
        </div>
      </div>

      <div className="mt-6">
        <ArrayBars
          array={array}
          comparing={comparing}
          swapping={swapping}
          sortedIndices={sortedIndices}
          activeRange={activeRange}
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
