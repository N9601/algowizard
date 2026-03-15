"use client";

import { useEffect, useEffectEvent, useState } from "react";

type SavedVisualizationRecord<T> = {
  id: string;
  title: string;
  route: string;
  config: T;
};

type UseSavedVisualizationOptions<T> = {
  expectedRoute: string;
  applyState: (config: T) => void;
};

export function useSavedVisualization<T>({
  expectedRoute,
  applyState,
}: UseSavedVisualizationOptions<T>) {
  const applyStateEvent = useEffectEvent(applyState);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedTitle, setLoadedTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSavedId(params.get("saved"));
  }, []);

  useEffect(() => {
    if (!savedId) {
      setLoadError(null);
      setLoadedTitle(null);
      return;
    }

    let cancelled = false;

    async function loadSavedState() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(`/api/saved-visualizations/${savedId}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load the requested saved visualization."
          );
        }

        const record = data.visualization as SavedVisualizationRecord<T>;

        if (!record || record.route !== expectedRoute) {
          throw new Error("That saved state belongs to a different visualizer.");
        }

        if (!cancelled) {
          applyStateEvent(record.config);
          setLoadedTitle(record.title);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load the requested saved visualization."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadSavedState();

    return () => {
      cancelled = true;
    };
  }, [expectedRoute, savedId]);

  return {
    isLoading,
    loadError,
    loadedTitle,
  };
}
