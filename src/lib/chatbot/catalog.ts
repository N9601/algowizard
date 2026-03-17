import { AlgorithmType } from "../education/pseudocode";
import { ChatPageContext } from "./types";

export type KnowledgeEntry = {
  id: string;
  pathname: string;
  kind: "algorithm" | "data-structure";
  title: string;
  category: string;
  difficulty: string;
  time?: string;
  space?: string;
  summary: string;
  aliases: string[];
  whenToUse: string[];
  watchOuts: string[];
  related: string[];
  pseudocode?: AlgorithmType;
};

type RouteContext = Omit<ChatPageContext, "pathname">;

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: "bubble-sort",
    pathname: "/visualizer/sorting/bubble-sort",
    kind: "algorithm",
    title: "Bubble Sort",
    category: "Sorting",
    difficulty: "Easy",
    time: "O(n^2)",
    space: "O(1)",
    summary:
      "Bubble Sort repeatedly compares adjacent values and swaps them when they are out of order, so large values drift toward the end over multiple passes.",
    aliases: ["bubble sort", "bubble"],
    whenToUse: [
      "Use it when the goal is to learn sorting mechanics or visualize swaps clearly.",
      "Use it for very small or nearly sorted lists where simplicity matters more than speed.",
    ],
    watchOuts: [
      "It scales poorly on larger inputs because it does many repeated comparisons.",
      "It is mainly educational rather than a practical default for production sorting.",
    ],
    related: ["selection-sort", "insertion-sort"],
    pseudocode: "bubble",
  },
  {
    id: "selection-sort",
    pathname: "/visualizer/sorting/selection-sort",
    kind: "algorithm",
    title: "Selection Sort",
    category: "Sorting",
    difficulty: "Easy",
    time: "O(n^2)",
    space: "O(1)",
    summary:
      "Selection Sort grows a sorted prefix by scanning the remaining array, finding the minimum element, and swapping it into place.",
    aliases: ["selection sort", "selection"],
    whenToUse: [
      "Use it when minimizing the number of swaps matters more than minimizing comparisons.",
      "Use it as a teaching tool for the idea of selecting the next best element.",
    ],
    watchOuts: [
      "It still performs O(n^2) comparisons even if the array is almost sorted.",
      "It is usually slower than O(n log n) methods on medium and large inputs.",
    ],
    related: ["bubble-sort", "insertion-sort"],
    pseudocode: "selection",
  },
  {
    id: "insertion-sort",
    pathname: "/visualizer/sorting/insertion-sort",
    kind: "algorithm",
    title: "Insertion Sort",
    category: "Sorting",
    difficulty: "Easy",
    time: "O(n^2)",
    space: "O(1)",
    summary:
      "Insertion Sort builds a sorted region one item at a time by inserting each new value into the correct place among the already processed elements.",
    aliases: ["insertion sort", "insertion"],
    whenToUse: [
      "Use it for small arrays or nearly sorted data where it performs very well in practice.",
      "Use it when you want a simple in-place sort that is stable and easy to step through.",
    ],
    watchOuts: [
      "Worst-case behavior is still quadratic, so it does not scale well.",
      "Repeated shifting becomes expensive on long unsorted arrays.",
    ],
    related: ["bubble-sort", "merge-sort"],
    pseudocode: "insertion",
  },
  {
    id: "merge-sort",
    pathname: "/visualizer/sorting/merge-sort",
    kind: "algorithm",
    title: "Merge Sort",
    category: "Sorting",
    difficulty: "Medium",
    time: "O(n log n)",
    space: "O(n)",
    summary:
      "Merge Sort divides the array into halves, sorts each half recursively, and then merges the sorted halves back together.",
    aliases: ["merge sort", "merge"],
    whenToUse: [
      "Use it when you want reliable O(n log n) performance regardless of input shape.",
      "Use it when stable ordering matters and extra memory is acceptable.",
    ],
    watchOuts: [
      "It needs additional memory for merging, unlike in-place sorts such as Heap Sort.",
      "The recursive structure can feel less intuitive than the simple quadratic sorts.",
    ],
    related: ["quick-sort", "heap-sort"],
    pseudocode: "merge",
  },
  {
    id: "quick-sort",
    pathname: "/visualizer/sorting/quick-sort",
    kind: "algorithm",
    title: "Quick Sort",
    category: "Sorting",
    difficulty: "Medium",
    time: "O(n log n)",
    space: "O(log n)",
    summary:
      "Quick Sort chooses a pivot, partitions the array around it, and recursively sorts the left and right partitions.",
    aliases: ["quick sort", "quicksort", "quick"],
    whenToUse: [
      "Use it when you want a fast general-purpose in-place sort on average.",
      "Use it to teach partitioning and divide-and-conquer ideas.",
    ],
    watchOuts: [
      "Poor pivot choices can degrade it toward quadratic time.",
      "It is not stable by default, so equal elements may reorder.",
    ],
    related: ["merge-sort", "heap-sort"],
    pseudocode: "quick",
  },
  {
    id: "heap-sort",
    pathname: "/visualizer/sorting/heap-sort",
    kind: "algorithm",
    title: "Heap Sort",
    category: "Sorting",
    difficulty: "Hard",
    time: "O(n log n)",
    space: "O(1)",
    summary:
      "Heap Sort builds a max heap, repeatedly removes the largest value, and places it at the end of the array.",
    aliases: ["heap sort", "heapsort"],
    whenToUse: [
      "Use it when you need O(n log n) worst-case time and want an in-place sort.",
      "Use it when you want to connect heap operations to sorting behavior.",
    ],
    watchOuts: [
      "Its control flow is harder to reason about than Merge Sort or Quick Sort.",
      "Even though it is efficient, it often has weaker cache behavior than Quick Sort.",
    ],
    related: ["heap-structure", "quick-sort"],
    pseudocode: "heap",
  },
  {
    id: "linear-search",
    pathname: "/visualizer/searching/linear-search",
    kind: "algorithm",
    title: "Linear Search",
    category: "Searching",
    difficulty: "Easy",
    time: "O(n)",
    space: "O(1)",
    summary:
      "Linear Search checks each element in sequence until the target is found or the list ends.",
    aliases: ["linear search", "linear"],
    whenToUse: [
      "Use it on unsorted data or when the dataset is small enough that setup costs matter more than asymptotic speed.",
      "Use it when you only need a simple single pass through the data.",
    ],
    watchOuts: [
      "It becomes slow on large lists because it may inspect every element.",
      "It does not take advantage of sorted order the way Binary Search does.",
    ],
    related: ["binary-search"],
    pseudocode: "linear",
  },
  {
    id: "binary-search",
    pathname: "/visualizer/searching/binary-search",
    kind: "algorithm",
    title: "Binary Search",
    category: "Searching",
    difficulty: "Easy",
    time: "O(log n)",
    space: "O(1)",
    summary:
      "Binary Search repeatedly halves the remaining search interval, which makes it much faster than scanning every value.",
    aliases: ["binary search", "binary"],
    whenToUse: [
      "Use it when the data is already sorted and you need fast lookups.",
      "Use it to show how divide-and-conquer shrinks a problem rapidly.",
    ],
    watchOuts: [
      "It only works correctly when the input is sorted in the expected order.",
      "Index and boundary mistakes are common when implementing it manually.",
    ],
    related: ["linear-search"],
    pseudocode: "binary",
  },
  {
    id: "dfs",
    pathname: "/visualizer/graph/dfs",
    kind: "algorithm",
    title: "Depth-First Search",
    category: "Graph",
    difficulty: "Medium",
    time: "O(V + E)",
    space: "O(V)",
    summary:
      "Depth-First Search explores one path as far as it can before backtracking, which makes it useful for structure-heavy graph problems.",
    aliases: ["depth first search", "dfs"],
    whenToUse: [
      "Use it for path exploration, connected components, cycle detection, and tree-like traversals.",
      "Use it when you want to follow a branch deeply before considering siblings.",
    ],
    watchOuts: [
      "Traversal order depends on neighbor ordering, so the exact visit sequence can vary.",
      "Deep recursion can overflow the call stack unless you use an explicit stack.",
    ],
    related: ["bfs", "topological-sort"],
    pseudocode: "dfs",
  },
  {
    id: "bfs",
    pathname: "/visualizer/graph/bfs",
    kind: "algorithm",
    title: "Breadth-First Search",
    category: "Graph",
    difficulty: "Medium",
    time: "O(V + E)",
    space: "O(V)",
    summary:
      "Breadth-First Search visits nodes level by level using a queue, which makes it ideal for shortest paths in unweighted graphs.",
    aliases: ["breadth first search", "bfs"],
    whenToUse: [
      "Use it when you want the minimum number of edges from a start node in an unweighted graph.",
      "Use it when level order and frontier expansion matter.",
    ],
    watchOuts: [
      "It can use significant memory because it stores an entire frontier.",
      "It is not a weighted shortest-path algorithm, so it is not a drop-in replacement for Dijkstra.",
    ],
    related: ["dfs", "dijkstra"],
    pseudocode: "bfs",
  },
  {
    id: "dijkstra",
    pathname: "/visualizer/graph/dijkstra",
    kind: "algorithm",
    title: "Dijkstra's Algorithm",
    category: "Graph",
    difficulty: "Hard",
    time: "O(V^2)",
    space: "O(V)",
    summary:
      "Dijkstra's Algorithm grows shortest-path estimates outward from a source node and repeatedly finalizes the cheapest unsettled node.",
    aliases: [
      "dijkstra",
      "dijkstra's algorithm",
      "dijkstras algorithm",
      "dijkstra algorithm",
    ],
    whenToUse: [
      "Use it for shortest paths in graphs with non-negative edge weights.",
      "Use it when you need the cost from one source to every reachable node.",
    ],
    watchOuts: [
      "It does not handle negative edge weights correctly.",
      "Implementation details matter because the priority structure affects performance.",
    ],
    related: ["bellman-ford", "bfs"],
    pseudocode: "dijkstra",
  },
  {
    id: "topological-sort",
    pathname: "/visualizer/graph/topological",
    kind: "algorithm",
    title: "Topological Sort",
    category: "Graph",
    difficulty: "Hard",
    time: "O(V + E)",
    space: "O(V)",
    summary:
      "Topological Sort produces a valid linear ordering of nodes in a directed acyclic graph so every prerequisite appears before what depends on it.",
    aliases: ["topological sort", "topological", "kahn's algorithm", "kahn"],
    whenToUse: [
      "Use it for dependency resolution, build ordering, and scheduling tasks with prerequisites.",
      "Use it when the graph is directed and acyclic.",
    ],
    watchOuts: [
      "It is only defined on directed acyclic graphs.",
      "If a cycle exists, there is no valid topological ordering.",
    ],
    related: ["dfs", "bellman-ford"],
    pseudocode: "topological",
  },
  {
    id: "bellman-ford",
    pathname: "/visualizer/graph/bellman-ford",
    kind: "algorithm",
    title: "Bellman-Ford Algorithm",
    category: "Graph",
    difficulty: "Hard",
    time: "O(V * E)",
    space: "O(V)",
    summary:
      "Bellman-Ford relaxes every edge repeatedly, which lets it compute shortest paths even when negative edges are present.",
    aliases: ["bellman ford", "bellman-ford", "bellman-ford algorithm"],
    whenToUse: [
      "Use it when negative edge weights may appear.",
      "Use it when you need to detect reachable negative cycles.",
    ],
    watchOuts: [
      "It is slower than Dijkstra on graphs without negative weights.",
      "Negative cycles mean shortest paths are not well-defined.",
    ],
    related: ["dijkstra", "topological-sort"],
    pseudocode: "bellman-ford",
  },
  {
    id: "stack",
    pathname: "/visualizer/datastructures/stack",
    kind: "data-structure",
    title: "Stack",
    category: "Data Structure",
    difficulty: "Easy",
    time: "O(1)",
    space: "O(n)",
    summary:
      "A stack stores items in last-in, first-out order so the most recently pushed value is the next one removed.",
    aliases: ["stack", "stack data structure"],
    whenToUse: [
      "Use it for undo behavior, recursion simulation, expression evaluation, and DFS-style traversal.",
      "Use it when the newest item should be handled first.",
    ],
    watchOuts: [
      "Stacks only expose the top efficiently, so random access is not their strength.",
      "Overflow or fixed-capacity limits matter in bounded implementations.",
    ],
    related: ["queue", "dfs"],
  },
  {
    id: "queue",
    pathname: "/visualizer/datastructures/queue",
    kind: "data-structure",
    title: "Queue",
    category: "Data Structure",
    difficulty: "Easy",
    time: "O(1)",
    space: "O(n)",
    summary:
      "A queue stores items in first-in, first-out order so the oldest enqueued value is processed first.",
    aliases: ["queue", "queue data structure"],
    whenToUse: [
      "Use it for scheduling, buffering, BFS, and systems where work must be handled in arrival order.",
      "Use it when fairness and level-order processing matter.",
    ],
    watchOuts: [
      "A poor array-based implementation can make dequeues expensive.",
      "Queues are not a fit when the newest item should take priority.",
    ],
    related: ["stack", "bfs"],
  },
  {
    id: "linked-list",
    pathname: "/visualizer/datastructures/linked-list",
    kind: "data-structure",
    title: "Linked List",
    category: "Data Structure",
    difficulty: "Medium",
    time: "O(n)",
    space: "O(n)",
    summary:
      "A linked list stores data in nodes connected by pointers, which makes insertion and deletion flexible once you have the right position.",
    aliases: ["linked list", "linked-list", "list node"],
    whenToUse: [
      "Use it when frequent insertions or deletions in the middle matter more than random access.",
      "Use it to teach pointer-based structure and dynamic memory links.",
    ],
    watchOuts: [
      "Finding an element still takes linear time because nodes are not index-addressable.",
      "Extra pointer storage adds overhead compared with arrays.",
    ],
    related: ["stack", "queue"],
  },
  {
    id: "binary-tree",
    pathname: "/visualizer/datastructures/tree",
    kind: "data-structure",
    title: "Binary Tree",
    category: "Data Structure",
    difficulty: "Medium",
    time: "O(n)",
    space: "O(n)",
    summary:
      "A binary tree organizes nodes hierarchically and allows each node to have at most two children, which makes recursive reasoning natural.",
    aliases: ["binary tree", "tree", "tree data structure"],
    whenToUse: [
      "Use it for hierarchical data and recursive traversal concepts.",
      "Use it as the foundation for structures like heaps and binary search trees.",
    ],
    watchOuts: [
      "General binary trees do not guarantee balanced height or fast lookup on their own.",
      "Traversal order changes the meaning of what you see in the tree.",
    ],
    related: ["heap-structure", "dfs"],
  },
  {
    id: "heap-structure",
    pathname: "/visualizer/datastructures/heap",
    kind: "data-structure",
    title: "Heap",
    category: "Data Structure",
    difficulty: "Medium",
    time: "O(log n)",
    space: "O(n)",
    summary:
      "A heap is a partially ordered binary tree that gives fast access to the smallest or largest element, which makes it useful for priority queues.",
    aliases: ["heap", "binary heap", "heap data structure"],
    whenToUse: [
      "Use it when you repeatedly need the next highest-priority item.",
      "Use it to support priority queues and algorithms like Heap Sort.",
    ],
    watchOuts: [
      "A heap is not globally sorted, so only the root has guaranteed priority order.",
      "Arbitrary searches are still inefficient compared with balanced search trees.",
    ],
    related: ["heap-sort", "binary-tree"],
  },
  {
    id: "a-star",
    pathname: "/visualizer/pathfinding/a-star",
    kind: "algorithm",
    title: "A* Pathfinding",
    category: "Graph",
    difficulty: "Medium",
    time: "O(E)",
    space: "O(V)",
    summary:
      "A* finds a path by combining distance traveled with a heuristic to expand the most promising grid cell first.",
    aliases: ["a star", "a*"],
    whenToUse: [
      "Use it for shortest paths on weighted or unweighted grids when a good heuristic is available.",
    ],
    watchOuts: [
      "Needs an admissible heuristic to guarantee optimality.",
      "Heuristic that overestimates can return non-optimal paths.",
    ],
    related: ["bfs-grid", "dijkstra"],
  },
  {
    id: "bfs-grid",
    pathname: "/visualizer/pathfinding/bfs",
    kind: "algorithm",
    title: "Breadth-First Search (Grid)",
    category: "Graph",
    difficulty: "Easy",
    time: "O(E)",
    space: "O(V)",
    summary:
      "BFS explores the grid level by level and returns the shortest unweighted path from start to goal.",
    aliases: ["bfs pathfinding", "breadth first grid"],
    whenToUse: [
      "Use it for shortest paths on unweighted grids or when heuristics are not available.",
    ],
    watchOuts: [
      "Explores broadly, so it can be slower than heuristic-guided search.",
      "Walls and large open areas increase frontier size.",
    ],
    related: ["a-star", "dijkstra"],
  },
  {
    id: "k-means",
    pathname: "/visualizer/ml/k-means",
    kind: "algorithm",
    title: "k-Means Clustering",
    category: "Machine Learning",
    difficulty: "Easy",
    time: "O(n k T)",
    space: "O(n + k)",
    summary:
      "k-Means alternates between assigning points to the nearest centroid and recomputing centroids until positions stabilize.",
    aliases: ["kmeans", "k means", "clustering"],
    whenToUse: [
      "Use it to find spherical clusters in continuous data.",
      "Use it when you want a fast, simple unsupervised baseline.",
    ],
    watchOuts: [
      "Sensitive to initialization; can converge to local minima.",
      "Assumes roughly equal-size clusters; not good for complex shapes.",
    ],
    related: ["gradient-descent", "neural-network"],
  },
  {
    id: "gradient-descent",
    pathname: "/visualizer/ml/gradient-descent",
    kind: "algorithm",
    title: "Gradient Descent",
    category: "Machine Learning",
    difficulty: "Easy",
    time: "O(T)",
    space: "O(1)",
    summary:
      "Gradient Descent steps downhill on a differentiable loss surface using the learning rate to scale each move.",
    aliases: ["gd", "gradient descent"],
    whenToUse: [
      "Use it to optimize smooth losses in ML models.",
      "Use it to illustrate how learning rate affects convergence.",
    ],
    watchOuts: [
      "Too large learning rate can diverge; too small can stall.",
      "Local minima and saddle points can slow or trap progress.",
    ],
    related: ["k-means", "neural-network"],
  },
  {
    id: "neural-network",
    pathname: "/visualizer/ml/neural-network",
    kind: "algorithm",
    title: "Neural Network (2-layer)",
    category: "Machine Learning",
    difficulty: "Medium",
    summary:
      "A small two-layer feedforward network that classifies 2D points; shows activations and how training shifts the decision boundary.",
    aliases: ["nn", "mlp", "two-layer network"],
    whenToUse: [
      "Use it to demonstrate nonlinear decision boundaries.",
      "Use it to connect gradient updates to classification changes.",
    ],
    watchOuts: [
      "Random init plus tiny dataset can overfit or flip decisions quickly.",
      "Learning rate still controls stability of updates.",
    ],
    related: ["gradient-descent", "k-means"],
  },
];

export const ROUTE_CONTEXT: Record<string, RouteContext> = {
  "/": {
    pageType: "landing",
    title: "AlgoWizard Home",
    description:
      "This is the landing page for AlgoWizard, an interactive visualizer for sorting, searching, graph algorithms, and data structures.",
    relatedTopics: [
      "Sorting Algorithms",
      "Searching Algorithms",
      "Graph Algorithms",
      "Data Structures",
    ],
  },
  "/visualizer": {
    pageType: "hub",
    title: "Algorithm Visualizer",
    description:
      "This page is the main hub that links to sorting, searching, graph algorithms, and data structure visualizations.",
    relatedTopics: [
      "Bubble Sort",
      "Binary Search",
      "Depth-First Search",
      "Stack",
    ],
  },
  "/visualizer/sorting": {
    pageType: "section",
    title: "Sorting Algorithms",
    description:
      "This section focuses on how different sorting strategies rearrange values and trade off simplicity, memory use, and runtime.",
    category: "Sorting",
    relatedTopics: [
      "Bubble Sort",
      "Selection Sort",
      "Insertion Sort",
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
    ],
  },
  "/visualizer/compare": {
    pageType: "section",
    title: "Compare Mode",
    description:
      "This page compares two sorting algorithms side by side on the same input so you can see how their decisions diverge step by step.",
    category: "Sorting",
    relatedTopics: [
      "Bubble Sort",
      "Selection Sort",
      "Insertion Sort",
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
    ],
  },
  "/visualizer/searching": {
    pageType: "section",
    title: "Searching Algorithms",
    description:
      "This section focuses on how to locate values efficiently in sorted and unsorted collections.",
    category: "Searching",
    relatedTopics: ["Linear Search", "Binary Search"],
  },
  "/visualizer/graph": {
    pageType: "section",
    title: "Graph Algorithms",
    description:
      "This section covers traversal, ordering, and shortest-path techniques for graph structures.",
    category: "Graph",
    relatedTopics: [
      "Depth-First Search",
      "Breadth-First Search",
      "Dijkstra's Algorithm",
      "Topological Sort",
      "Bellman-Ford Algorithm",
    ],
  },
  "/visualizer/datastructures": {
    pageType: "section",
    title: "Data Structures",
    description:
      "This section introduces foundational structures for storing, organizing, and traversing data efficiently.",
    category: "Data Structure",
    relatedTopics: ["Stack", "Queue", "Linked List", "Binary Tree", "Heap"],
  },
  "/visualizer/pathfinding": {
    pageType: "section",
    title: "Pathfinding",
    description:
      "This section shows how grid-based searches explore frontiers and reconstruct shortest paths.",
    category: "Graph",
    relatedTopics: ["A* Pathfinding", "Breadth-First Search"],
  },
  "/visualizer/ml": {
    pageType: "section",
    title: "Machine Learning",
    description:
      "This section visualizes clustering, optimization, and a tiny neural network on 2D points.",
    category: "Machine Learning",
    relatedTopics: ["k-Means Clustering", "Gradient Descent", "Neural Network"],
  },
};

const knowledgeById = new Map(KNOWLEDGE_BASE.map((entry) => [entry.id, entry]));
const knowledgeByPath = new Map(
  KNOWLEDGE_BASE.map((entry) => [entry.pathname, entry])
);

const aliasIndex = KNOWLEDGE_BASE.flatMap((entry) =>
  [entry.title, entry.id, ...entry.aliases]
    .map((alias) => normalizeLookup(alias))
    .filter(Boolean)
    .map((alias) => ({ alias, id: entry.id }))
);

export function normalizeLookup(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findKnowledgeById(id?: string) {
  if (!id) return undefined;
  return knowledgeById.get(id);
}

export function findKnowledgeByPath(pathname?: string) {
  if (!pathname) return undefined;
  return knowledgeByPath.get(pathname);
}

export function findKnowledgeByTitle(title?: string) {
  if (!title) return undefined;

  const normalizedTitle = normalizeLookup(title);
  const match = aliasIndex.find(({ alias }) => alias === normalizedTitle);

  return match ? knowledgeById.get(match.id) : undefined;
}

export function findKnowledgeInText(text: string) {
  const normalizedText = ` ${normalizeLookup(text)} `;
  const matches: KnowledgeEntry[] = [];
  const seen = new Set<string>();

  for (const { alias, id } of aliasIndex.sort((a, b) => b.alias.length - a.alias.length)) {
    if (!alias || seen.has(id)) {
      continue;
    }

    const paddedAlias = ` ${alias} `;

    if (normalizedText.includes(paddedAlias)) {
      seen.add(id);
      const entry = knowledgeById.get(id);
      if (entry) {
        matches.push(entry);
      }
    }
  }

  return matches;
}

export function getRelatedTopicTitles(entry?: KnowledgeEntry) {
  if (!entry) return [];

  return entry.related
    .map((id) => knowledgeById.get(id)?.title)
    .filter((title): title is string => Boolean(title));
}

export function buildSuggestedPrompts(
  context: ChatPageContext,
  focusEntry?: KnowledgeEntry
) {
  if (focusEntry) {
    const relatedTitle = getRelatedTopicTitles(focusEntry)[0];

    if (focusEntry.kind === "algorithm") {
      return [
        `Explain ${focusEntry.title} in simple terms`,
        `What are the time and space complexities of ${focusEntry.title}?`,
        relatedTitle
          ? `When would I choose ${focusEntry.title} over ${relatedTitle}?`
          : `When should I use ${focusEntry.title}?`,
      ];
    }

    return [
      `Explain ${focusEntry.title} in simple terms`,
      `What operations are most important in ${focusEntry.title}?`,
      relatedTitle
        ? `How is ${focusEntry.title} different from ${relatedTitle}?`
        : `When should I use ${focusEntry.title}?`,
    ];
  }

  switch (context.pathname) {
    case "/visualizer/sorting":
      return [
        "Which sorting algorithm should I learn first?",
        "Compare Bubble Sort and Merge Sort",
        "Why does Quick Sort often perform well?",
      ];
    case "/visualizer/compare":
      return [
        "What should I compare first here?",
        "Compare Bubble Sort and Quick Sort",
        "Why do these two algorithms finish at different speeds?",
      ];
    case "/visualizer/searching":
      return [
        "When should I use Binary Search instead of Linear Search?",
        "Why does Binary Search need sorted data?",
        "Which searching algorithm is easier to learn first?",
      ];
    case "/visualizer/graph":
      return [
        "What is the difference between BFS and DFS?",
        "When should I use Dijkstra instead of Bellman-Ford?",
        "What makes Topological Sort special?",
      ];
    case "/visualizer/datastructures":
      return [
        "What data structure should I start with here?",
        "How is a Stack different from a Queue?",
        "What is a Heap used for?",
      ];
    default:
      return [
        "What can you help me learn here?",
        "Which topic should I open first?",
        "Compare two algorithms for me",
      ];
  }
}

export function resolveChatContext(
  pathname = "/",
  context?: Partial<ChatPageContext>
): ChatPageContext {
  const basePath = pathname || context?.pathname || "/";
  const routeContext = ROUTE_CONTEXT[basePath];
  const focusEntry =
    findKnowledgeById(context?.focusId) ??
    findKnowledgeByTitle(context?.title) ??
    findKnowledgeByPath(basePath);

  const merged: ChatPageContext = {
    ...routeContext,
    ...context,
    pathname: basePath,
  };

  if (focusEntry) {
    merged.pageType = focusEntry.kind === "algorithm" ? "algorithm" : "data-structure";
    merged.focusId = focusEntry.id;
    merged.title = merged.title ?? focusEntry.title;
    merged.description = merged.description ?? focusEntry.summary;
    merged.category = merged.category ?? focusEntry.category;
    merged.difficulty = merged.difficulty ?? focusEntry.difficulty;
    merged.time = merged.time ?? focusEntry.time;
    merged.space = merged.space ?? focusEntry.space;
    merged.relatedTopics = uniqueStrings([
      ...(merged.relatedTopics ?? []),
      ...getRelatedTopicTitles(focusEntry),
    ]);
  } else {
    merged.relatedTopics = uniqueStrings(merged.relatedTopics ?? []);
  }

  merged.title = merged.title ?? "AlgoWizard";
  merged.description =
    merged.description ??
    "AlgoWizard helps explain algorithms and data structures through interactive visualizations.";
  merged.suggestedPrompts = uniqueStrings(
    merged.suggestedPrompts?.length
      ? merged.suggestedPrompts
      : buildSuggestedPrompts(merged, focusEntry)
  );

  if (!merged.pageType) {
    merged.pageType = basePath === "/" ? "landing" : "section";
  }

  return merged;
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}
