"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import { ChatPageContext } from "../../src/lib/chatbot/types";

type ChatbotContextValue = {
  pageContext: Partial<ChatPageContext> | null;
  setPageContext: (context: Partial<ChatPageContext>) => void;
  clearPageContext: () => void;
};

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [pageContext, setPageContextState] =
    useState<Partial<ChatPageContext> | null>(null);
  const clearPageContext = useCallback(() => {
    setPageContextState(null);
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        pageContext,
        setPageContext: setPageContextState,
        clearPageContext,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbotPageContext() {
  const context = useContext(ChatbotContext);

  if (!context) {
    throw new Error("useChatbotPageContext must be used inside ChatbotProvider");
  }

  return context;
}
