import { RecursionFrame, RecursionStep } from "../types";

function cloneStack(stack: RecursionFrame[]) {
  return stack.map((frame) => ({ ...frame }));
}

export function generateRecursionSteps(n = 4): RecursionStep[] {
  const steps: RecursionStep[] = [];
  const stack: RecursionFrame[] = [];

  const capture = (message: string, done = false) => {
    steps.push({
      stack: cloneStack(stack),
      message,
      done,
    });
  };

  const factorial = (k: number): number => {
    stack.push({ n: k, status: "call" });
    capture(`Call factorial(${k})`);

    if (k <= 1) {
      stack[stack.length - 1] = { n: k, status: "returning", result: 1 };
      capture(`Base case reached at ${k}, return 1`);
      stack.pop();
      capture("Unwinding to previous frame");
      return 1;
    }

    const partial = factorial(k - 1);
    const result = k * partial;

    stack.push({ n: k, status: "returning", result });
    capture(`Compute ${k} × ${partial} = ${result}`);
    stack.pop();
    capture(`Return ${result} to caller`);

    return result;
  };

  const total = factorial(n);
  capture(`Final result: ${total}`, true);

  return steps;
}
