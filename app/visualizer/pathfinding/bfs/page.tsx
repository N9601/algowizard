"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "components/visualizer/Navbar";
import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "components/visualizer/AlgorithmLayout";
import Controls from "components/visualizer/Controls";
import PathGrid from "components/visualizer/PathGrid";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import { buildBfsSteps } from "src/lib/engine/algorithms/pathfinding";
import { StepController } from "src/lib/engine/controller";
import type { PathfindingStep } from "src/lib/engine/types";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

const ROWS = 12;
const COLS = 20;

type SavedPathState = {
  walls: string[];
  start: [number, number];
  goal: [number, number];
  speed: number;
};

function key([r, c]: [number, number]) {
  return `${r},${c}`;
}

export default function BfsPathPage() {
  const [walls, setWalls] = useState<Set<string>>(new Set());
  const [start, setStart] = useState<[number, number]>([2, 2]);
  const [goal, setGoal] = useState<[number, number]>([ROWS - 3, COLS - 3]);
  const [step, setStep] = useState<PathfindingStep | null>(null);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(400);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<PathfindingStep> | null>(null);
  const initializedRef = useRef(false);

  const savedState = useSavedVisualization<SavedPathState>({
    expectedRoute: "/visualizer/pathfinding/bfs",
    applyState: (saved) => {
      controllerRef.current?.pause();
      controllerRef.current?.reset();
      setWalls(new Set(saved.walls ?? []));
      setStart(saved.start ?? [2, 2]);
      setGoal(saved.goal ?? [ROWS - 3, COLS - 3]);
      setSpeed(saved.speed ?? 400);
      setStep(null);
      setProgress(0);
      setIsPlaying(false);
    },
  });

  const gridConfig = useMemo(
    () => ({
      rows: ROWS,
      cols: COLS,
      start,
      goal,
      walls,
    }),
    [walls, start, goal]
  );

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    rebuildController();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    rebuildController();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridConfig]);

  const rebuildController = () => {
    const steps = buildBfsSteps({
      rows: ROWS,
      cols: COLS,
      start,
      goal,
      walls,
    });

    controllerRef.current = new StepController(steps, (s) => {
      setStep(s);
      if (controllerRef.current) {
        setProgress(
          controllerRef.current.currentStepIndex /
            controllerRef.current.steps.length
        );
      }
      if (s.found) {
        setIsPlaying(false);
      }
    });
    controllerRef.current.setSpeed(speed);
    setStep(steps[0] ?? null);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!controllerRef.current) return;
    if (isPlaying) controllerRef.current.pause();
    else controllerRef.current.play();
    setIsPlaying((v) => !v);
  };

  const toggleWall = ([r, c]: [number, number]) => {
    const k = key([r, c]);
    if (k === key(start) || k === key(goal)) return;
    const next = new Set(walls);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setWalls(next);
  };

  const randomizeWalls = () => {
    const next = new Set<string>();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < 0.18 && key([r, c]) !== key(start) && key([r, c]) !== key(goal)) {
          next.add(key([r, c]));
        }
      }
    }
    setWalls(next);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="graph" />

      <AlgorithmLayout
        title="Breadth-First Search"
        description="BFS explores the grid level by level to find the shortest unweighted path from start to goal."
        time="O(E)"
        space="O(V)"
        category="Graph"
        difficulty="Easy"
        progressPercent={Math.round(progress * 100)}
        actions={
          <div className="space-y-3">
            <SaveVisualizationButton
              title="BFS Grid"
              algorithmSlug="bfs-grid"
              route="/visualizer/pathfinding/bfs"
              disabled={!step}
              getPayload={() => ({
                walls: Array.from(walls),
                start,
                goal,
                speed,
              })}
            />
            {savedState.loadedTitle ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                Loaded saved state: {savedState.loadedTitle}
              </div>
            ) : null}
            {savedState.loadError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                {savedState.loadError}
              </div>
            ) : null}
          </div>
        }
      >
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap gap-2 text-xs text-white/70">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-3 w-3 rounded-sm bg-emerald-500" />
              Start
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-3 w-3 rounded-sm bg-pink-500" />
              Goal
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-3 w-3 rounded-sm bg-sky-500/80" />
              Frontier
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-3 w-3 rounded-sm bg-white/30" />
              Visited
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
              <span className="h-3 w-3 rounded-sm bg-amber-400/90" />
              Path
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              onClick={randomizeWalls}
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-white/80 transition hover:border-white/25 hover:text-white"
            >
              Random walls
            </button>
            <button
              type="button"
              onClick={() => {
                setWalls(new Set());
                setStart([2, 2]);
                setGoal([ROWS - 3, COLS - 3]);
              }}
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-white/80 transition hover:border-white/25 hover:text-white"
            >
              Reset grid
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
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
            onToggleWall={toggleWall}
            onSetStart={(coord) => setStart(coord)}
            onSetGoal={(coord) => setGoal(coord)}
          />
        </div>

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText="Exploring frontier level by level"
          onReset={() => {
            controllerRef.current?.reset();
            setStep(controllerRef.current?.steps[0] ?? null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setWalls(new Set());
            setStep(controllerRef.current?.steps[0] ?? null);
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
