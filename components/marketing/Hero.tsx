"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-brand-cream px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto grid min-h-[72vh] w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-flex rounded-full border border-brand-amber/40 bg-brand-amber-light px-3 py-1 text-xs font-medium tracking-wide text-brand-amber">
            LIFE ALIGNMENT SCORE
          </span>
          <h1 className="mt-6 text-balance font-display text-5xl font-normal leading-[1.1] tracking-[-0.02em] text-brand-midnight md:text-6xl lg:text-7xl">
            <span className="block">Most people are</span>
            <span className="block">living a life</span>
            <span className="block italic text-brand-amber">that&apos;s mostly theirs.</span>
          </h1>
          <p className="mt-6 max-w-sm text-balance text-lg leading-relaxed text-brand-ink-2">
            The Life Alignment Score measures the gap between what you actually value and how
            you&apos;re actually living, in 5 minutes. Free. No coaching call on the other end.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/quiz">
              <Button size="lg" showArrow>
                Get Your Free Score
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-brand-muted">
            <p>✓ 16 questions</p>
            <p>✓ 5 minutes</p>
            <p>✓ Completely free</p>
          </div>
        </div>

        <motion.aside
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-full max-w-md lg:rotate-1"
        >
          <div
            className="rounded-3xl border border-brand-rule/70 bg-white p-8 shadow-strong"
            style={{
              boxShadow:
                "0 32px 80px rgba(212,98,42,0.08), 0 8px 32px rgba(0,0,0,0.08)"
            }}
          >
            <p className="text-xs uppercase tracking-[0.16em] text-brand-muted">LIFE ALIGNMENT SCORE</p>
            <p className="mt-3 font-display text-[96px] leading-none text-brand-amber">68</p>
            <span className="inline-flex rounded-full bg-brand-cream-dark px-3 py-1 text-sm text-brand-ink-2">
              Partially Aligned
            </span>

            <div className="my-6 h-px w-full bg-brand-rule" />
            <p className="text-sm text-brand-muted">Your type</p>
            <p className="mt-1 font-display text-[18px] italic text-brand-midnight">
              The Goalpost Mover
            </p>

            <div className="mt-6 space-y-4">
              {[
                { label: "Contribution & Meaning", width: "30%" },
                { label: "Play & Adventure", width: "45%" },
                { label: "Creative Expression", width: "55%" }
              ].map((item) => (
                <div key={item.label}>
                  <p className="mb-1 text-xs text-brand-muted">{item.label}</p>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-brand-amber/95"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button size="sm" fullWidth className="pointer-events-none mt-7">
              See your full report →
            </Button>
          </div>
        </motion.aside>
      </div>
    </motion.section>
  );
}
