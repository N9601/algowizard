"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";

type UserArrayInputProps = {
  title?: string;
  helper?: string;
  defaultValues?: number[];
  onApply: (values: number[]) => void;
  onRandom: () => void;
  includeTarget?: boolean;
  target?: number;
  onTargetChange?: (value: number) => void;
};

export default function UserArrayInput({
  title = "Custom input",
  helper = "Enter comma-separated numbers (3–30 values, each 0–999).",
  defaultValues = [],
  onApply,
  onRandom,
  includeTarget = false,
  target,
  onTargetChange,
}: UserArrayInputProps) {
  const [text, setText] = useState(defaultValues.join(", "));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(defaultValues.join(", "));
  }, [defaultValues]);

  const parsedPreview = useMemo(() => parseNumbers(text), [text]);

  function handleApply() {
    const parsed = parseNumbers(text);
    const validationError = validateNumbers(parsed);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onApply(parsed);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            {title}
          </div>
          <p className="mt-1 text-white/70">{helper}</p>
        </div>
        <button
          type="button"
          onClick={onRandom}
          className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-white/25 hover:text-white"
        >
          Random
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-white/48">
            Numbers
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. 5, 12, 7, 18, 3"
            className="w-full rounded-xl border border-white/12 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/30"
            spellCheck={false}
          />
        </div>

        {includeTarget ? (
          <div className="w-full md:w-40">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-white/48">
              Target
            </label>
            <input
              type="number"
              value={target ?? ""}
              onChange={(e) => onTargetChange?.(Number(e.target.value))}
              className="w-full rounded-xl border border-white/12 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/30"
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleApply}
          className="w-full md:w-auto rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          Apply
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-white/55">
        <div>
          {error ? (
            <span className="text-red-300">{error}</span>
          ) : (
            <span>Parsed: {previewLabel(parsedPreview)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function parseNumbers(input: string): number[] {
  return input
    .split(/[,\s]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
}

function validateNumbers(values: number[]) {
  if (!values.length) {
    return "Please enter some numbers.";
  }

  if (values.length < 3 || values.length > 30) {
    return "Enter between 3 and 30 numbers.";
  }

  if (values.some((value) => !Number.isInteger(value))) {
    return "Only whole numbers are supported.";
  }

  if (values.some((value) => value < 0 || value > 999)) {
    return "Values must be between 0 and 999.";
  }

  return null;
}

function previewLabel(values: number[]) {
  if (!values.length) return "—";
  if (values.length <= 8) return values.join(", ");
  return `${values.slice(0, 6).join(", ")} … ${values[values.length - 1]}`;
}
