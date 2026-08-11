import { describe, expect, it } from "vitest";

import { alphabeta, minimax, TicTacToeCell } from "../algorithms/minimax";

function board(layout: string): TicTacToeCell[] {
  return layout.split("").map((cell) => (cell === "." ? null : (cell as "X" | "O")));
}

describe("minimax", () => {
  it("scores a finished board without exploring further", () => {
    const result = minimax(board("XXXOO...."), "O");

    expect(result.score).toBe(1);
    expect(result.steps).toHaveLength(1);
  });

  it("finds an immediate win for X", () => {
    const result = minimax(board("XX.OO...."), "X");

    expect(result.score).toBe(1);
  });

  it("sees that O must block and the game is drawn", () => {
    expect(minimax(board("X...O...."), "X").score).toBe(0);
  });

  it("detects a forced loss for X", () => {
    expect(minimax(board("OO.X..X.."), "O").score).toBe(-1);
  });
});

describe("alpha-beta pruning", () => {
  const positions: [string, "X" | "O"][] = [
    ["X...O....", "X"],
    ["XX.OO....", "X"],
    ["XX.OO....", "O"],
    ["OO.X..X..", "O"],
    ["X.O.X....", "O"],
    ["....X....", "O"],
  ];

  it.each(positions)("matches the minimax value for %s (%s to move)", (layout, turn) => {
    expect(alphabeta(board(layout), turn).score).toBe(minimax(board(layout), turn).score);
  });
});
