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

  play() {
    if (this.status === "running") return;
    this.status = "running";

    this.interval = setInterval(() => {
      if (this.currentStepIndex >= this.steps.length) {
        this.pause();
        this.status = "completed";
        return;
      }

      this.onUpdate(this.steps[this.currentStepIndex]);
      this.currentStepIndex++;
    }, this.speed);
  }

  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.status = "paused";
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
    this.pause();
    this.currentStepIndex = 0;
    this.status = "idle";
  }

  setSpeed(speed: number) {
    this.speed = speed;
    if (this.status === "running") {
      this.pause();
      this.play();
    }
  }
}
