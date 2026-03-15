import Link from "next/link";

type Props = {
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  href: string
  tag: string
}

const difficultyColor = {
  Easy: "bg-green-500/20 text-green-400",
  Medium: "bg-yellow-500/20 text-yellow-400",
  Hard: "bg-red-500/20 text-red-400",
}

export default function AlgoCard({
  title,
  description,
  difficulty,
  href,
  tag,
}: Props) {
  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyColor[difficulty]}`}
            >
              {difficulty}
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/60">{description}</p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/60">
            {tag}
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-white/72 transition group-hover:text-white">
            Open
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </article>
    </Link>
  )
}
