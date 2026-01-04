import { SearchStep } from "../types";

export function generateBinarySearchSteps(
  array: number[],
  target: number
): SearchStep[] {
  const steps: SearchStep[] = [];
  let low = 0;
  let high = array.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    // step: checking mid
    steps.push({
      array: [...array],
      currentIndex: mid,
      low,
      high,
    });

    if (array[mid] === target) {
      // FOUND
      steps.push({
        array: [...array],
        foundIndex: mid,
        currentIndex: mid,
        low,
        high,
        done: true,
      });
      return steps;
    }

    if (array[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // ❌ NOT FOUND (IMPORTANT FIX)
  steps.push({
    array: [...array],
    notFound: true,
    done: true,
  });

  return steps;
}
