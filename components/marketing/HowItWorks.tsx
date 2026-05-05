"use client";

import { motion } from "framer-motion";
import { Heart, Search, Target } from "lucide-react";

const STEPS = [
  {
    step: "01",
    Icon: Search,
    title: "Rate your life arenas",
    body: "8 quick ratings across the areas that matter — work, relationships, freedom, contribution, and more."
  },
  {
    step: "02",
    Icon: Heart,
    title: "Surface what actually matters to you",
    body: "Select and rank your core values. Your score measures alignment to YOUR values — not some external template."
  },
  {
    step: "03",
    Icon: Target,
    title: "See exactly where you've drifted",
    body: "Your score, your alignment type, and your top 3 gaps. The 'yes, that's exactly it' moment people come back for."
  }
];

export function HowItWorks() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="w-full bg-brand-cream-dark px-6 py-24 md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-center">
          <span className="inline-flex rounded-full border border-brand-amber/40 bg-brand-amber-light px-3 py-1 text-xs font-medium tracking-wide text-brand-amber">
            HOW IT WORKS
          </span>
        </div>
        <h2 className="mt-6 text-center font-display text-4xl font-normal tracking-tight text-brand-midnight md:text-5xl">
          From vague feeling to clear picture.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-brand-muted">
          Three phases that surface what other tools miss.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {STEPS.map((item) => (
            <article
              key={item.step}
              className="rounded-2xl bg-white p-8 shadow-soft transition-shadow duration-300 hover:shadow-medium"
            >
              <p className="font-display text-6xl font-bold leading-none text-brand-amber/20">
                {item.step}
              </p>
              <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-amber-light text-brand-amber">
                <item.Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-brand-midnight">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-brand-ink-2">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
