"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { createClient } from "src/lib/supabase/client";
import { hasSupabaseEnv } from "src/lib/supabase/env";
import type { Database } from "src/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type AccountResponse = {
  user: {
    id: string;
    email: string | null;
  };
  profile: Profile | null;
  savedCount: number;
  progressCount: number;
};

const isSupabaseConfigured = hasSupabaseEnv();

export default function AuthNav() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    async function loadAccount() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/me", {
          cache: "no-store",
        });

        if (response.status === 401) {
          if (!cancelled) {
            setAccount(null);
            setMenuOpen(false);
          }
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load your account.");
        }

        if (!cancelled) {
          setAccount(data as AccountResponse);
        }
      } catch {
        if (!cancelled) {
          setAccount(null);
          setMenuOpen(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void loadAccount();
      router.refresh();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        cancelCloseMenu();
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        cancelCloseMenu();
        setMenuOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      cancelCloseMenu();
    };
  }, []);

  function cancelCloseMenu() {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function openMenu() {
    cancelCloseMenu();
    setMenuOpen(true);
  }

  function scheduleCloseMenu() {
    cancelCloseMenu();
    closeTimeoutRef.current = window.setTimeout(() => {
      setMenuOpen(false);
      closeTimeoutRef.current = null;
    }, 180);
  }

  if (!account) {
    const statusLabel = !isSupabaseConfigured
      ? "Supabase setup pending"
      : isLoading
        ? "Checking session"
        : "Guest mode";
    const statusDetail = !isSupabaseConfigured
      ? "Auth pages are visible, but cloud sync will work after you finish Supabase setup."
      : "Sign in to sync saved states across devices.";

    return (
      <div className="flex items-center gap-3">
        <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-left xl:block">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isSupabaseConfigured ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span className="text-sm font-medium text-white/72">{statusLabel}</span>
          </div>
        </div>
        <Link
          href="/login?next=/saved"
          title={statusDetail}
          className="rounded-full border border-white/10 px-3 py-2 text-white/68 transition hover:bg-white/[0.05] hover:text-white"
        >
          Log in
        </Link>
        <Link
          href="/signup?next=/saved"
          className="rounded-full border border-blue-400/20 bg-blue-500/90 px-4 py-2 font-medium text-white transition hover:bg-blue-400"
        >
          Register
        </Link>
      </div>
    );
  }

  const displayName =
    account.profile?.full_name ||
    account.profile?.username ||
    account.user.email?.split("@")[0] ||
    "AlgoWizard User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="relative"
      ref={menuRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleCloseMenu}
    >
      <button
        type="button"
        onClick={() => {
          cancelCloseMenu();
          setMenuOpen((current) => !current);
        }}
        onFocus={openMenu}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.06]"
        aria-label="Open account menu"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/16 text-sm font-bold text-blue-100">
          {initials || "A"}
        </div>
      </button>

      {menuOpen ? (
        <div
          className="absolute right-0 top-full z-40 w-56 pt-2"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleCloseMenu}
          onFocus={openMenu}
        >
          <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#071019]/96 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <div className="space-y-1">
              <Link
                href="/progress"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-[1rem] px-4 py-3 text-sm text-white/74 transition hover:bg-white/[0.06] hover:text-white"
              >
                <span>Progress</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/58">
                  {account.progressCount}
                </span>
              </Link>

              <Link
                href="/saved"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-[1rem] px-4 py-3 text-sm text-white/74 transition hover:bg-white/[0.06] hover:text-white"
              >
                <span>Saved states</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/58">
                  {account.savedCount}
                </span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  cancelCloseMenu();
                  setMenuOpen(false);
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  router.push("/visualizer");
                  router.refresh();
                }}
                className="flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left text-sm text-white/68 transition hover:bg-white/[0.06] hover:text-white"
              >
                <span>Sign out</span>
                <span className="text-white/32">↗</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
