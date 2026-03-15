import Link from "next/link";
import { redirect } from "next/navigation";

import DeleteSavedVisualizationButton from "components/visualizer/DeleteSavedVisualizationButton";
import Navbar from "components/visualizer/Navbar";
import type { Database } from "src/types/database";
import { hasSupabaseEnv } from "src/lib/supabase/env";
import { createClient } from "src/lib/supabase/server";

type SavedVisualizationRow =
  Database["public"]["Tables"]["saved_visualizations"]["Row"];

export default async function SavedPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="min-h-screen bg-[#0b1220] px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-bold">Saved Visualizations</h1>
          <p className="mt-4 text-white/75">
            Supabase is not configured yet. Add the Supabase environment
            variables from the setup guide before using saved states.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/saved");
  }

  const { data: visualizations, error } = await supabase
    .from("saved_visualizations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  const rows = (visualizations ?? []) as SavedVisualizationRow[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0e1628] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold">Saved Visualizer States</h1>
          <p className="mt-4 text-white/70">
            Reopen a saved algorithm setup, compare variants, or clear out old
            experiments.
          </p>
        </div>

        {error ? (
          <div className="mt-10 rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-red-100">
            {error.message}
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((visualization) => (
            <article
              key={visualization.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {visualization.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/55">
                    {visualization.algorithm_slug}
                  </p>
                </div>
                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-300">
                  {visualization.route}
                </span>
              </div>

              {visualization.notes ? (
                <p className="mt-4 text-sm text-white/70">
                  {visualization.notes}
                </p>
              ) : null}

              <div className="mt-6 flex items-center justify-between gap-3">
                <Link
                  href={`${visualization.route}?saved=${visualization.id}`}
                  className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  Open
                </Link>
                <DeleteSavedVisualizationButton id={visualization.id} />
              </div>
            </article>
          ))}
        </div>

        {!rows.length && !error ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-white/70">
            You have not saved any visualizer states yet. Open an algorithm page
            and use the new save control in the header.
          </div>
        ) : null}
      </main>
    </div>
  );
}
