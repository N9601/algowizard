"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { hasSupabaseEnv } from "src/lib/supabase/env";
import type { Json } from "src/types/database";

type SaveVisualizationButtonProps = {
  title: string;
  algorithmSlug: string;
  route: string;
  disabled?: boolean;
  getPayload: () => Json;
};

const isSupabaseConfigured = hasSupabaseEnv();

export default function SaveVisualizationButton({
  title,
  algorithmSlug,
  route,
  disabled = false,
  getPayload,
}: SaveVisualizationButtonProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSave() {
    if (disabled || isSaving) {
      return;
    }

    setIsSaving(true);
    setStatus(null);

    try {
      const currentUrl = new URL(window.location.href);
      const savedId = currentUrl.searchParams.get("saved");
      const response = await fetch("/api/saved-visualizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: savedId,
          title,
          algorithmSlug,
          route,
          config: getPayload(),
        }),
      });
      const data = await response.json();

      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent(route)}`);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to save this visualization.");
      }

      if (data.visualization?.id) {
        currentUrl.searchParams.set("saved", String(data.visualization.id));
        router.replace(`${currentUrl.pathname}${currentUrl.search}`, {
          scroll: false,
        });
      }

      setStatus(
        savedId
          ? "Updated this saved state."
          : "Saved this state. This link now points to it."
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to save this visualization."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Configure Supabase env vars to save visualizer states.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-white">Save this state</div>
      <p className="mt-2 text-sm text-white/65">
        Persist the current configuration to your account and reuse the same
        saved link.
      </p>
      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={disabled || isSaving}
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/50"
      >
        {isSaving ? "Saving..." : "Save State"}
      </button>
      {status ? (
        <p className="mt-3 text-xs leading-5 text-white/75">{status}</p>
      ) : null}
    </div>
  );
}
