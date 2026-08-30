import type {
  ChatMessage,
  ChatPageContext,
  ChatPageType,
  ChatRequestBody,
} from "./types";

export const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 10;
const MAX_HISTORY_CONTENT_LENGTH = 4000;
const MAX_CONTEXT_TEXT_LENGTH = 500;
const MAX_CONTEXT_LIST_ITEMS = 12;

const CONTEXT_TEXT_FIELDS = [
  "pathname",
  "title",
  "description",
  "category",
  "difficulty",
  "time",
  "space",
  "focusId",
  "liveSummary",
] as const;

const CONTEXT_LIST_FIELDS = ["relatedTopics", "suggestedPrompts"] as const;

const PAGE_TYPES = new Set<ChatPageType>([
  "landing",
  "hub",
  "section",
  "algorithm",
  "data-structure",
]);

export type ParsedChatRequest =
  | { ok: true; body: ChatRequestBody }
  | { ok: false; reply: string };

/**
 * Validates an untrusted /api/chat request body. The route forwards the
 * message, history and page context to Gemini, so every field is type
 * checked and size capped here before it can reach the model or the database.
 */
export function parseChatRequest(raw: unknown): ParsedChatRequest {
  if (!isRecord(raw)) {
    return { ok: false, reply: "Invalid chat request." };
  }

  const message = typeof raw.message === "string" ? raw.message.trim() : "";

  if (!message) {
    return {
      ok: false,
      reply: "Ask me about the current page, an algorithm, or a data structure.",
    };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      reply: `Please keep questions under ${MAX_MESSAGE_LENGTH} characters.`,
    };
  }

  return {
    ok: true,
    body: {
      message,
      conversationId:
        typeof raw.conversationId === "string" ? raw.conversationId : undefined,
      pathname:
        typeof raw.pathname === "string"
          ? raw.pathname.slice(0, MAX_CONTEXT_TEXT_LENGTH)
          : undefined,
      history: sanitizeHistory(raw.history),
      context: sanitizeContext(raw.context),
    },
  };
}

function sanitizeHistory(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (entry): entry is ChatMessage =>
        isRecord(entry) &&
        (entry.role === "user" || entry.role === "assistant") &&
        typeof entry.content === "string"
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((entry) => ({
      role: entry.role,
      content: entry.content.slice(0, MAX_HISTORY_CONTENT_LENGTH),
    }));
}

function sanitizeContext(value: unknown): Partial<ChatPageContext> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const context: Partial<ChatPageContext> = {};

  for (const field of CONTEXT_TEXT_FIELDS) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string") {
      context[field] = fieldValue.slice(0, MAX_CONTEXT_TEXT_LENGTH);
    }
  }

  for (const field of CONTEXT_LIST_FIELDS) {
    const fieldValue = value[field];
    if (Array.isArray(fieldValue)) {
      context[field] = fieldValue
        .filter((item): item is string => typeof item === "string")
        .slice(0, MAX_CONTEXT_LIST_ITEMS)
        .map((item) => item.slice(0, MAX_CONTEXT_TEXT_LENGTH));
    }
  }

  if (
    typeof value.pageType === "string" &&
    PAGE_TYPES.has(value.pageType as ChatPageType)
  ) {
    context.pageType = value.pageType as ChatPageType;
  }

  return context;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
