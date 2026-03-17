export type NNPoint = { x: number; y: number; label: number };

export type NNState = {
  points: NNPoint[];
  weights1: number[]; // 2x2 + 2 bias = 6
  weights2: number[]; // 2x1 + bias = 3
};

export function forward(state: NNState) {
  const { points, weights1, weights2 } = state;
  return points.map((p) => {
    const h1 = relu(weights1[0] * p.x + weights1[1] * p.y + weights1[2]);
    const h2 = relu(weights1[3] * p.x + weights1[4] * p.y + weights1[5]);
    const logit = weights2[0] * h1 + weights2[1] * h2 + weights2[2];
    const prob = 1 / (1 + Math.exp(-logit));
    return { ...p, h1, h2, prob };
  });
}

export function trainStep(state: NNState, lr: number) {
  const { points, weights1, weights2 } = state;

  const w1 = [...weights1];
  const w2 = [...weights2];

  for (const p of points) {
    const h1pre = w1[0] * p.x + w1[1] * p.y + w1[2];
    const h2pre = w1[3] * p.x + w1[4] * p.y + w1[5];
    const h1 = relu(h1pre);
    const h2 = relu(h2pre);
    const logit = w2[0] * h1 + w2[1] * h2 + w2[2];
    const prob = 1 / (1 + Math.exp(-logit));
    const target = p.label;
    const dLoss_dLogit = prob - target;

    // Output layer gradients
    const dW2_0 = dLoss_dLogit * h1;
    const dW2_1 = dLoss_dLogit * h2;
    const dW2_b = dLoss_dLogit * 1;

    // Hidden gradients
    const dH1 = dLoss_dLogit * w2[0] * reluGrad(h1pre);
    const dH2 = dLoss_dLogit * w2[1] * reluGrad(h2pre);

    const dW1_0 = dH1 * p.x;
    const dW1_1 = dH1 * p.y;
    const dW1_b0 = dH1 * 1;

    const dW1_3 = dH2 * p.x;
    const dW1_4 = dH2 * p.y;
    const dW1_b1 = dH2 * 1;

    // SGD update
    w2[0] -= lr * dW2_0;
    w2[1] -= lr * dW2_1;
    w2[2] -= lr * dW2_b;

    w1[0] -= lr * dW1_0;
    w1[1] -= lr * dW1_1;
    w1[2] -= lr * dW1_b0;
    w1[3] -= lr * dW1_3;
    w1[4] -= lr * dW1_4;
    w1[5] -= lr * dW1_b1;
  }

  return { weights1: w1, weights2: w2 };
}

function relu(x: number) {
  return Math.max(0, x);
}

function reluGrad(x: number) {
  return x > 0 ? 1 : 0;
}
