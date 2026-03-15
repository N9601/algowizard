import { NextResponse } from "next/server";

import { createClient } from "src/lib/supabase/server";
import { hasSupabaseEnv } from "src/lib/supabase/env";
import type { Json } from "src/types/database";

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

  const body = (await request.json()) as CreateSavedVisualizationBody;

  if (!body.title || !body.algorithmSlug || !body.route || body.config === undefined) {
    return NextResponse.json(
      { error: "Missing required saved visualization fields." },
      { status: 400 }
    );
  }

  const query = body.id
    ? supabase
        .from("saved_visualizations")
        .update({
          title: body.title,
          algorithm_slug: body.algorithmSlug,
          route: body.route,
          config: body.config,
        })
        .eq("id", body.id)
        .eq("user_id", user.id)
        .select("*")
        .single()
    : supabase
        .from("saved_visualizations")
        .insert({
          user_id: user.id,
          title: body.title,
          algorithm_slug: body.algorithmSlug,
          route: body.route,
          config: body.config,
        })
        .select("*")
        .single();

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ visualization: data });
}
