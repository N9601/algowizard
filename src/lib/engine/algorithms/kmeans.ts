type Point = { x: number; y: number };

export type KMeansStep = {
  points: Array<Point & { cluster?: number }>;
  centroids: Point[];
  moved: boolean;
  iteration: number;
};

export function generateKMeansSteps(
  points: Point[],
  k: number,
  maxIterations = 12
): KMeansStep[] {
  if (k < 1) return [];
  const centroids = chooseInitial(points, k);
  const steps: KMeansStep[] = [];
  let assignedPoints = points.map((p) => ({ ...p, cluster: 0 }));

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    assignedPoints = assign(assignedPoints, centroids);
    steps.push({
      points: assignedPoints.map((p) => ({ ...p })),
      centroids: centroids.map((c) => ({ ...c })),
      moved: iteration > 0,
      iteration,
    });

    const { nextCentroids, changed } = recomputeCentroids(
      assignedPoints,
      centroids
    );
    centroids.splice(0, centroids.length, ...nextCentroids);
    if (!changed) break;
  }

  return steps;
}

function chooseInitial(points: Point[], k: number): Point[] {
  const shuffled = [...points].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, k).map((p) => ({ ...p }));
}

function assign(points: Array<Point & { cluster?: number }>, centroids: Point[]) {
  return points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    centroids.forEach((c, idx) => {
      const d = dist2(p, c);
      if (d < bestDist) {
        bestDist = d;
        best = idx;
      }
    });
    return { ...p, cluster: best };
  });
}

function recomputeCentroids(
  points: Array<Point & { cluster?: number }>,
  centroids: Point[]
) {
  const sums = centroids.map(() => ({ x: 0, y: 0, count: 0 }));

  for (const p of points) {
    if (typeof p.cluster !== "number") continue;
    const bucket = sums[p.cluster];
    bucket.x += p.x;
    bucket.y += p.y;
    bucket.count += 1;
  }

  let changed = false;
  const next = centroids.map((c, idx) => {
    const s = sums[idx];
    if (s.count === 0) return { ...c };
    const nx = s.x / s.count;
    const ny = s.y / s.count;
    if (Math.abs(nx - c.x) > 0.001 || Math.abs(ny - c.y) > 0.001) {
      changed = true;
    }
    return { x: nx, y: ny };
  });

  return { nextCentroids: next, changed };
}

function dist2(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}
