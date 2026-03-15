export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatConversationSummary = {
  id: string;
  title: string;
  pagePath: string | null;
  updatedAt: string | null;
};

export type ChatPageType =
  | "landing"
  | "hub"
  | "section"
  | "algorithm"
  | "data-structure";

export type ChatPageContext = {
  pathname: string;
  pageType?: ChatPageType;
  title?: string;
  description?: string;
  category?: string;
  difficulty?: string;
  time?: string;
  space?: string;
  focusId?: string;
  relatedTopics?: string[];
  suggestedPrompts?: string[];
  liveSummary?: string;
};

export type ChatRequestBody = {
  message: string;
  conversationId?: string;
  history?: ChatMessage[];
  pathname?: string;
  context?: Partial<ChatPageContext>;
};

export type ChatHistoryResponse = {
  conversation: ChatConversationSummary | null;
  messages: ChatMessage[];
  recentConversations: ChatConversationSummary[];
};
