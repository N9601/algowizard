import { SearchStep } from "../types";

export function generateLinearSearchSteps(
  array: number[],
  target: number
): SearchStep[] {
  const steps: SearchStep[] = [];

  for (let i = 0; i < array.length; i++) {
    steps.push({
      array: [...array],
      currentIndex: i,
    });

    if (array[i] === target) {
      steps.push({
        array: [...array],
        foundIndex: i,
        done: true,
      });
      return steps;
    }
  }

  // ❌ NOT FOUND
  steps.push({
    array: [...array],
    notFound: true,
    done: true,
  });

  return steps;
}
