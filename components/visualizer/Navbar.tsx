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
      href={href}
      className={`rounded-full px-3 py-2 transition ${
        isActive(href)
          ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "text-white/56 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      <span>{label}</span>
    </Link>
  );

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
            {navItem("Home", "/visualizer")}
            {navItem("Compare", "/visualizer/compare")}
            {navItem("Sorting", "/visualizer/sorting")}
            {navItem("Searching", "/visualizer/searching")}
            {navItem("Pathfinding", "/visualizer/pathfinding")}
            {navItem("Graph", "/visualizer/graph")}
            {navItem("Structures", "/visualizer/datastructures")}
          </div>

          <AuthNav />
        </div>
      </div>
    </nav>
  );
}
