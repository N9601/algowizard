"use client"

type Variant =
  | "landing"
  | "sorting"
  | "searching"
  | "graph"
  | "datastructure"

export default function AlgorithmBackground({ variant }: { variant: Variant }) {
  const accentClass = {
    landing: "from-cyan-400/16 via-blue-500/10 to-transparent",
    sorting: "from-blue-400/16 via-sky-500/10 to-transparent",
    searching: "from-emerald-400/14 via-teal-500/10 to-transparent",
    graph: "from-fuchsia-400/14 via-blue-500/10 to-transparent",
    datastructure: "from-amber-300/12 via-blue-500/10 to-transparent",
  }[variant]

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#050b14]" />
      <div
        className={`absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b ${accentClass}`}
      />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-blue-500/12 blur-3xl" />
      <div className="absolute right-[-5rem] top-32 h-80 w-80 rounded-full bg-cyan-300/8 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-white/[0.035] blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.12]" />
    </div>
  )
}
