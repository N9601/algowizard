import { NextResponse } from "next/server";

import { hasSupabaseEnv } from "src/lib/supabase/env";
import { createClient } from "src/lib/supabase/server";

type ProgressRequestBody = {
  topicSlug?: string;
  topicType?: string;
  percentComplete?: number;
};

const VALID_TOPIC_TYPES = new Set([
  "sorting",
  "searching",
  "graph",
  "data-structure",
  "algorithm",
]);

export async function POST(request: Request) {
  const body = (await request.json()) as ProgressRequestBody;
  const topicSlug = body.topicSlug?.trim();
  const topicType = body.topicType?.trim();

  if (!topicSlug || !topicType || !VALID_TOPIC_TYPES.has(topicType)) {
    return NextResponse.json(
      { error: "Missing or invalid progress payload." },
      { status: 400 }
    );
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const incomingPercent = clampPercent(body.percentComplete);
  const { data: existingRecord, error: existingError } = await supabase
    .from("learning_progress")
    .select("percent_complete")
    .eq("user_id", user.id)
    .eq("topic_slug", topicSlug)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: existingError.message },
      { status: 500 }
    );
  }

  const percentComplete = Math.max(
    existingRecord?.percent_complete ?? 0,
    incomingPercent
  );
  const status =
    percentComplete >= 100
      ? "completed"
      : percentComplete > 0
        ? "in_progress"
        : "not_started";

  const { error } = await supabase.from("learning_progress").upsert(
    {
      user_id: user.id,
      topic_slug: topicSlug,
      topic_type: topicType,
      percent_complete: percentComplete,
      status,
      last_viewed_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,topic_slug",
    }
  );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    percentComplete,
    status,
  });
}

function clampPercent(value?: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value ?? 0)));
}
