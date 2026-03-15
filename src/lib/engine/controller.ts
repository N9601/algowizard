import { AlgorithmController, AlgorithmStatus } from "./types";

export class StepController<TStep>
  implements AlgorithmController<TStep>
{
  status: AlgorithmStatus = "idle";
  steps: TStep[] = [];
  currentStepIndex = 0;
  speed = 500;

  private interval: NodeJS.Timeout | null = null;
  private onUpdate: (step: TStep) => void;

  constructor(steps: TStep[], onUpdate: (step: TStep) => void) {
    this.steps = steps;
    this.onUpdate = onUpdate;
  }

  private advanceStep = () => {
    if (this.currentStepIndex >= this.steps.length) {
      this.stop("completed");
      return;
    }

    this.onUpdate(this.steps[this.currentStepIndex]);
    this.currentStepIndex++;
  };

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

  play() {
    if (this.status === "running") return;

    if (this.currentStepIndex >= this.steps.length) {
      this.status = "completed";
      return;
    }

    this.status = "running";
    this.scheduleInterval();
  }

  pause() {
    this.stop("paused");
  }

  stepForward() {
    if (this.currentStepIndex < this.steps.length) {
      this.onUpdate(this.steps[this.currentStepIndex]);
      this.currentStepIndex++;
    }
  }

  
  stepBackward() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.onUpdate(this.steps[this.currentStepIndex]);
    }
  }

  reset() {
    this.stop("idle");
    this.currentStepIndex = 0;
  }

  setSpeed(speed: number) {
    this.speed = speed;
    if (this.status === "running") {
      this.scheduleInterval();
    }
  }
}
