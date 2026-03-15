type VideoWheelProps = {
  title: string;
  category: string;
};

type VideoLink = {
  label: string;
  caption: string;
  href: string;
};

function buildVideoLinks(title: string, category: string): VideoLink[] {
  const topic =
    category === "Data Structure" ? `${title} data structure` : title;

  return [
    {
      label: "Overview",
      caption: "Quick concept refresher",
      href: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${topic} explained`
      )}`,
    },
    {
      label: "Visualization",
      caption: "Animation and intuition",
      href: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${topic} visualization`
      )}`,
    },
    {
      label: "Walkthrough",
      caption: "Implementation-focused video",
      href: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${topic} walkthrough`
      )}`,
    },
  ];
}

export default function VideoWheel({ title, category }: VideoWheelProps) {
  const links = buildVideoLinks(title, category);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
            YouTube Study Wheel
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Keep learning {title}
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-white/60">
          These links open topic-specific YouTube results for a quick overview,
          a visual explanation, and a practical walkthrough.
        </p>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-1">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[15rem] rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="text-sm font-semibold text-white">{link.label}</div>
            <p className="mt-2 text-sm leading-6 text-white/58">
              {link.caption}
            </p>
            <div className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-blue-300">
              Open on YouTube
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
