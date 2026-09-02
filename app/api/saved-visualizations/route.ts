import { NextResponse } from "next/server";

import { createClient } from "src/lib/supabase/server";
import { hasSupabaseEnv } from "src/lib/supabase/env";
import type { Json } from "src/types/database";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type CreateSavedVisualizationBody = {
  id?: string;
  title?: string;
  algorithmSlug?: string;
  route?: string;
  config?: Json;
};

export async function GET() {
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
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("saved_visualizations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ visualizations: data });
}

export async function POST(request: Request) {
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
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  let body: CreateSavedVisualizationBody;

  try {
    body = (await request.json()) as CreateSavedVisualizationBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (
    typeof body?.title !== "string" ||
    typeof body.algorithmSlug !== "string" ||
    typeof body.route !== "string" ||
    !body.title ||
    !body.algorithmSlug ||
    !body.route ||
    body.config === undefined
  ) {
    return NextResponse.json(
      { error: "Missing required saved visualization fields." },
      { status: 400 }
    );
  }

  const fields = {
    title: body.title,
    algorithm_slug: body.algorithmSlug,
    route: body.route,
    config: body.config,
  };

  if (typeof body.id === "string" && UUID_PATTERN.test(body.id)) {
    const { data: updated, error: updateError } = await supabase
      .from("saved_visualizations")
      .update(fields)
      .eq("id", body.id)
      .eq("user_id", user.id)
      .select("*")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    if (updated) {
      return NextResponse.json({ visualization: updated });
    }

    // The loaded state belongs to someone else or was deleted, so save a
    // new copy for this user below instead of failing.
  }

  const { data, error } = await supabase
    .from("saved_visualizations")
    .insert({
      user_id: user.id,
      ...fields,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ visualization: data });
}
