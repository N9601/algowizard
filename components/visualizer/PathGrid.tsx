"use client";

import { memo } from "react";

type Coord = [number, number];

type PathGridProps = {
  rows: number;
  cols: number;
  walls: Set<string>;
  visited: Set<string>;
  frontier: Set<string>;
  path: Set<string>;
  current?: Coord | null;
  start: Coord;
  goal: Coord;
  onToggleWall?: (coord: Coord) => void;
  onSetStart?: (coord: Coord) => void;
  onSetGoal?: (coord: Coord) => void;
};

function key([r, c]: Coord) {
  return `${r},${c}`;
}

function classNames(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}

const PathGrid = memo(function PathGrid({
  rows,
  cols,
  walls,
  visited,
  frontier,
  path,
  current,
  start,
  goal,
  onToggleWall,
  onSetStart,
  onSetGoal,
}: PathGridProps) {
  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(20px, 1fr))`,
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const k = key([r, c]);
            const isStart = r === start[0] && c === start[1];
            const isGoal = r === goal[0] && c === goal[1];
            const isWall = walls.has(k);
            const isPath = path.has(k);
            const isVisited = visited.has(k);
            const isFrontier = frontier.has(k);
            const isCurrent = current && current[0] === r && current[1] === c;

            const bg =
              isStart
                ? "bg-emerald-500"
                : isGoal
                  ? "bg-pink-500"
                  : isWall
                    ? "bg-white/15"
                    : isCurrent
                      ? "bg-blue-400"
                      : isPath
                        ? "bg-amber-400/90"
                        : isFrontier
                          ? "bg-sky-500/70"
                          : isVisited
                            ? "bg-white/20"
                            : "bg-white/5";

            return (
              <button
                key={k}
                type="button"
                className={classNames(
                  "aspect-square min-w-[22px] rounded-[4px] border border-white/8 transition",
                  bg
                )}
                onClick={(event) => {
                  if (event.shiftKey) {
                    onSetStart?.([r, c]);
                  } else if (event.altKey) {
                    onSetGoal?.([r, c]);
                  } else {
                    onToggleWall?.([r, c]);
                  }
                }}
                title={
                  isStart
                    ? "Start"
                    : isGoal
                      ? "Goal"
                      : "Click: wall | Shift: set start | Alt: set goal"
                }
              />
            );
          })
        )}
      </div>
      <div className="mt-2 text-xs text-white/60">
        Click to toggle walls. Shift+click sets Start. Alt+click sets Goal.
      </div>
    </div>
  );
});

export default PathGrid;
