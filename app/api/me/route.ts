import { NextResponse } from "next/server";

import { createClient } from "src/lib/supabase/server";
import { hasSupabaseEnv } from "src/lib/supabase/env";

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
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json(
      { error: userError.message },
      { status: 500 }
    );
  }

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 500 }
    );
  }

  const { count: savedCount, error: savedCountError } = await supabase
    .from("saved_visualizations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (savedCountError) {
    return NextResponse.json(
      { error: savedCountError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    user,
    profile,
    savedCount: savedCount ?? 0,
  });
}
