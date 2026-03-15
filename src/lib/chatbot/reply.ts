import { PSEUDOCODE } from "../education/pseudocode";

import {
  findKnowledgeById,
  findKnowledgeByTitle,
  findKnowledgeInText,
  getRelatedTopicTitles,
  KnowledgeEntry,
  resolveChatContext,
} from "./catalog";
import { ChatMessage, ChatPageContext, ChatRequestBody } from "./types";

type ChatIntent =
  | "capabilities"
  | "current-page"
  | "current-state"
  | "compare"
  | "complexity"
  | "pseudocode"
  | "recommendation"
  | "overview";

export function buildChatReply(body: ChatRequestBody) {
  const message = body.message.trim();
  const context = resolveChatContext(body.pathname, body.context);
  const history = body.history ?? [];
  const { primary, secondary } = resolveFocus(message, history, context);
  const intent = detectIntent(message, primary, secondary);

  return {
    context,
    reply: composeReply(intent, context, primary, secondary),
  };
}

function resolveFocus(
  message: string,
  history: ChatMessage[],
  context: ChatPageContext
) {
  const mentioned = findKnowledgeInText(message);
  const currentFocus =
    findKnowledgeById(context.focusId) ?? findKnowledgeByTitle(context.title);
  const historyText = history
    .slice(-6)
    .map((entry) => entry.content)
    .join(" ");
  const historyMatches = historyText ? findKnowledgeInText(historyText) : [];

  const primary = mentioned[0] ?? currentFocus ?? historyMatches[0];
  let secondary: KnowledgeEntry | undefined = mentioned[1];

  if (!secondary && looksLikeComparison(message) && currentFocus) {
    secondary = primary && primary.id !== currentFocus.id ? currentFocus : undefined;
  }

  if (!secondary && looksLikeComparison(message)) {
    secondary = historyMatches.find((entry) => entry.id !== primary?.id);
  }

  return { primary, secondary };
}

function detectIntent(
  message: string,
  primary?: KnowledgeEntry,
  secondary?: KnowledgeEntry
): ChatIntent {
  const normalized = message.toLowerCase();

  if (
    includesAny(normalized, [
      "what can you do",
      "how can you help",
      "help me",
      "capabilities",
    ])
  ) {
    return "capabilities";
  }

  if (
    includesAny(normalized, [
      "where am i",
      "what page",
      "what am i looking at",
      "current page",
      "context",
    ])
  ) {
    return "current-page";
  }

  if (
    includesAny(normalized, [
      "what's happening",
      "what is happening",
      "current step",
      "current state",
      "what is going on",
    ])
  ) {
    return "current-state";
  }

  if (secondary || looksLikeComparison(normalized)) {
    return "compare";
  }

  if (
    includesAny(normalized, [
      "complexity",
      "big o",
      "runtime",
      "time complexity",
      "space complexity",
      "how fast",
    ])
  ) {
    return "complexity";
  }

  if (includesAny(normalized, ["pseudocode", "pseudo code", "steps in code"])) {
    return "pseudocode";
  }

  if (
    includesAny(normalized, [
      "when should",
      "when do i use",
      "when use",
      "which should",
      "should i learn",
      "start with",
      "better for",
      "use case",
    ])
  ) {
    return "recommendation";
  }

  if (
    primary ||
    includesAny(normalized, [
      "explain",
      "what is",
      "how does",
      "walk me through",
      "overview",
      "summarize",
    ])
  ) {
    return "overview";
  }

  return "capabilities";
}

function composeReply(
  intent: ChatIntent,
  context: ChatPageContext,
  primary?: KnowledgeEntry,
  secondary?: KnowledgeEntry
) {
  switch (intent) {
    case "capabilities":
      return capabilitiesReply(context, primary);
    case "current-page":
      return currentPageReply(context, primary);
    case "current-state":
      return currentStateReply(context, primary);
    case "compare":
      return compareReply(context, primary, secondary);
    case "complexity":
      return complexityReply(context, primary);
    case "pseudocode":
      return pseudocodeReply(context, primary);
    case "recommendation":
      return recommendationReply(context, primary, secondary);
    case "overview":
    default:
      return overviewReply(context, primary);
  }
}

function capabilitiesReply(context: ChatPageContext, primary?: KnowledgeEntry) {
  const pageLine = currentPageReply(context, primary);

  return [
    "I can explain the current algorithm or data structure, compare it with related topics, break down the time and space complexity, summarize the pseudocode, and suggest what to learn next.",
    pageLine,
    `Try asking one of these: ${context.suggestedPrompts?.join(" | ")}`,
  ].join("\n\n");
}

function currentPageReply(context: ChatPageContext, primary?: KnowledgeEntry) {
  const meta = formatMeta(context, primary);
  const related = context.relatedTopics?.length
    ? `Related topics here: ${context.relatedTopics.join(", ")}.`
    : "";

  return [
    `You are on ${context.title} at ${context.pathname}.`,
    context.description,
    meta,
    related,
  ]
    .filter(Boolean)
    .join("\n");
}

function currentStateReply(context: ChatPageContext, primary?: KnowledgeEntry) {
  if (context.liveSummary) {
    return [
      `Current page: ${context.title}.`,
      context.liveSummary,
      primary ? `Topic focus: ${primary.summary}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `I know the current page context for ${context.title}, but I am not yet reading the live animation frame-by-frame.`,
    primary ? `What I can ground on right now: ${primary.summary}` : context.description,
    `If you want, I can still explain the algorithm, its complexity, or compare it with ${context.relatedTopics?.[0] ?? "related topics"}.`,
  ].join("\n\n");
}

function overviewReply(context: ChatPageContext, primary?: KnowledgeEntry) {
  if (!primary) {
    return [
      currentPageReply(context),
      `A good next question here is: ${context.suggestedPrompts?.[0] ?? "What can you help me learn here?"}`,
    ].join("\n\n");
  }

  const related = getRelatedTopicTitles(primary);

  return [
    `${primary.title} is a ${primary.difficulty.toLowerCase()} ${primary.category.toLowerCase()} topic.`,
    primary.summary,
    formatComplexity(primary, context),
    "Best fit:",
    ...primary.whenToUse.map((line) => `- ${line}`),
    "Watch out for:",
    ...primary.watchOuts.map((line) => `- ${line}`),
    related.length ? `Close comparisons: ${related.join(", ")}.` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function complexityReply(context: ChatPageContext, primary?: KnowledgeEntry) {
  if (primary) {
    return [
      formatComplexity(primary, context),
      complexityInterpretation(primary),
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    `This page is ${context.title}.`,
    formatMeta(context),
    "Ask about a specific topic if you want a deeper complexity breakdown.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function pseudocodeReply(context: ChatPageContext, primary?: KnowledgeEntry) {
  if (!primary?.pseudocode) {
    return [
      `I do not have a dedicated pseudocode block for ${context.title}.`,
      primary ? primary.summary : context.description,
    ].join("\n\n");
  }

  return [
    `Here is the pseudocode shape used for ${primary.title}:`,
    ...PSEUDOCODE[primary.pseudocode].map((line) => `  ${line}`),
    `In plain English: ${primary.summary}`,
  ].join("\n");
}

function compareReply(
  context: ChatPageContext,
  primary?: KnowledgeEntry,
  secondary?: KnowledgeEntry
) {
  const first = primary ?? findKnowledgeById(context.focusId);
  const second =
    secondary ??
    context.relatedTopics
      ?.map((title) => findKnowledgeByTitle(title))
      .find((entry) => entry && entry.id !== first?.id);

  if (!first || !second) {
    return [
      `I can compare topics on this page, but I need two concrete subjects.`,
      `Try one of these: ${context.suggestedPrompts?.join(" | ")}`,
    ].join("\n\n");
  }

  return [
    `${first.title} vs ${second.title}`,
    `- Best fit for ${first.title}: ${first.whenToUse[0]}`,
    `- Best fit for ${second.title}: ${second.whenToUse[0]}`,
    `- Complexity: ${first.title} is ${first.time ?? "not listed"} time and ${first.space ?? "not listed"} space; ${second.title} is ${second.time ?? "not listed"} time and ${second.space ?? "not listed"} space.`,
    `- Main tradeoff: ${first.watchOuts[0]} ${second.watchOuts[0]}`,
  ].join("\n");
}

function recommendationReply(
  context: ChatPageContext,
  primary?: KnowledgeEntry,
  secondary?: KnowledgeEntry
) {
  if (primary) {
    const alternative =
      secondary ??
      getRelatedTopicTitles(primary)
        .map((title) => findKnowledgeByTitle(title))
        .find(Boolean);

    return [
      `Use ${primary.title} when:`,
      ...primary.whenToUse.map((line) => `- ${line}`),
      alternative
        ? `If you need a nearby alternative, compare it with ${alternative.title}.`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  switch (context.pathname) {
    case "/visualizer/sorting":
      return [
        "A solid learning path here is Bubble Sort or Insertion Sort first, then Merge Sort and Quick Sort, and finally Heap Sort.",
        "That order usually makes the visualizer easier to absorb because it moves from local swaps to divide-and-conquer and heap-based structure.",
      ].join("\n\n");
    case "/visualizer/searching":
      return [
        "Start with Linear Search, then move to Binary Search.",
        "That sequence makes the key Binary Search assumption obvious: sorted data lets you remove half the search space at each step.",
      ].join("\n\n");
    case "/visualizer/graph":
      return [
        "Start with DFS and BFS, then move to Dijkstra, Topological Sort, and Bellman-Ford.",
        "That path builds intuition from traversal first, then adds weighting, ordering, and negative-edge cases.",
      ].join("\n\n");
    case "/visualizer/datastructures":
      return [
        "Start with Stack and Queue, then Linked List, then Binary Tree and Heap.",
        "That path moves from linear access patterns to pointer-based and hierarchical structures.",
      ].join("\n\n");
    default:
      return [
        "A good place to start is the visualizer hub, then pick one easy topic from sorting or searching.",
        "Bubble Sort, Linear Search, and Stack are the gentlest first pages in this project.",
      ].join("\n\n");
  }
}

function formatComplexity(primary: KnowledgeEntry, context: ChatPageContext) {
  const time = context.focusId === primary.id ? context.time ?? primary.time : primary.time;
  const space =
    context.focusId === primary.id ? context.space ?? primary.space : primary.space;

  if (!time && !space) {
    return `I do not have a complexity listing for ${primary.title}.`;
  }

  return `${primary.title} is listed here as time ${time ?? "not listed"} and space ${space ?? "not listed"}.`;
}

function complexityInterpretation(primary: KnowledgeEntry) {
  switch (primary.id) {
    case "binary-search":
      return "That logarithmic time comes from cutting the remaining search interval in half each step.";
    case "linear-search":
      return "That linear time means performance grows directly with the number of elements you may need to inspect.";
    case "merge-sort":
    case "quick-sort":
    case "heap-sort":
      return "Those are the faster comparison-based sorts in this project, with much better scaling than the quadratic beginner sorts.";
    case "bubble-sort":
    case "selection-sort":
    case "insertion-sort":
      return "That quadratic time is why these are best for learning or small inputs rather than large datasets.";
    case "dfs":
    case "bfs":
    case "topological-sort":
      return "That O(V + E) cost reflects touching each vertex and edge a bounded number of times.";
    case "dijkstra":
      return "This page uses the simpler O(V^2) version, which is easier to visualize than the heap-optimized variant.";
    case "bellman-ford":
      return "The extra cost comes from repeatedly relaxing every edge to support negative weights.";
    default:
      return "";
  }
}

function formatMeta(context: ChatPageContext, primary?: KnowledgeEntry) {
  const parts = [
    context.category ?? primary?.category,
    context.difficulty ?? primary?.difficulty,
    context.time ? `time ${context.time}` : primary?.time ? `time ${primary.time}` : "",
    context.space
      ? `space ${context.space}`
      : primary?.space
        ? `space ${primary.space}`
        : "",
  ].filter(Boolean);

  return parts.length ? `Details: ${parts.join(" | ")}.` : "";
}

function looksLikeComparison(value: string) {
  return includesAny(value.toLowerCase(), [
    " vs ",
    "versus",
    "compare",
    "difference",
    "better than",
  ]);
}

function includesAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}
