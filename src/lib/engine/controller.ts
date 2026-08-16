import { AlgorithmController, AlgorithmStatus } from "./types";

export class StepController<TStep>
  implements AlgorithmController<TStep>
{
  status: AlgorithmStatus = "idle";
  steps: TStep[] = [];
  currentStepIndex = 0;
  speed = 500;

  // Number of steps shown so far, used for progress. Unlike currentStepIndex
  // it does not change meaning inside the onUpdate callback.
  private shownCount = 0;

  private interval: NodeJS.Timeout | null = null;
  private onUpdate: (step: TStep) => void;
  private onComplete?: () => void;

  constructor(
    steps: TStep[],
    onUpdate: (step: TStep) => void,
    onComplete?: () => void
  ) {
    this.steps = steps;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
  }

  private advanceStep = () => {
    if (this.currentStepIndex >= this.steps.length) {
      this.finish();
      return;
    }

    this.showNextStep();

    if (this.currentStepIndex >= this.steps.length) {
      this.finish();
    }
  };

  private showNextStep() {
    this.shownCount = this.currentStepIndex + 1;
    this.onUpdate(this.steps[this.currentStepIndex]);
    this.currentStepIndex++;
  }

  /** Fraction of the steps shown so far, from 0 to 1. */
  get progress() {
    return this.steps.length === 0 ? 0 : this.shownCount / this.steps.length;
  }

  private finish() {
    this.stop("completed");
    this.onComplete?.();
  }

  private scheduleInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(this.advanceStep, this.speed);
  }

  private stop(status: AlgorithmStatus) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.status = status;
  }

  play(speed = this.speed) {
    if (this.status === "running") return;

    this.speed = speed;

    if (this.steps.length === 0) {
      this.status = "completed";
      return;
    }

    // Pressing play after the last step replays the run from the start.
    if (this.currentStepIndex >= this.steps.length) {
      this.currentStepIndex = 0;
    }

    this.status = "running";
    this.scheduleInterval();
  }

  pause() {
    this.stop("paused");
  }

  stepForward() {
    if (this.currentStepIndex < this.steps.length) {
      this.showNextStep();
    }
  }

  stepBackward() {
    // currentStepIndex points at the next step to show, so the step on
    // screen is currentStepIndex - 1 and the previous one is two back.
    if (this.currentStepIndex > 1) {
      this.currentStepIndex -= 2;
      this.stepForward();
    }
  }

  reset() {
    this.stop("idle");
    this.currentStepIndex = 0;
    this.shownCount = 0;
  }

  setSpeed(speed: number) {
    this.speed = speed;
    if (this.status === "running") {
      this.scheduleInterval();
    }
  }
}
