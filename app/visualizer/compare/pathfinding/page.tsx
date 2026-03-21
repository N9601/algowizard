"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "components/visualizer/Navbar";
import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import Controls from "components/visualizer/Controls";
import PathGrid from "components/visualizer/PathGrid";
import { buildAStarSteps, buildBfsSteps, buildDijkstraSteps } from "src/lib/engine/algorithms/pathfinding";
import { StepController } from "src/lib/engine/controller";
import type { PathfindingStep } from "src/lib/engine/types";

const ROWS = 12;
const COLS = 20;

type Algo = "a-star" | "bfs" | "dijkstra";

const OPTIONS: { id: Algo; label: string; helper: string }[] = [
  { id: "a-star", label: "A*", helper: "Heuristic + cost" },
  { id: "bfs", label: "BFS", helper: "Unweighted shortest" },
  { id: "dijkstra", label: "Dijkstra", helper: "Uniform cost" },
];

function key([r, c]: [number, number]) {
  return `${r},${c}`;
}

export default function ComparePathfinding() {
  const [walls, setWalls] = useState<Set<string>>(new Set());
  const [start, setStart] = useState<[number, number]>([2, 2]);
  const [goal, setGoal] = useState<[number, number]>([ROWS - 3, COLS - 3]);
  const [leftAlgo, setLeftAlgo] = useState<Algo>("a-star");
  const [rightAlgo, setRightAlgo] = useState<Algo>("bfs");
  const [leftStep, setLeftStep] = useState<PathfindingStep | null>(null);
  const [rightStep, setRightStep] = useState<PathfindingStep | null>(null);
  const [leftProgress, setLeftProgress] = useState(0);
  const [rightProgress, setRightProgress] = useState(0);
  const [speed, setSpeed] = useState(400);
  const [isPlaying, setIsPlaying] = useState(false);

  const leftController = useRef<StepController<PathfindingStep> | null>(null);
  const rightController = useRef<StepController<PathfindingStep> | null>(null);

  const baseConfig = useMemo(
    () => ({
      rows: ROWS,
      cols: COLS,
      start,
      goal,
      walls,
    }),
    [start, goal, walls]
  );

  const leftSteps = useMemo(() => buildSteps(leftAlgo, baseConfig), [leftAlgo, baseConfig]);
  const rightSteps = useMemo(
    () => buildSteps(rightAlgo, baseConfig),
    [rightAlgo, baseConfig]
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

  const randomWalls = () => {
    const next = new Set<string>();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < 0.18 && key([r, c]) !== key(start) && key([r, c]) !== key(goal)) {
          next.add(key([r, c]));
        }
      }
    }
    setWalls(next);
    reset();
  };

  const overallProgress = (leftProgress + rightProgress) / 2;

  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <Navbar />
      <AlgorithmBackground variant="graph" />

      <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 py-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Compare Pathfinding
              </p>
              <h1 className="mt-3 text-4xl font-bold text-white">
                Contrast heuristic, uniform-cost, and unweighted search.
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/62">
                Play two grid searches side by side on the same obstacles to see how their
                frontiers differ.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <SelectCard
                label="Left algorithm"
                value={leftAlgo}
                onChange={(value) => {
                  setIsPlaying(false);
                  setLeftAlgo(value as Algo);
                }}
              />
              <SelectCard
                label="Right algorithm"
                value={rightAlgo}
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
          onNew={randomWalls}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={overallProgress}
          isPlaying={isPlaying}
          statusText={`Grid ${ROWS}×${COLS} • Start (${start.join(",")}) → Goal (${goal.join(",")})`}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <PathPanel
            title={OPTIONS.find((o) => o.id === leftAlgo)?.label ?? ""}
            helper={OPTIONS.find((o) => o.id === leftAlgo)?.helper ?? ""}
            step={leftStep}
            walls={walls}
            start={start}
            goal={goal}
            onToggleWall={(coord) => setWalls((prev) => toggle(prev, coord, start, goal))}
            onSetStart={setStart}
            onSetGoal={setGoal}
          />
          <PathPanel
            title={OPTIONS.find((o) => o.id === rightAlgo)?.label ?? ""}
            helper={OPTIONS.find((o) => o.id === rightAlgo)?.helper ?? ""}
            step={rightStep}
            walls={walls}
            start={start}
            goal={goal}
            onToggleWall={(coord) => setWalls((prev) => toggle(prev, coord, start, goal))}
            onSetStart={setStart}
            onSetGoal={setGoal}
          />
        </div>
      </main>
    </div>
  );
}

function buildSteps(algo: Algo, config: { rows: number; cols: number; start: [number, number]; goal: [number, number]; walls: Set<string> }) {
  switch (algo) {
    case "bfs":
      return buildBfsSteps(config);
    case "dijkstra":
      return buildDijkstraSteps(config);
    case "a-star":
    default:
      return buildAStarSteps(config);
  }
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
        {OPTIONS.map((option) => (
          <option key={option.id} value={option.id} className="bg-[#071019]">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PathPanel({
  title,
  helper,
  step,
  walls,
  start,
  goal,
  onToggleWall,
  onSetStart,
  onSetGoal,
}: {
  title: string;
  helper: string;
  step: PathfindingStep | null;
  walls: Set<string>;
  start: [number, number];
  goal: [number, number];
  onToggleWall: (coord: [number, number]) => void;
  onSetStart: (coord: [number, number]) => void;
  onSetGoal: (coord: [number, number]) => void;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#07111b]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
            Pathfinding panel
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/58">{helper}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <PathGrid
          rows={ROWS}
          cols={COLS}
          walls={walls}
          visited={new Set(step?.visited ?? [])}
          frontier={new Set(step?.frontier ?? [])}
          path={new Set(step?.path ?? [])}
          current={step?.current ?? undefined}
          start={start}
          goal={goal}
          onToggleWall={onToggleWall}
          onSetStart={onSetStart}
          onSetGoal={onSetGoal}
        />
      </div>
    </section>
  );
}

function toggle(
  prev: Set<string>,
  coord: [number, number],
  start: [number, number],
  goal: [number, number]
) {
  const k = key(coord);
  if (k === key(start) || k === key(goal)) return prev;
  const next = new Set(prev);
  if (next.has(k)) next.delete(k);
  else next.add(k);
  return next;
}
