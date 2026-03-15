"use client";

import { ReactNode, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

import { hasSupabaseEnv } from "src/lib/supabase/env";
import { useChatbotPageContext } from "../chatbot/ChatbotProvider";
import VideoWheel from "./VideoWheel";

interface AlgorithmLayoutProps {
  title: string;
  description: string;
  time: string;
  space: string;
  category: string;
  difficulty: string;
  progressPercent?: number;
  actions?: ReactNode;
  children: ReactNode;
}

type ProgressTopicType =
  | "sorting"
  | "searching"
  | "graph"
  | "data-structure"
  | "algorithm";

const isSupabaseConfigured = hasSupabaseEnv();

export default function AlgorithmLayout({
  title,
  description,
  time,
  space,
  category,
  difficulty,
  progressPercent = 0,
  actions,
  children,
}: AlgorithmLayoutProps) {
  const pathname = usePathname();
  const { setPageContext, clearPageContext } = useChatbotPageContext();
  const lastSyncedProgressRef = useRef<number | null>(null);
  const topicType = useMemo(() => inferTopicType(category), [category]);

  useEffect(() => {
    setPageContext({
      pathname,
      title,
      description,
      time,
      space,
      category,
      difficulty,
    });

    return () => clearPageContext();
  }, [
    category,
    clearPageContext,
    description,
    difficulty,
    pathname,
    setPageContext,
    space,
    time,
    title,
  ]);

  useEffect(() => {
    if (!isSupabaseConfigured || !topicType) {
      return;
    }

    const normalizedProgress = normalizeProgress(progressPercent);

    if (lastSyncedProgressRef.current === normalizedProgress) {
      return;
    }

    lastSyncedProgressRef.current = normalizedProgress;

    void fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topicSlug: pathname,
        topicType,
        percentComplete: normalizedProgress,
      }),
    }).catch(() => {
      // Silent no-op: progress syncing should never block the learning UI.
    });
  }, [pathname, progressPercent, title, topicType]);

  return (
    <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 py-10">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/45">
              {category}
            </div>
            <h1 className="mt-3 text-4xl font-bold text-white">{title}</h1>

            <p className="mt-4 max-w-4xl leading-relaxed text-white/64">{description}</p>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Meta label="Time Complexity" value={time} />
              <Meta label="Space Complexity" value={space} />
              <Meta label="Category" value={category} />
              <Meta label="Difficulty" value={difficulty} />
            </div>
          </div>

          {actions ? (
            <div className="xl:w-[22rem]">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-[#07111b]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        {children}
      </div>
      <VideoWheel title={title} category={category} />
    </div>
  );
}

function inferTopicType(category: string): ProgressTopicType | null {
  switch (category.toLowerCase()) {
    case "sorting":
      return "sorting";
    case "searching":
      return "searching";
    case "graph":
      return "graph";
    case "data structure":
      return "data-structure";
    default:
      return "algorithm";
  }
}

function normalizeProgress(progressPercent: number) {
  if (!Number.isFinite(progressPercent) || progressPercent <= 0) {
    return 10;
  }

  if (progressPercent >= 100) {
    return 100;
  }

  return Math.min(100, Math.max(10, Math.ceil(progressPercent / 10) * 10));
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/42">
        {label}
      </div>
      <div className="mt-2 font-semibold text-white">{value}</div>
    </div>
  );
}
