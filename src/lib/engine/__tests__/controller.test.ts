import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { StepController } from "../controller";

function setup(count = 5) {
  const shown: number[] = [];
  const steps = Array.from({ length: count }, (_, i) => i);
  const controller = new StepController(steps, (step) => shown.push(step));
  return { controller, shown };
}

describe("StepController stepping", () => {
  it("steps forward through each step once", () => {
    const { controller, shown } = setup(3);

    controller.stepForward();
    controller.stepForward();
    controller.stepForward();
    controller.stepForward();

    expect(shown).toEqual([0, 1, 2]);
  });

  it("steps back to the previous step instead of repeating the current one", () => {
    const { controller, shown } = setup();

    controller.stepForward();
    controller.stepForward();
    controller.stepForward();
    controller.stepBackward();

    expect(shown).toEqual([0, 1, 2, 1]);
  });

  it("continues forward from the step it went back to", () => {
    const { controller, shown } = setup();

    controller.stepForward();
    controller.stepForward();
    controller.stepBackward();
    controller.stepForward();

    expect(shown).toEqual([0, 1, 0, 1]);
  });

  it("does not step back past the first step", () => {
    const { controller, shown } = setup();

    controller.stepBackward();
    controller.stepForward();
    controller.stepBackward();

    expect(shown).toEqual([0]);
  });

  it("reports the displayed step index inside the update callback", () => {
    const indices: number[] = [];
    const controller: StepController<string> = new StepController(
      ["a", "b", "c"],
      () => indices.push(controller.currentStepIndex)
    );

    controller.stepForward();
    controller.stepForward();
    controller.stepForward();
    controller.stepBackward();

    expect(indices).toEqual([0, 1, 2, 1]);
  });
});

describe("StepController playback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("plays every step at the configured speed", () => {
    const { controller, shown } = setup(3);

    controller.setSpeed(100);
    controller.play();
    vi.advanceTimersByTime(250);

    expect(shown).toEqual([0, 1]);
    expect(controller.status).toBe("running");

    vi.advanceTimersByTime(200);

    expect(shown).toEqual([0, 1, 2]);
    expect(controller.status).toBe("completed");
  });

  it("stops advancing while paused", () => {
    const { controller, shown } = setup(5);

    controller.setSpeed(100);
    controller.play();
    vi.advanceTimersByTime(150);
    controller.pause();
    vi.advanceTimersByTime(1000);

    expect(shown).toEqual([0]);
    expect(controller.status).toBe("paused");
  });

  it("starts again from the first step after reset", () => {
    const { controller, shown } = setup(3);

    controller.stepForward();
    controller.stepForward();
    controller.reset();
    controller.stepForward();

    expect(shown).toEqual([0, 1, 0]);
    expect(controller.status).toBe("idle");
  });
});
