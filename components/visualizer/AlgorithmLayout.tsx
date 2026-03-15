"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useChatbotPageContext } from "../chatbot/ChatbotProvider";
import VideoWheel from "./VideoWheel";

interface AlgorithmLayoutProps {
  title: string;
  description: string;
  time: string;
  space: string;
  category: string;
  difficulty: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AlgorithmLayout({
  title,
  description,
  time,
  space,
  category,
  difficulty,
  actions,
  children,
}: AlgorithmLayoutProps) {
  const pathname = usePathname();
  const { setPageContext, clearPageContext } = useChatbotPageContext();

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
