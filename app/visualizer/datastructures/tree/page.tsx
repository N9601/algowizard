"use client";

import { useEffect, useRef, useState } from "react";

import { StepController } from "../../../../src/lib/engine/controller";
import { generateBinaryTreeInsertSteps, BinaryTreeInsertStep } from "../../../../src/lib/engine/algorithms/binaryTreeInsert";

import Navbar from "../../../../components/visualizer/Navbar";
import AlgorithmBackground from "../../../../components/visualizer/AlgorithmBackground";
import AlgorithmLayout from "../../../../components/visualizer/AlgorithmLayout";
import Controls from "../../../../components/visualizer/Controls";
import GraphCanvas from "../../../../components/visualizer/GraphCanvas";

export default function BinaryTreePage() {

  const values = [0,1,4,2,3,5,6];

  const [step, setStep] = useState<BinaryTreeInsertStep | null>(null);
  const [speed, setSpeed] = useState(600);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const controllerRef = useRef<StepController<BinaryTreeInsertStep> | null>(null);

  const steps = generateBinaryTreeInsertSteps(values);

  useEffect(() => {

    controllerRef.current = new StepController(steps, (s) => {

      setStep(s);

      setProgress(
        controllerRef.current!.currentStepIndex /
        controllerRef.current!.steps.length
      );

    });

    controllerRef.current.setSpeed(speed);

    return () => controllerRef.current?.pause();

  }, [speed, steps]);

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
          onReset={() => {
            controllerRef.current?.reset();
            setStep(null);
            setProgress(0);
            setIsPlaying(false);
          }}
          onNew={() => {
            controllerRef.current?.reset();
            setStep(null);
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