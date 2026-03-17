"use client";

import Link from "next/link";

import Navbar from "components/visualizer/Navbar";

const cards = [
  {
    title: "k-Means Clustering",
    description: "Assign points to the nearest centroid and watch clusters settle.",
    href: "/visualizer/ml/k-means",
    tag: "Unsupervised",
  },
  {
    title: "Gradient Descent",
    description: "Roll down a 2D loss surface with a learning-rate slider.",
    href: "/visualizer/ml/gradient-descent",
    tag: "Optimization",
  },
  {
    title: "Neural Network (2-layer)",
    description: "See activations, decision boundary, and quick training passes on 2D points.",
    href: "/visualizer/ml/neural-network",
    tag: "Classifier",
  },
];

export default function MLHub() {
  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Machine Learning
          </p>
          <h1 className="mt-3 text-4xl font-bold">Visualize learning dynamics</h1>
          <p className="mt-4 text-white/70">
            Explore clustering, optimization, and a simple neural net with clear, step-by-step visuals.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                {card.tag}
              </span>
              <h2 className="mt-4 text-2xl font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-white/70">{card.description}</p>
              <div className="mt-4 text-sm font-medium text-white/75 transition group-hover:text-white">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
