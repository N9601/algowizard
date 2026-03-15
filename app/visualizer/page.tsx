import Link from "next/link";

import AlgoCard from "components/visualizer/AlgoCard";
import Navbar from "components/visualizer/Navbar";
import { hasSupabaseEnv } from "src/lib/supabase/env";
import { createClient } from "src/lib/supabase/server";

const tracks = [
  {
    title: "Compare Mode",
    description: "Run two sorting algorithms side by side on the same input and compare every decision.",
    href: "/visualizer/compare",
    accent: "bg-cyan-400/12 text-cyan-100 border-cyan-300/15",
  },
  {
    title: "Sorting",
    description: "Compare swaps, partitions, and ordering strategies with clear step playback.",
    href: "/visualizer/sorting",
    accent: "bg-blue-400/12 text-blue-100 border-blue-300/15",
  },
  {
    title: "Searching",
    description: "Track ranges, targets, and decisions as linear and binary searches unfold.",
    href: "/visualizer/searching",
    accent: "bg-emerald-400/12 text-emerald-100 border-emerald-300/15",
  },
  {
    title: "Graph",
    description: "Follow traversal order, shortest paths, and node state without a cluttered screen.",
    href: "/visualizer/graph",
    accent: "bg-fuchsia-400/12 text-fuchsia-100 border-fuchsia-300/15",
  },
  {
    title: "Data Structures",
    description: "Practice stacks, queues, trees, heaps, and linked lists with visual feedback.",
    href: "/visualizer/datastructures",
    accent: "bg-amber-300/12 text-amber-100 border-amber-200/15",
  },
];

const features = [
  {
    title: "Compare identical inputs",
    copy: "Watch two sorting algorithms process the same array with synchronized playback and narration.",
  },
  {
    title: "Resume exact states",
    copy: "Save a visualizer setup and reopen the same configuration later instead of starting over.",
  },
  {
    title: "Ask page-aware questions",
    copy: "Use AlgoBot to ask about the current algorithm or data structure and keep chats tied to your account.",
  },
  {
    title: "Adjust speed mid-run",
    copy: "Tune playback while an animation is already running without losing your place.",
  },
];

export default async function HomePage() {
  let isLoggedIn = false;

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      isLoggedIn = Boolean(user);
    } catch {
      isLoggedIn = false;
    }
  }

  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <Navbar />

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.2),rgba(5,11,20,0.92)_42%),linear-gradient(180deg,#07101b_0%,#050b14_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-200/75">
                Workspace Overview
              </p>
              <h1 className="mt-4 text-5xl font-bold leading-tight text-white">
                Study algorithms inside a calmer, more reusable practice space.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/66">
                Explore interactive modules, save exact states, adjust playback mid-run,
                and use contextual AI help without leaving the page.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/visualizer/compare"
                  className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  Open compare mode
                </Link>
                <Link
                  href="/saved"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/74 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Open saved states
                </Link>
                {!isLoggedIn ? (
                  <Link
                    href="/signup"
                    className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/74 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Create account
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                Inside the app
              </p>
              <div className="mt-5 space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"
                  >
                    <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/58">{feature.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {tracks.map((track) => (
              <Link
                key={track.title}
                href={track.href}
                className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${track.accent}`}
                >
                  {track.title}
                </span>
                <h2 className="mt-5 text-xl font-semibold text-white">{track.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/58">{track.description}</p>
                <div className="mt-6 text-sm font-medium text-white/70 transition group-hover:text-white">
                  Open track →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl space-y-24 px-6 py-20">
          <CategorySection
            eyebrow="Explore"
            title="Sorting Algorithms"
            href="/visualizer/sorting"
          >
            <AlgoCard
              title="Bubble Sort"
              description="A simple sorting algorithm that repeatedly swaps adjacent elements."
              difficulty="Easy"
              tag="Sorting"
              href="/visualizer/sorting/bubble-sort"
            />
            <AlgoCard
              title="Selection Sort"
              description="Repeatedly selects the minimum element and places it in order."
              difficulty="Easy"
              tag="Sorting"
              href="/visualizer/sorting/selection-sort"
            />
            <AlgoCard
              title="Insertion Sort"
              description="Builds the sorted array one element at a time."
              difficulty="Easy"
              tag="Sorting"
              href="/visualizer/sorting/insertion-sort"
            />
          </CategorySection>

          <CategorySection
            eyebrow="Explore"
            title="Searching Algorithms"
            href="/visualizer/searching"
          >
            <AlgoCard
              title="Linear Search"
              description="Sequentially checks each element until the target value is found."
              difficulty="Easy"
              tag="Searching"
              href="/visualizer/searching/linear-search"
            />
            <AlgoCard
              title="Binary Search"
              description="Efficiently finds a target value in a sorted array."
              difficulty="Medium"
              tag="Searching"
              href="/visualizer/searching/binary-search"
            />
          </CategorySection>

          <CategorySection
            eyebrow="Explore"
            title="Graph Algorithms"
            href="/visualizer/graph"
          >
            <AlgoCard
              title="Depth-First Search"
              description="Explores as far as possible along each branch before backtracking."
              difficulty="Medium"
              tag="Graph"
              href="/visualizer/graph/dfs"
            />
            <AlgoCard
              title="Breadth-First Search"
              description="Explores all neighboring nodes at the current depth."
              difficulty="Medium"
              tag="Graph"
              href="/visualizer/graph/bfs"
            />
            <AlgoCard
              title="Dijkstra’s Algorithm"
              description="Finds the shortest path between nodes in a weighted graph."
              difficulty="Hard"
              tag="Graph"
              href="/visualizer/graph/dijkstra"
            />
          </CategorySection>

          <CategorySection
            eyebrow="Explore"
            title="Data Structures"
            href="/visualizer/datastructures"
          >
            <AlgoCard
              title="Stack"
              description="Linear data structure following LIFO (Last In, First Out) principle."
              difficulty="Easy"
              tag="Data Structure"
              href="/visualizer/datastructures/stack"
            />
            <AlgoCard
              title="Queue"
              description="Linear data structure following FIFO (First In, First Out) principle."
              difficulty="Easy"
              tag="Data Structure"
              href="/visualizer/datastructures/queue"
            />
            <AlgoCard
              title="Linked List"
              description="Dynamic linear data structure with nodes connected via pointers."
              difficulty="Medium"
              tag="Data Structure"
              href="/visualizer/datastructures/linked-list"
            />
          </CategorySection>
        </div>
      </section>
    </div>
  );
}

function CategorySection({
  eyebrow,
  title,
  href,
  children,
}: {
  eyebrow: string;
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/38">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold">{title}</h2>
        </div>
        <Link
          href={href}
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition hover:bg-white/[0.08] hover:text-white"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}
