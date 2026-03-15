"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { createClient } from "src/lib/supabase/client";
import { hasSupabaseEnv } from "src/lib/supabase/env";

type AuthFormProps = {
  mode: "login" | "signup";
};

const isSupabaseConfigured = hasSupabaseEnv();

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [next, setNext] = useState("/saved");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNext(params.get("next") ?? "/saved");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setMessage("Supabase is not configured yet. Add the env vars first.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          router.push(next);
          router.refresh();
          return;
        }

        setMessage(
          "Account created. If email confirmation is enabled, check your inbox before signing in."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        router.push(next);
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(3,8,22,0.35)]">
      <h1 className="text-3xl font-bold text-white">
        {mode === "signup" ? "Create account" : "Welcome back"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-white/70">
        {mode === "signup"
          ? "Create a Supabase-backed account so you can save visualizer states and track progress."
          : "Sign in to reopen saved visualizer states and sync your learning progress."}
      </p>

      {!isSupabaseConfigured ? (
        <div className="mt-4 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Supabase is not configured yet on this machine. The page is ready,
          but sign-in and registration will only work after you add the
          Supabase environment variables.
        </div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/80">
              Full name
            </span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#091423] px-4 py-3 text-white placeholder:text-white/35"
              placeholder="Ada Lovelace"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white/80">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#091423] px-4 py-3 text-white placeholder:text-white/35"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white/80">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#091423] px-4 py-3 text-white placeholder:text-white/35"
            placeholder="Minimum 6 characters"
            minLength={6}
            required
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/60"
        >
          {isSubmitting
            ? mode === "signup"
              ? "Creating account..."
              : "Signing in..."
            : mode === "signup"
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      {message ? (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
          {message}
        </p>
      ) : null}

      <p className="mt-6 text-sm text-white/65">
        {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          href={`${mode === "signup" ? "/login" : "/signup"}?next=${encodeURIComponent(next)}`}
          className="font-semibold text-blue-400 hover:text-blue-300"
        >
          {mode === "signup" ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
