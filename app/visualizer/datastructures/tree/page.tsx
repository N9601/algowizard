"use client";

import { useEffect, useRef, useState } from "react";

import { StepController } from "src/lib/engine/controller";

import {
  generateBinaryTreeInsertSteps,
  BinaryTreeInsertStep,
} from "src/lib/engine/algorithms/binaryTreeInsert";

import Navbar from "components/visualizer/Navbar";
import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "components/visualizer/AlgorithmLayout";
import Controls from "components/visualizer/Controls";
import GraphCanvas from "components/visualizer/GraphCanvas";
import { describeTreeStep } from "src/lib/education/stepNarration";

const TREE_VALUES = [0, 1, 4, 2, 3, 5, 6];
const TREE_STEPS = generateBinaryTreeInsertSteps(TREE_VALUES);

export default function BinaryTreePage() {
  const [step, setStep] = useState<BinaryTreeInsertStep | null>(TREE_STEPS[0]);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<BinaryTreeInsertStep> | null>(null);

  useEffect(() => {

    controllerRef.current = new StepController(TREE_STEPS, (s: BinaryTreeInsertStep) => {

      setStep(s);

      setProgress(
        controllerRef.current!.currentStepIndex /
        controllerRef.current!.steps.length
      );

    });

    return () => controllerRef.current?.pause();

  }, []);

  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setSpeed(speed);
  }, [speed]);

  const togglePlay = () => {

    if (!controllerRef.current) return;

    if (isPlaying)
      controllerRef.current.pause();
    else
      controllerRef.current.play();

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <Navbar />
      <AlgorithmBackground variant="datastructure" />

      <AlgorithmLayout
        title="Binary Tree"
        description="Nodes are inserted level-by-level to build a binary tree."
        time="O(n)"
        space="O(n)"
        category="Data Structure"
        difficulty="Medium"
      >

        <GraphCanvas
          nodes={step?.nodes ?? []}
          edges={step?.edges ?? []}
          activeNode={step?.activeNode}
        />

        <Controls
          onPlay={togglePlay}
          onStepForward={() => controllerRef.current?.stepForward()}
          onStepBack={() => controllerRef.current?.stepBackward()}
          statusText={describeTreeStep(step)}
          onReset={() => {
            controllerRef.current?.reset();
            setStep(TREE_STEPS[0]);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setStep(TREE_STEPS[0]);
            setProgress(0);
            setIsPlaying(false);
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          progress={progress}
          isPlaying={isPlaying}
        />

      </AlgorithmLayout>
    </>
  );
}
