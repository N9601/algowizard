type Coord = [number, number];

export type PathfindingStep = {
  current: Coord | null;
  frontier: string[];
  visited: string[];
  path: string[];
  walls: string[];
  start: Coord;
  goal: Coord;
  found: boolean;
};

type GridConfig = {
  rows: number;
  cols: number;
  start: Coord;
  goal: Coord;
  walls: Set<string>;
};

function key([r, c]: Coord) {
  return `${r},${c}`;
}

function inBounds([r, c]: Coord, rows: number, cols: number) {
  return r >= 0 && c >= 0 && r < rows && c < cols;
}

const DIRS: Coord[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export function buildBfsSteps(config: GridConfig): PathfindingStep[] {
  const { rows, cols, start, goal, walls } = config;
  const queue: Coord[] = [start];
  const visited = new Set<string>([key(start)]);
  const parents = new Map<string, string>();
  const steps: PathfindingStep[] = [];

  while (queue.length) {
    const current = queue.shift()!;
    const currentKey = key(current);

    steps.push(
      snapshot({
        current,
        frontier: queue,
        visited,
        parents,
        start,
        goal,
        walls,
      })
    );

    if (currentKey === key(goal)) {
      break;
    }

    for (const [dr, dc] of DIRS) {
      const next: Coord = [current[0] + dr, current[1] + dc];
      const k = key(next);
      if (!inBounds(next, rows, cols)) continue;
      if (walls.has(k)) continue;
      if (visited.has(k)) continue;
      visited.add(k);
      parents.set(k, currentKey);
      queue.push(next);
    }
  }

  // Final snapshot to show path reconstruction
  steps.push(
    snapshot({
      current: goal,
      frontier: [],
      visited,
      parents,
      start,
      goal,
      walls,
    })
  );

  return steps;
}

export function buildAStarSteps(config: GridConfig): PathfindingStep[] {
  const { rows, cols, start, goal, walls } = config;
  type Node = { coord: Coord; f: number; g: number };
  const open: Node[] = [{ coord: start, f: heuristic(start, goal), g: 0 }];
  const visited = new Set<string>([key(start)]);
  const parents = new Map<string, string>();
  const gScore = new Map<string, number>([[key(start), 0]]);
  const steps: PathfindingStep[] = [];

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const currentKey = key(current.coord);

    steps.push(
      snapshot({
        current: current.coord,
        frontier: open.map((o) => o.coord),
        visited,
        parents,
        start,
        goal,
        walls,
      })
    );

    if (currentKey === key(goal)) break;

    for (const [dr, dc] of DIRS) {
      const next: Coord = [current.coord[0] + dr, current.coord[1] + dc];
      const k = key(next);
      if (!inBounds(next, rows, cols)) continue;
      if (walls.has(k)) continue;

      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(k) ?? Infinity)) {
        parents.set(k, currentKey);
        gScore.set(k, tentativeG);
        const f = tentativeG + heuristic(next, goal);
        const existing = open.find((n) => key(n.coord) === k);
        if (existing) {
          existing.g = tentativeG;
          existing.f = f;
        } else {
          open.push({ coord: next, f, g: tentativeG });
        }
        visited.add(k);
      }
    }
  }

  steps.push(
    snapshot({
      current: goal,
      frontier: [],
      visited,
      parents,
      start,
      goal,
      walls,
    })
  );

  return steps;
}

export function buildDijkstraSteps(config: GridConfig) {
  // Dijkstra is A* with heuristic = 0
  const zeroHeuristic = () => 0;
  const { rows, cols, start, goal, walls } = config;
  type Node = { coord: Coord; f: number; g: number };
  const open: Node[] = [{ coord: start, f: 0, g: 0 }];
  const visited = new Set<string>([key(start)]);
  const parents = new Map<string, string>();
  const gScore = new Map<string, number>([[key(start), 0]]);
  const steps: PathfindingStep[] = [];

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const currentKey = key(current.coord);

    steps.push(
      snapshot({
        current: current.coord,
        frontier: open.map((o) => o.coord),
        visited,
        parents,
        start,
        goal,
        walls,
      })
    );

    if (currentKey === key(goal)) break;

    for (const [dr, dc] of DIRS) {
      const next: Coord = [current.coord[0] + dr, current.coord[1] + dc];
      const k = key(next);
      if (!inBounds(next, rows, cols)) continue;
      if (walls.has(k)) continue;

      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(k) ?? Infinity)) {
        parents.set(k, currentKey);
        gScore.set(k, tentativeG);
        const f = tentativeG + zeroHeuristic();
        const existing = open.find((n) => key(n.coord) === k);
        if (existing) {
          existing.g = tentativeG;
          existing.f = f;
        } else {
          open.push({ coord: next, f, g: tentativeG });
        }
        visited.add(k);
      }
    }
  }

  steps.push(
    snapshot({
      current: goal,
      frontier: [],
      visited,
      parents,
      start,
      goal,
      walls,
    })
  );

  return steps;
}

function heuristic([r, c]: Coord, [gr, gc]: Coord) {
  return Math.abs(r - gr) + Math.abs(c - gc);
}

function snapshot({
  current,
  frontier,
  visited,
  parents,
  start,
  goal,
  walls,
}: {
  current: Coord | null;
  frontier: Coord[];
  visited: Set<string>;
  parents: Map<string, string>;
  start: Coord;
  goal: Coord;
  walls: Set<string>;
}): PathfindingStep {
  const goalKey = key(goal);
  const path: string[] = [];
  if (visited.has(goalKey)) {
    let cursor: string | undefined = goalKey;
    while (cursor) {
      path.push(cursor);
      cursor = parents.get(cursor);
    }
  }

  return {
    current,
    frontier: frontier.map((c) => key(c)),
    visited: Array.from(visited),
    path,
    walls: Array.from(walls),
    start,
    goal,
    found: visited.has(goalKey),
  };
}
