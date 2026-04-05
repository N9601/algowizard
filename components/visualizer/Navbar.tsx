"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import AuthNav from "components/auth/AuthNav";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/visualizer") {
      return pathname === "/visualizer";
    }

    return pathname.startsWith(path);
  };

  const navItem = (label: string, href: string) => (
    <Link
      key={href}
      href={href}
      className={`rounded-full px-3 py-2 text-sm transition ${
        isActive(href)
          ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "text-white/56 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      <span>{label}</span>
    </Link>
  );

  const mainLinks = [
    { label: "Home", href: "/visualizer" },
    { label: "Compare", href: "/visualizer/compare" },
    { label: "Sorting", href: "/visualizer/sorting" },
    { label: "Searching", href: "/visualizer/searching" },
    { label: "Pathfinding", href: "/visualizer/pathfinding" },
    { label: "ML", href: "/visualizer/ml" },
  ];

  const moreLinks = [
    { label: "Decision", href: "/visualizer/decision" },
    { label: "Graph", href: "/visualizer/graph" },
    { label: "Structures", href: "/visualizer/datastructures" },
    { label: "All", href: "/visualizer/all" },
  ];

  return (
    <nav className="sticky top-0 z-30 border-b border-white/10 bg-[#07101a]/78 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="mx-auto flex max-w-[88rem] flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(191 219 254)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 13l4-4 4 4" />
            </svg>
          </span>

          <span className="leading-tight">
            <span className="block text-[11px] font-medium uppercase tracking-[0.26em] text-white/40">
              AlgoWizard
            </span>
            <span className="block text-[1.05rem] font-semibold text-white">
              Visualizer
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
            {mainLinks.map((link) => navItem(link.label, link.href))}
            <div className="relative group">
              <button
                type="button"
                className={`rounded-full px-3 py-2 text-sm transition ${
                  moreLinks.some((link) => isActive(link.href))
                    ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    : "text-white/56 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                More
              </button>
              <div className="pointer-events-none absolute right-0 top-full z-40 mt-2 w-44 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                <div className="overflow-hidden rounded-[1rem] border border-white/10 bg-[#071019]/95 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block rounded-[0.8rem] px-3 py-2 text-sm transition hover:bg-white/[0.06] ${
                        isActive(link.href) ? "text-white" : "text-white/75"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/visualizer/all"
              className={`rounded-full p-2 text-sm transition ${
                isActive("/visualizer/all")
                  ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  : "text-white/56 hover:bg-white/[0.05] hover:text-white"
              }`}
              aria-label="All algorithms"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" />
              </svg>
            </Link>
          </div>

          <AuthNav />
        </div>
      </div>
    </nav>
  );
}
