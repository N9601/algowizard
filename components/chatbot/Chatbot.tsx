"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { resolveChatContext } from "../../src/lib/chatbot/catalog";
import {
  ChatConversationSummary,
  ChatHistoryResponse,
  ChatMessage,
} from "../../src/lib/chatbot/types";
import { createClient as createSupabaseClient } from "../../src/lib/supabase/client";
import { hasSupabaseEnv } from "../../src/lib/supabase/env";
import { useChatbotPageContext } from "./ChatbotProvider";

const MAX_HISTORY = 10;
const isSupabaseConfigured = hasSupabaseEnv();

function formatConversationDate(value: string | null) {
  if (!value) {
    return "Saved";
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "Saved";
  }
}

export default function Chatbot() {
  const pathname = usePathname();
  const { pageContext } = useChatbotPageContext();
  const context = resolveChatContext(pathname, pageContext ?? undefined);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recentConversations, setRecentConversations] = useState<
    ChatConversationSummary[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState<
    string | null
  >(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const restoreRequestRef = useRef(0);
  const contextTitle = context.title ?? "this page";
  const historyLabel = recentConversations.length
    ? `${recentConversations.length} saved chat${
        recentConversations.length === 1 ? "" : "s"
      } on this page`
    : conversationId
      ? "Saved for your account"
      : contextTitle;

  useEffect(() => {
    setMounted(true);
  }, []);

  const restoreConversation = useCallback(
    async (targetConversationId?: string | null) => {
      const requestId = restoreRequestRef.current + 1;
      restoreRequestRef.current = requestId;
      setIsRestoring(true);

      try {
        const searchParams = new URLSearchParams({
          pathname,
        });

        if (targetConversationId) {
          searchParams.set("conversationId", targetConversationId);
        }

        const response = await fetch(`/api/chat?${searchParams.toString()}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as ChatHistoryResponse & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || "Unable to restore chat history.");
        }

        if (requestId !== restoreRequestRef.current) {
          return;
        }

        setConversationId(data.conversation?.id ?? null);
        setMessages((data.messages ?? []) as ChatMessage[]);
        setRecentConversations(
          (data.recentConversations ?? []) as ChatConversationSummary[]
        );
      } catch {
        if (requestId !== restoreRequestRef.current) {
          return;
        }

        setConversationId(null);
        setMessages([]);
        setRecentConversations([]);
      } finally {
        if (requestId === restoreRequestRef.current) {
          setIsRestoring(false);
        }
      }
    },
    [pathname]
  );

  useEffect(() => {
    if (!mounted) {
      return;
    }

    setConversationId(null);
    setMessages([]);
    setRecentConversations([]);
    void restoreConversation();
  }, [mounted, restoreConversation]);

  useEffect(() => {
    if (!mounted || !isSupabaseConfigured) {
      return;
    }

    const supabase = createSupabaseClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        restoreRequestRef.current += 1;
        setConversationId(null);
        setMessages([]);
        setRecentConversations([]);
        setInput("");
        setIsRestoring(false);
        return;
      }

      void restoreConversation();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [mounted, restoreConversation]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const element = messageListRef.current;

    if (!element) {
      return;
    }

    element.scrollTop = element.scrollHeight;
  }, [isLoading, messages, open]);

  async function sendMessage(promptText?: string) {
    const prompt = (promptText ?? input).trim();

    if (!prompt || isLoading || isRestoring) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
    };
    const nextMessages = [...messages, userMessage];
    const history = nextMessages.slice(-MAX_HISTORY);

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          conversationId,
          history,
          pathname,
          context,
        }),
      });
      const data = (await response.json()) as {
        reply?: string;
        error?: string;
        conversationId?: string;
        recentConversations?: ChatConversationSummary[];
      };
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: String(
          data.reply ??
            data.error ??
            "I could not generate a response for this page."
        ),
      };

      if (data.conversationId) {
        setConversationId(String(data.conversationId));
      }

      if (Array.isArray(data.recentConversations)) {
        setRecentConversations(data.recentConversations);
      }

      setMessages((current) => [...current, assistantMessage]);
    } catch {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          "I could not reach the chatbot API. Check your Gemini configuration and try again.",
      };

      setMessages((current) => [...current, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function startNewChat() {
    restoreRequestRef.current += 1;
    setConversationId(null);
    setMessages([]);
    setInput("");
    setIsRestoring(false);
  }

  async function deleteConversation(targetConversationId: string) {
    if (isRestoring || deletingConversationId) {
      return;
    }

    const shouldDelete = window.confirm(
      "Delete this saved chat from your account?"
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingConversationId(targetConversationId);

    try {
      const searchParams = new URLSearchParams({
        pathname,
        conversationId: targetConversationId,
      });
      const response = await fetch(`/api/chat?${searchParams.toString()}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete the chat.");
      }

      await restoreConversation(
        conversationId === targetConversationId ? undefined : conversationId
      );
    } catch {
      // Keep the existing state if deletion fails.
    } finally {
      setDeletingConversationId(null);
    }
  }

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed bottom-6 right-6 z-[2147483647] flex flex-col items-end gap-3">
      {open ? (
        <div className="pointer-events-auto w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-[2rem] border border-white/10 bg-[#071019]/96 text-white shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <Image
                src="/algobot-badge.svg"
                alt="AlgoBot logo"
                width={26}
                height={26}
                className="h-[1.65rem] w-[1.65rem]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
                    Chatbot
                  </span>
                  <div className="text-sm font-semibold">AlgoBot</div>
                </div>
                <div className="text-xs text-white/50">{historyLabel}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startNewChat}
                className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/55 transition hover:bg-white/[0.05] hover:text-white"
              >
                New
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/55 transition hover:bg-white/[0.05] hover:text-white"
              >
                Close
              </button>
            </div>
          </div>

          <div className="border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
                Previous chats
              </div>
              <div className="text-[11px] text-white/38">
                {recentConversations.length
                  ? "Tap to reopen or delete"
                  : "Auto-saves when signed in"}
              </div>
            </div>

            {recentConversations.length ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {recentConversations.map((conversation) => {
                  const isActive = conversation.id === conversationId;

                  return (
                    <div
                      key={conversation.id}
                      className={`min-w-[10rem] rounded-[1.1rem] border px-3 py-2 text-left transition ${
                        isActive
                          ? "border-blue-400/40 bg-blue-500/12 text-white"
                          : "border-white/10 bg-white/[0.04] text-white/72 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => void restoreConversation(conversation.id)}
                          className="min-w-0 flex-1 text-left"
                          title={conversation.title}
                        >
                          <div className="truncate text-sm font-medium">
                            {conversation.title}
                          </div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/42">
                            {formatConversationDate(conversation.updatedAt)}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteConversation(conversation.id)}
                          disabled={
                            isRestoring || deletingConversationId === conversation.id
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-xs text-white/45 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={`Delete chat ${conversation.title}`}
                          title="Delete chat"
                        >
                          {deletingConversationId === conversation.id ? "..." : "x"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-xs leading-5 text-white/45">
                Start a new thread here and it will appear in this strip after the first saved reply.
              </p>
            )}
          </div>

          <div
            ref={messageListRef}
            className="max-h-80 min-h-52 space-y-3 overflow-y-auto px-4 py-4"
          >
            {isRestoring ? (
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/78">
                Restoring your saved chat...
              </div>
            ) : null}

            {messages.length === 0 ? (
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">
                Ask about {contextTitle}, compare algorithms, or request a quick explanation.
              </div>
            ) : null}

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}-${message.content.slice(0, 16)}`}
                className={`max-w-[88%] whitespace-pre-wrap rounded-[1.35rem] px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-blue-500/90 text-white"
                    : "border border-white/10 bg-white/[0.04] text-white/88"
                }`}
              >
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-55">
                  {message.role === "user" ? "You" : "AlgoBot"}
                </div>
                {message.content}
              </div>
            ))}

            {isLoading ? (
              <div className="max-w-[88%] rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">
                Thinking...
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/10 px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {context.suggestedPrompts?.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/72 transition hover:bg-white/[0.08] hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <textarea
                rows={3}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${contextTitle.toLowerCase()}...`}
                className="min-h-[4.5rem] flex-1 resize-none rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-white/34"
              />

              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={isLoading || isRestoring}
                className="rounded-[1.35rem] bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/60"
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Open AlgoBot"
        onClick={() => setOpen((current) => !current)}
        className="pointer-events-auto relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#071019]/96 shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition hover:scale-105 hover:border-white/20"
      >
        <Image
          src="/algobot-badge.svg"
          alt=""
          width={34}
          height={34}
          className="h-[2.1rem] w-[2.1rem]"
        />
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.06] px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
          Chat
        </span>
      </button>
    </div>,
    document.body
  );
}
