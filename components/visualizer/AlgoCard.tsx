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
    <div
  className="
    bg-white/5 backdrop-blur-md
    border border-white/10
    rounded-xl p-6
    flex flex-col justify-between
    transition-all duration-400 ease-out
    hover:-translate-y-0.5
    hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]
    hover:bg-white/10
    hover:border-white/20
  "
>
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span
            className={`text-xs px-2 py-1 rounded ${difficultyColor[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>

        <p className="mt-3 text-sm text-white/60">
          {description}
        </p>
      </div>

      <div className="flex justify-between items-center mt-6">
        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
          {tag}
        </span>

        <a
  href={href}
  className="btn-primary text-sm px-4 py-2"
>
  Visualize →
</a>

      </div>
    </div>
  )
}
