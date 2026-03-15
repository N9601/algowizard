import { NextResponse } from "next/server";

import { generateGeminiReply } from "../../../src/lib/chatbot/gemini";
import {
  ChatConversationSummary,
  ChatRequestBody,
} from "../../../src/lib/chatbot/types";
import { hasSupabaseEnv } from "../../../src/lib/supabase/env";
import { createClient } from "../../../src/lib/supabase/server";

type ConversationRow = {
  id: string;
  title: string;
  page_path: string | null;
  updated_at: string | null;
};

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const pathname = searchParams.get("pathname")?.trim();
  const requestedConversationId = searchParams.get("conversationId")?.trim();

  if (!pathname || !hasSupabaseEnv()) {
    return NextResponse.json({
      conversation: null,
      messages: [],
      recentConversations: [],
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      conversation: null,
      messages: [],
      recentConversations: [],
    });
  }

  const { data: recentConversationRows, error: recentConversationsError } =
    await supabase
      .from("chat_conversations")
      .select("id, title, page_path, updated_at")
      .eq("user_id", user.id)
      .eq("page_path", pathname)
      .order("updated_at", { ascending: false })
      .limit(6);

  if (recentConversationsError) {
    return NextResponse.json(
      { error: recentConversationsError.message },
      { status: 500 }
    );
  }

  const recentConversations = (recentConversationRows ?? []).map(
    mapConversationSummary
  );

  let conversation: ConversationRow | null = null;

  if (requestedConversationId) {
    const { data: requestedConversation, error: conversationError } =
      await supabase
        .from("chat_conversations")
        .select("id, title, page_path, updated_at")
        .eq("id", requestedConversationId)
        .eq("user_id", user.id)
        .eq("page_path", pathname)
        .maybeSingle();

    if (conversationError) {
      return NextResponse.json(
        { error: conversationError.message },
        { status: 500 }
      );
    }

    conversation = requestedConversation;
  } else {
    conversation = (recentConversationRows?.[0] as ConversationRow | undefined) ?? null;
  }

  if (!conversation) {
    return NextResponse.json({
      conversation: null,
      messages: [],
      recentConversations,
    });
  }

  const { data: messages, error: messagesError } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true });

  if (messagesError) {
    return NextResponse.json(
      { error: messagesError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    conversation: mapConversationSummary(conversation),
    messages: (messages ?? []).filter(
      (message) => message.role === "user" || message.role === "assistant"
    ),
    recentConversations,
  });
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequestBody;
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json(
      { reply: "Ask me about the current page, an algorithm, or a data structure." },
      { status: 400 }
    );
  }

  try {
    const { reply, context, model } = await generateGeminiReply({
      ...body,
      message,
    });

    let conversationId = body.conversationId ?? null;
    let recentConversations: ChatConversationSummary[] = [];

    if (hasSupabaseEnv()) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        let activeConversationId = conversationId;

        if (activeConversationId) {
          const { data: existingConversation } = await supabase
            .from("chat_conversations")
            .select("id")
            .eq("id", activeConversationId)
            .eq("user_id", user.id)
            .maybeSingle();

          if (!existingConversation) {
            activeConversationId = null;
          }
        }

        if (activeConversationId) {
          const { error: updateError } = await supabase
            .from("chat_conversations")
            .update({
              page_path: context.pathname,
              context,
            })
            .eq("id", activeConversationId)
            .eq("user_id", user.id);

          if (updateError) {
            return NextResponse.json(
              { error: updateError.message },
              { status: 500 }
            );
          }
        } else {
          const { data: conversation, error: createError } = await supabase
            .from("chat_conversations")
            .insert({
              user_id: user.id,
              title: buildConversationTitle(message),
              page_path: context.pathname,
              context,
            })
            .select("id")
            .single();

          if (createError) {
            return NextResponse.json(
              { error: createError.message },
              { status: 500 }
            );
          }

          activeConversationId = conversation.id;
        }

        const { error: messageError } = await supabase
          .from("chat_messages")
          .insert([
            {
              conversation_id: activeConversationId,
              role: "user",
              content: message,
            },
            {
              conversation_id: activeConversationId,
              role: "assistant",
              content: reply,
            },
          ]);

        if (messageError) {
          return NextResponse.json(
            { error: messageError.message },
            { status: 500 }
          );
        }

        const { data: recentConversationRows, error: recentConversationsError } =
          await supabase
            .from("chat_conversations")
            .select("id, title, page_path, updated_at")
            .eq("user_id", user.id)
            .eq("page_path", context.pathname)
            .order("updated_at", { ascending: false })
            .limit(6);

        if (recentConversationsError) {
          return NextResponse.json(
            { error: recentConversationsError.message },
            { status: 500 }
          );
        }

        recentConversations = (recentConversationRows ?? []).map(
          mapConversationSummary
        );
        conversationId = activeConversationId;
      }
    }

    return NextResponse.json({
      reply,
      context,
      model,
      conversationId,
      recentConversations,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gemini API request failed.";

    return NextResponse.json(
      {
        error: errorMessage,
        reply:
          "The chatbot could not reach Gemini. Add a valid GEMINI_API_KEY to .env.local and try again.",
      },
      { status: 500 }
    );
  }
}

function mapConversationSummary(
  conversation: ConversationRow
): ChatConversationSummary {
  return {
    id: conversation.id,
    title: conversation.title,
    pagePath: conversation.page_path,
    updatedAt: conversation.updated_at,
  };
}

function buildConversationTitle(message: string) {
  const normalized = message.replace(/\s+/g, " ").trim();

  if (normalized.length <= 56) {
    return normalized;
  }

  return `${normalized.slice(0, 53)}...`;
}

export async function DELETE(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const pathname = searchParams.get("pathname")?.trim();
  const conversationId = searchParams.get("conversationId")?.trim();

  if (!pathname || !conversationId) {
    return NextResponse.json(
      { error: "Missing pathname or conversationId." },
      { status: 400 }
    );
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase is not configured yet." },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated." },
      { status: 401 }
    );
  }

  const { error } = await supabase
    .from("chat_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .eq("page_path", pathname);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    deletedConversationId: conversationId,
  });
}
