import Link from "next/link";

import AlgorithmBackground from "components/visualizer/AlgorithmBackground";
import Navbar from "components/visualizer/Navbar";

const cornerstoneCards = [
  {
    title: "Readable Motion",
    body:
      "Each visualizer turns algorithm logic into movement that feels paced, legible, and calm, so the learner can follow the reasoning instead of chasing UI noise.",
  },
  {
    title: "Connected Topics",
    body:
      "Sorting, searching, graphs, and data structures are treated as one learning surface, with each page reinforcing ideas that appear elsewhere in the project.",
  },
  {
    title: "Persistent Context",
    body:
      "Saved states, compare mode, and page-aware chat help learners return to the exact thought process they were working through instead of starting from scratch.",
  },
  {
    title: "Minimal Interface",
    body:
      "The product avoids heavy chrome and visual clutter so the algorithm remains the main object of attention throughout the experience.",
  },
];

const methodology = [
  "Start with a category and difficulty level that matches what you want to learn next.",
  "Use step narration to connect each visual change to the decision the algorithm is making.",
  "Adjust speed or compare two algorithms on the same input to surface differences clearly.",
  "Save important states and revisit previous chats so learning can continue with continuity.",
];

const pillars = [
  {
    title: "Ordering Systems",
    body:
      "The sorting modules make local comparisons, swaps, partitioning, merging, and heap structure feel distinct rather than blending into one generic animation pattern.",
  },
  {
    title: "Search Reasoning",
    body:
      "The searching pages frame lookup as decision-making over space: either walking linearly through data or shrinking the active range with intent.",
  },
  {
    title: "Traversal Thinking",
    body:
      "Graph pages reveal how queues, stacks, distances, and ordering rules shape the path an algorithm takes through a connected structure.",
  },
];

const infrastructure = [
  "Next.js and TypeScript for a fast, maintainable product foundation",
  "Shared step-generation engines so visual behavior stays consistent",
  "Supabase-backed auth and persistence for saved states and chat history",
  "Gemini-powered contextual help grounded to the page you are on",
  "A minimal component system tuned for both desktop and mobile learning",
];

const builtBy = [
  {
    name: "G Nandakishore Reddy",
    photo: "/team/nandakishore.png",
  },
  {
    name: "V Sai Vignesh",
    photo: "/team/vignesh.png",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <Navbar />
      <AlgorithmBackground variant="landing" />

      <main className="relative z-10 mx-auto max-w-7xl space-y-10 px-6 py-10">
        <section className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(9,19,33,0.94),rgba(6,12,22,0.88))] shadow-[0_28px_80px_rgba(0,0,0,0.3)]">
          <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-200/70">
                About AlgoWizard
              </p>
              <h1 className="font-display mt-4 max-w-4xl text-4xl font-semibold leading-[0.96] text-white md:text-6xl">
                A cleaner way to understand algorithms through motion, context, and repetition.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/66 md:text-lg">
                AlgoWizard is built to make abstract computational ideas feel visible.
                Instead of treating algorithms as static code or one-off demos, the
                platform turns them into interactive study sessions with clear playback,
                saved states, compare mode, and context-aware guidance.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <MetaCard label="Focus" value="Clarity over clutter" />
              <MetaCard label="Experience" value="Interactive algorithm practice" />
              <MetaCard label="Best for" value="Students, self-learners, and demos" />
            </div>
          </div>
        </section>

        <Section
          title="Our Approach"
          intro="The product is designed around one idea: learners understand algorithmic behavior faster when the interface stays calm and the state changes feel intentional."
        >
          <p className="max-w-5xl text-sm leading-7 text-white/74">
            Every page aims to reduce the distance between abstract reasoning and
            visible behavior. A comparison, a swap, a traversal, or a shortest-path
            update should feel understandable at a glance, with enough structure to
            support deeper study but without overwhelming the learner.
          </p>
          <p className="max-w-5xl text-sm leading-7 text-white/68">
            That is why the platform leans on replayable states, restrained visual
            language, and guided narration. The goal is not simply to animate an
            algorithm, but to make the logic behind each step easier to retain.
          </p>
        </Section>

        <section>
          <h2 className="text-3xl font-semibold text-white">
            Core Principles
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {cornerstoneCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.7rem] border border-white/10 bg-[#091321]/80 p-6 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/64">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[1.9rem] border border-white/10 bg-[#08111d]/88 p-7">
            <h2 className="text-2xl font-semibold text-white">
              Learning Flow
            </h2>
            <ol className="mt-6 space-y-4 text-sm leading-7 text-white/72">
              {methodology.map((item, index) => (
                <li key={item}>
                  <span className="mr-2 font-semibold text-blue-200">
                    {index + 1}.
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[1.9rem] border border-white/10 bg-[#08111d]/88 p-7">
            <h2 className="text-2xl font-semibold text-white">
              Topic Pillars
            </h2>
            <div className="mt-6 space-y-6">
              {pillars.map((pillar) => (
                <div key={pillar.title}>
                  <h3 className="text-lg font-semibold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/66">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Section
          title="Technology Behind It"
          intro="The platform is structured so product features and learning tools can grow without fragmenting the experience."
        >
          <ul className="space-y-3 text-sm leading-7 text-white/72">
            {infrastructure.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </Section>

        <section>
          <h2 className="text-3xl font-semibold text-white">Built By</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {builtBy.map((person) => (
              <div key={person.name} className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-white/12 bg-white/8">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-white font-semibold">{person.name}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-blue-400/15 bg-[linear-gradient(145deg,rgba(14,38,72,0.44),rgba(7,15,28,0.82))] px-8 py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200/68">
            Built by G Nandakishore Reddy
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-white md:text-4xl">
            Explore the workspace the way it was meant to be used.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/66 md:text-base">
            Open the visualizer, compare strategies side by side, save exact states,
            and use the chatbot as a study companion while you work through each topic.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/visualizer"
              className="rounded-full bg-blue-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Open visualizer
            </Link>
            <a
              href="https://github.com/N9601"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-3 text-sm font-medium text-white/74 transition hover:bg-white/[0.08] hover:text-white"
            >
              Visit GitHub
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function Section({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.9rem] border border-white/10 bg-[#08111d]/88 p-7">
      <h2 className="text-3xl font-semibold text-white">{title}</h2>
      <p className="mt-4 max-w-4xl text-sm leading-7 text-white/68">{intro}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-white/86">{value}</div>
    </div>
  );
}
