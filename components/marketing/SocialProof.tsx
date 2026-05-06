"use client";

import { motion } from "framer-motion";

const RESEARCH_STATS = [
  {
    stat: "80%",
    label: "of people report feeling their life doesn't fully reflect what matters most to them",
    source: "- APA Stress in America Report"
  },
  {
    stat: "#1",
    label: "regret of the dying is not having lived more true to themselves",
    source: "- Bronnie Ware, The Top 5 Regrets of the Dying"
  },
  {
    stat: "2x",
    label: "more likely to report high life satisfaction when living aligned with personal values",
    source: "- Journal of Personality and Social Psychology"
  }
];

export function SocialProof() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full bg-brand-cream px-6 py-16 md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <h3 className="text-center text-sm uppercase tracking-widest text-brand-muted">
          GROUNDED IN RESEARCH
        </h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {RESEARCH_STATS.map((item) => (
            <article
              key={item.stat}
              className="rounded-2xl border border-brand-rule bg-white p-6 text-center shadow-soft"
            >
              <p className="font-display text-4xl text-brand-amber">{item.stat}</p>
              <p className="mt-3 text-brand-ink-2">{item.label}</p>
              <p className="mt-3 text-xs text-brand-muted">{item.source}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-brand-muted">
          Results vary. The Life Alignment Score is a self-reflection tool, not a clinical
          assessment.
        </p>
      </div>
    </motion.section>
  );
}
