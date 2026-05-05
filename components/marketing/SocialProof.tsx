"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  // TODO: Replace placeholder quotes with real testimonials after launch.
  {
    quote: "I already knew something was off. Seeing it in a score made it impossible to ignore.",
    author: "James, 34"
  },
  {
    quote: "The Goalpost Mover description was so accurate it was uncomfortable.",
    author: "Sarah, 41"
  },
  {
    quote:
      "I've taken every personality test out there. This one actually showed me where to focus.",
    author: "Marcus, 38"
  }
];

export function SocialProof() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative w-full bg-brand-cream px-6 py-20 md:px-10"
    >
      <div className="pointer-events-none absolute left-4 top-2 select-none font-display text-[120px] leading-none text-brand-amber/15 md:left-16">
        &ldquo;
      </div>
      <div className="mx-auto grid max-w-6xl grid-flow-col auto-cols-[88%] gap-6 overflow-x-auto pb-2 md:grid-flow-row md:auto-cols-auto md:grid-cols-3 md:overflow-visible">
        {TESTIMONIALS.map((item) => {
          const initial = item.author.charAt(0);

          return (
            <article
              key={item.author}
              className="rounded-2xl border border-brand-rule/50 bg-white p-6 shadow-soft"
            >
              <p className="font-display text-lg italic leading-relaxed text-brand-midnight">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-amber-light text-sm font-semibold text-brand-amber">
                  {initial}
                </span>
                <div>
                  <p className="text-sm font-medium text-brand-ink">{item.author.split(",")[0]}</p>
                  <p className="text-xs text-brand-muted">{item.author.split(",")[1]?.trim()} years old</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </motion.section>
  );
}
