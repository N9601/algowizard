export type WeightedNode = {
  id: number;
  x: number;
  y: number;
};

export type WeightedEdge = {
  from: number;
  to: number;
  weight: number;
};

export type WeightedGraph = {
  nodes: WeightedNode[];
  edges: WeightedEdge[];
  adjacencyList: Record<number, { to: number; weight: number }[]>;
  start: number;
};
