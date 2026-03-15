import Link from "next/link";
import { redirect } from "next/navigation";

import Navbar from "components/visualizer/Navbar";
import { findKnowledgeByPath, ROUTE_CONTEXT } from "src/lib/chatbot/catalog";
import { hasSupabaseEnv } from "src/lib/supabase/env";
import { createClient } from "src/lib/supabase/server";
import type { Database } from "src/types/database";

type LearningProgressRow =
  Database["public"]["Tables"]["learning_progress"]["Row"];

const TRACKS = [
  { key: "sorting", label: "Sorting" },
  { key: "searching", label: "Searching" },
  { key: "graph", label: "Graph" },
  { key: "data-structure", label: "Data Structures" },
  { key: "algorithm", label: "Algorithms" },
] as const;

export default async function ProgressPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="min-h-screen bg-[#0b1220] px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-bold">Progress Dashboard</h1>
          <p className="mt-4 text-white/75">
            Supabase is not configured yet. Add the Supabase environment
            variables before using progress tracking.
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
    redirect("/login?next=/progress");
  }

  const [progressResult, savedCountResult, chatCountResult] = await Promise.all([
    supabase
      .from("learning_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("saved_visualizations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("chat_conversations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const rows = (progressResult.data ?? []) as LearningProgressRow[];
  const progressError = progressResult.error;
  const savedCount = savedCountResult.count ?? 0;
  const chatCount = chatCountResult.count ?? 0;
  const startedCount = rows.length;
  const completedCount = rows.filter((row) => row.status === "completed").length;
  const inProgressCount = rows.filter((row) => row.status === "in_progress").length;
  const averageCompletion = rows.length
    ? Math.round(
        rows.reduce((sum, row) => sum + row.percent_complete, 0) / rows.length
      )
    : 0;

  const trackSummaries = TRACKS.map((track) => {
    const trackRows = rows.filter((row) => row.topic_type === track.key);
    const completion = trackRows.length
      ? Math.round(
          trackRows.reduce((sum, row) => sum + row.percent_complete, 0) /
            trackRows.length
        )
      : 0;

    return {
      ...track,
      count: trackRows.length,
      completion,
    };
  }).filter((track) => track.count > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0e1628] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.14),rgba(8,17,29,0.92)_48%),linear-gradient(180deg,#091321_0%,#07111d_100%)] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-200/74">
                Progress Dashboard
              </p>
              <h1 className="mt-4 text-5xl font-bold leading-tight text-white">
                Track what you started, what you finished, and what to revisit next.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/66">
                AlgoWizard now tracks topic progress automatically while you use the
                visualizers, so this dashboard becomes your study home base.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard label="Topics started" value={String(startedCount)} />
              <MetricCard label="Completed" value={String(completedCount)} />
              <MetricCard label="In progress" value={String(inProgressCount)} />
              <MetricCard
                label="Average completion"
                value={`${averageCompletion}%`}
              />
            </div>
          </div>
        </section>

        {progressError ? (
          <div className="mt-10 rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-red-100">
            {progressError.message}
          </div>
        ) : null}

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Saved states"
            value={savedCount}
            detail="Reusable setups you can reopen instantly."
          />
          <SummaryCard
            title="Chat threads"
            value={chatCount}
            detail="Page-specific conversations saved to your account."
          />
          <SummaryCard
            title="Completion rate"
            value={`${averageCompletion}%`}
            detail="Average progress across all tracked topics."
          />
          <SummaryCard
            title="Next best step"
            value={inProgressCount ? "Keep going" : "Start a topic"}
            detail={
              inProgressCount
                ? "Return to a partially completed topic below."
                : "Open a visualizer page and your dashboard will begin filling in."
            }
          />
        </section>

        {trackSummaries.length ? (
          <section className="mt-12">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/38">
                  By Track
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Where your learning is concentrated
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {trackSummaries.map((track) => (
                <article
                  key={track.key}
                  className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/38">
                    {track.label}
                  </div>
                  <div className="mt-4 text-3xl font-bold text-white">
                    {track.count}
                  </div>
                  <p className="mt-2 text-sm text-white/58">
                    tracked topic{track.count === 1 ? "" : "s"}
                  </p>
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/40">
                      <span>Average</span>
                      <span>{track.completion}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-blue-400"
                        style={{ width: `${track.completion}%` }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/38">
                Recent Activity
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                Continue where you left off
              </h2>
            </div>
          </div>

          {rows.length ? (
            <div className="mt-8 space-y-4">
              {rows.slice(0, 8).map((row) => {
                const topic = getTopicDetails(row);

                return (
                  <article
                    key={row.id}
                    className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="truncate text-2xl font-semibold text-white">
                            {topic.title}
                          </h3>
                          <StatusBadge status={row.status} />
                          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/54">
                            {topic.category}
                          </span>
                        </div>

                        <p className="mt-3 max-w-4xl text-sm leading-7 text-white/62">
                          {topic.description}
                        </p>

                        <div className="mt-5 max-w-xl">
                          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/40">
                            <span>Completion</span>
                            <span>{row.percent_complete}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-2 rounded-full bg-blue-400"
                              style={{ width: `${row.percent_complete}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-4 text-xs uppercase tracking-[0.16em] text-white/36">
                          Last viewed {formatDate(row.last_viewed_at ?? row.updated_at)}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <Link
                          href={topic.href}
                          className="rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
                        >
                          Continue
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/68">
              <h3 className="text-2xl font-semibold text-white">
                No progress yet
              </h3>
              <p className="mt-4 max-w-2xl leading-7">
                Open any algorithm or data-structure page and the dashboard will
                start tracking what you study automatically.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/visualizer/sorting"
                  className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  Start with sorting
                </Link>
                <Link
                  href="/visualizer/compare"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/74 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Open compare mode
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function getTopicDetails(row: LearningProgressRow) {
  const knowledge = findKnowledgeByPath(row.topic_slug);
  const routeContext = ROUTE_CONTEXT[row.topic_slug];

  return {
    title:
      knowledge?.title ??
      routeContext?.title ??
      row.topic_slug.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ??
      "Topic",
    description:
      knowledge?.summary ??
      routeContext?.description ??
      "Continue learning this topic in the visualizer.",
    category:
      knowledge?.category ??
      routeContext?.category ??
      formatTrackLabel(row.topic_type),
    href: row.topic_slug.startsWith("/") ? row.topic_slug : "/visualizer",
  };
}

function formatTrackLabel(value: string) {
  switch (value) {
    case "data-structure":
      return "Data Structure";
    case "sorting":
      return "Sorting";
    case "searching":
      return "Searching";
    case "graph":
      return "Graph";
    default:
      return "Algorithm";
  }
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "recently";
  }
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-5">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {label}
      </div>
      <div className="mt-3 text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: number | string;
  detail: string;
}) {
  return (
    <article className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/38">
        {title}
      </div>
      <div className="mt-4 text-3xl font-bold text-white">{value}</div>
      <p className="mt-3 text-sm leading-6 text-white/58">{detail}</p>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "completed"
      ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-200"
      : "border-blue-400/20 bg-blue-500/12 text-blue-200";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] ${className}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
