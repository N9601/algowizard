"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "components/visualizer/Navbar";
import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "components/visualizer/AlgorithmLayout";
import Controls from "components/visualizer/Controls";
import SaveVisualizationButton from "components/visualizer/SaveVisualizationButton";
import TicTacToeBoard from "components/visualizer/TicTacToeBoard";
import { alphabeta, MinimaxStep, TicTacToeCell } from "src/lib/engine/algorithms/minimax";
import { StepController } from "src/lib/engine/controller";
import { useSavedVisualization } from "src/lib/saved-visualizations/useSavedVisualization";

type SavedState = {
  board: TicTacToeCell[];
  turn: "X" | "O";
  speed: number;
};

function emptyBoard(): TicTacToeCell[] {
  return Array(9).fill(null);
}

export default function AlphaBetaPage() {
  const [board, setBoard] = useState<TicTacToeCell[]>(() => emptyBoard());
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const controllerRef = useRef<StepController<MinimaxStep> | null>(null);

  const savedState = useSavedVisualization<SavedState>({
    expectedRoute: "/visualizer/decision/alpha-beta",
    applyState: (saved) => {
      controllerRef.current?.pause();
      controllerRef.current?.reset();
      setBoard(saved.board ?? emptyBoard());
      setTurn(saved.turn ?? "X");
      setSpeed(saved.speed ?? 500);
      setProgress(0);
      setIsPlaying(false);
      setCurrentIndex(0);
    },
  });

  const steps = useMemo(() => alphabeta(board, turn).steps, [board, turn]);

  useEffect(() => {
    if (!steps.length) return;
    controllerRef.current = new StepController(steps, () => {
      if (!controllerRef.current) return;
      setCurrentIndex(controllerRef.current.currentStepIndex);
      setProgress(
        controllerRef.current.currentStepIndex /
          controllerRef.current.steps.length
      );
    });
    controllerRef.current.setSpeed(speed);
    setTimeout(() => {
      setCurrentIndex(0);
      setProgress(0);
      setIsPlaying(false);
    }, 0);
  }, [steps, speed]);

  const currentStep = steps[currentIndex] ?? steps[0] ?? null;

  const togglePlay = () => {
    if (!controllerRef.current) return;
    if (isPlaying) controllerRef.current.pause();
    else controllerRef.current.play();
    setIsPlaying((v) => !v);
  };

  const applyMove = (idx: number) => {
    if (board[idx]) return;
    const next = board.slice();
    next[idx] = turn;
    setBoard(next);
    setTurn(turn === "X" ? "O" : "X");
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="graph" />

      <AlgorithmLayout
        title="Alpha–Beta Pruning (Tic-Tac-Toe)"
        description="Minimax with alpha–beta pruning skips branches that cannot improve the outcome."
        time="O(b^d) best-case pruned"
        space="O(bd)"
        category="Decision AI"
        difficulty="Medium"
        progressPercent={Math.round(progress * 100)}
        actions={
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 text-sm text-white/75">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
                Current turn: {turn}
              </span>
              <button
                type="button"
                onClick={() => {
                  setBoard(emptyBoard());
                  setTurn("X");
                }}
                className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
              >
                Reset board
              </button>
            </div>

            <SaveVisualizationButton
              title="Alpha–Beta"
              algorithmSlug="alpha-beta"
              route="/visualizer/decision/alpha-beta"
              disabled={!board}
              getPayload={() => ({
                board,
                turn,
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
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 text-sm text-white/70">
              Click to make a move, then play through the pruned tree traversal.
            </div>
            <TicTacToeBoard
              board={currentStep?.board ?? board}
              highlight={currentStep?.path ?? []}
              onMove={applyMove}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/75">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Node Insight
            </div>
            <div className="mt-2">
              Move:{" "}
              {currentStep?.moveIndex !== null
                ? `Place ${currentStep.turn} at ${currentStep.moveIndex}`
                : "Terminal"}
            </div>
            <div className="mt-1">Score: {currentStep?.score ?? "-"}</div>
            <div className="mt-1">Turn: {currentStep?.turn ?? turn}</div>
            {currentStep?.pruned ? (
              <div className="mt-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-amber-100">
                Branch pruned here (alpha–beta).
              </div>
            ) : null}
          </div>
        </div>

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={`Step ${currentIndex + 1} / ${steps.length}`}
          onReset={() => {
            controllerRef.current?.reset();
            setCurrentIndex(0);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setBoard(emptyBoard());
            setTurn("X");
            setCurrentIndex(0);
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
