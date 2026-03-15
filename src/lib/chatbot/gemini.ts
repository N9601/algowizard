import {
  findKnowledgeById,
  findKnowledgeByPath,
  findKnowledgeByTitle,
  resolveChatContext,
} from "./catalog";
import { ChatMessage, ChatRequestBody } from "./types";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

type GeminiPart = {
  text: string;
};

type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function generateGeminiReply(body: ChatRequestBody) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing GEMINI_API_KEY. Add it to your .env.local before using the chatbot."
    );
  }

  const context = resolveChatContext(body.pathname, body.context);
  const focusEntry =
    findKnowledgeById(context.focusId) ??
    findKnowledgeByTitle(context.title) ??
    findKnowledgeByPath(context.pathname);
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const contents = buildConversation(body.message, body.history ?? []);

  const response = await fetch(
    `${GEMINI_API_URL}/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: buildSystemInstruction(context, focusEntry),
            },
          ],
        },
        contents,
      }),
      cache: "no-store",
    }
  );

  const data = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message || `Gemini API request failed with status ${response.status}.`
    );
  }

  const reply = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .join("\n")
    .trim();

  if (!reply) {
    throw new Error("Gemini returned an empty response.");
  }

  return {
    context,
    reply,
    model,
  };
}

function buildConversation(message: string, history: ChatMessage[]) {
  const normalizedHistory = history.length
    ? history
    : [
        {
          role: "user" as const,
          content: message,
        },
      ];
  const lastMessage = normalizedHistory[normalizedHistory.length - 1];
  const needsCurrentMessage =
    !lastMessage ||
    lastMessage.role !== "user" ||
    lastMessage.content.trim() !== message.trim();
  const fullHistory = needsCurrentMessage
    ? [...normalizedHistory, { role: "user" as const, content: message }]
    : normalizedHistory;

  return fullHistory.map<GeminiContent>((entry) => ({
    role: entry.role === "assistant" ? "model" : "user",
    parts: [{ text: entry.content }],
  }));
}

function buildSystemInstruction(
  context: ReturnType<typeof resolveChatContext>,
  focusEntry?: ReturnType<typeof findKnowledgeById>
) {
  const relatedTopics = context.relatedTopics?.length
    ? context.relatedTopics.join(", ")
    : "None";
  const suggestedPrompts = context.suggestedPrompts?.length
    ? context.suggestedPrompts.join(" | ")
    : "None";
  const focusSummary = focusEntry
    ? [
        `Focus topic: ${focusEntry.title}`,
        `Focus summary: ${focusEntry.summary}`,
        `When to use: ${focusEntry.whenToUse.join(" ")}`,
        `Watch outs: ${focusEntry.watchOuts.join(" ")}`,
      ].join("\n")
    : "Focus topic: None";

  return [
    "You are AlgoBot, the chatbot inside AlgoWizard, an algorithm visualizer web app.",
    "Keep answers helpful, clear, and concise for students learning algorithms and data structures.",
    "Ground answers in the current page context when relevant.",
    "Do not claim to see a live animation state unless the prompt explicitly provides one.",
    "If the user asks something outside this app, you can still answer briefly, but prefer algorithm and data-structure learning help.",
    "",
    `Current path: ${context.pathname}`,
    `Current title: ${context.title ?? "Unknown"}`,
    `Current description: ${context.description ?? "Unknown"}`,
    `Category: ${context.category ?? "Unknown"}`,
    `Difficulty: ${context.difficulty ?? "Unknown"}`,
    `Time complexity shown on page: ${context.time ?? "Unknown"}`,
    `Space complexity shown on page: ${context.space ?? "Unknown"}`,
    `Related topics on site: ${relatedTopics}`,
    `Suggested follow-up prompts on site: ${suggestedPrompts}`,
    focusSummary,
  ].join("\n");
}
