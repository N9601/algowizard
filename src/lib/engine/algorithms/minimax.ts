export type TicTacToeCell = "X" | "O" | null;

export type MinimaxStep = {
  board: TicTacToeCell[];
  turn: "X" | "O";
  moveIndex: number | null;
  score: number | null;
  path: number[];
  pruned?: boolean;
};

type EvalResult = {
  score: number;
  steps: MinimaxStep[];
};

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winner(board: TicTacToeCell[]) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(Boolean)) return "draw";
  return null;
}

export function minimax(board: TicTacToeCell[], turn: "X" | "O") {
  return evaluate(board, turn, [], false);
}

export function alphabeta(board: TicTacToeCell[], turn: "X" | "O") {
  return evaluate(board, turn, [], true);
}

function evaluate(
  board: TicTacToeCell[],
  turn: "X" | "O",
  path: number[],
  usePruning: boolean,
  alpha = -Infinity,
  beta = Infinity
): EvalResult {
  const win = winner(board);
  if (win) {
    const score = win === "X" ? 1 : win === "O" ? -1 : 0;
    return {
      score,
      steps: [
        {
          board,
          turn,
          moveIndex: null,
          score,
          path,
          pruned: false,
        },
      ],
    };
  }

  const isMax = turn === "X";
  let bestScore = isMax ? -Infinity : Infinity;
  let bestSteps: MinimaxStep[] = [];

  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const nextBoard = board.slice();
    nextBoard[i] = turn;
    const nextTurn = turn === "X" ? "O" : "X";
    const result = evaluate(
      nextBoard,
      nextTurn,
      [...path, i],
      usePruning,
      alpha,
      beta
    );

    const currentSteps: MinimaxStep[] = [
      {
        board,
        turn,
        moveIndex: i,
        score: result.score,
        path,
        pruned: false,
      },
      ...result.steps,
    ];

    if (isMax) {
      if (result.score > bestScore) {
        bestScore = result.score;
        bestSteps = currentSteps;
      }
      alpha = Math.max(alpha, result.score);
    } else {
      if (result.score < bestScore) {
        bestScore = result.score;
        bestSteps = currentSteps;
      }
      beta = Math.min(beta, result.score);
    }

    if (usePruning && beta <= alpha) {
      bestSteps.unshift({
        board,
        turn,
        moveIndex: i,
        score: result.score,
        path,
        pruned: true,
      });
      break;
    }
  }

  return { score: bestScore, steps: bestSteps };
}
