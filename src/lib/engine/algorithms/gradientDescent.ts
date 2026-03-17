export type GDStep = {
  x: number;
  y: number;
  z: number;
  lr: number;
  iteration: number;
};

export function generateGDSteps(
  start: { x: number; y: number },
  lr: number,
  steps = 30
): GDStep[] {
  const out: GDStep[] = [];
  let { x, y } = start;

  for (let i = 0; i < steps; i++) {
    const { z, dx, dy } = lossGrad(x, y);
    out.push({ x, y, z, lr, iteration: i });
    x = x - lr * dx;
    y = y - lr * dy;
  }

  return out;
}

export function loss(x: number, y: number) {
  return 0.1 * (x * x + 2 * y * y) + Math.sin(x) * 0.5;
}

function lossGrad(x: number, y: number) {
  const z = loss(x, y);
  const dx = 0.2 * x + 0.5 * Math.cos(x);
  const dy = 0.4 * y;
  return { z, dx, dy };
}
