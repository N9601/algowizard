import { describe, expect, it } from "vitest";

import {
  buildAStarSteps,
  buildBfsSteps,
  buildDijkstraSteps,
} from "../algorithms/pathfinding";

type Coord = [number, number];

const builders = {
  bfs: buildBfsSteps,
  "a-star": buildAStarSteps,
  dijkstra: buildDijkstraSteps,
};

function grid(walls: string[], start: Coord = [0, 0], goal: Coord = [4, 4]) {
  return { rows: 5, cols: 5, start, goal, walls: new Set(walls) };
}

function isContiguous(path: string[]) {
  return path.every((cell, index) => {
    if (index === 0) return true;
    const [r1, c1] = path[index - 1].split(",").map(Number);
    const [r2, c2] = cell.split(",").map(Number);
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  });
}

describe.each(Object.entries(builders))("%s grid search", (_name, build) => {
  it("finds a shortest path on an open grid", () => {
    const last = build(grid([])).at(-1)!;

    expect(last.found).toBe(true);
    expect(last.path).toHaveLength(9);
    expect(last.path[0]).toBe("4,4");
    expect(last.path.at(-1)).toBe("0,0");
    expect(isContiguous(last.path)).toBe(true);
  });

  it("routes around walls", () => {
    const walls = ["1,0", "1,1", "1,2", "1,3", "3,1", "3,2", "3,3", "3,4"];
    const last = build(grid(walls)).at(-1)!;

    expect(last.found).toBe(true);
    expect(last.path).toHaveLength(17);
    expect(last.path.some((cell) => walls.includes(cell))).toBe(false);
    expect(isContiguous(last.path)).toBe(true);
  });

  it("reports an unreachable goal", () => {
    const last = build(grid(["3,4", "4,3"])).at(-1)!;

    expect(last.found).toBe(false);
    expect(last.path).toEqual([]);
  });

  it("handles start equal to goal", () => {
    const last = build(grid([], [2, 2], [2, 2])).at(-1)!;

    expect(last.found).toBe(true);
    expect(last.path).toEqual(["2,2"]);
  });
});
