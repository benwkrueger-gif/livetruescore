"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Hero } from "@/components/marketing/Hero";
import { SocialProof } from "@/components/marketing/SocialProof";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <main className="relative">
      <Hero />
      <SocialProof />
      <HowItWorks />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full bg-brand-midnight px-6 py-24 md:px-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,98,42,0.06) 0%, transparent 70%), #111827"
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <span className="inline-flex rounded-full border border-brand-amber/30 bg-brand-amber/10 px-3 py-1 text-xs font-medium tracking-wide text-brand-amber">
              THE #1 DEATHBED REGRET
            </span>
          </div>
          <h2 className="mt-6 text-balance font-display text-4xl font-normal leading-[1.2] text-white md:text-5xl">
            They didn&apos;t live true to themselves.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-white/60">
            Find out where you stand. Free. Takes 5 minutes.
          </p>
          <div className="mx-auto mt-10 max-w-sm">
            <Link href="/quiz">
              <Button size="lg" fullWidth showArrow>
                Get Your Life Alignment Score
              </Button>
            </Link>
            <p className="mt-4 text-xs text-white/30">No account needed. Results shown instantly.</p>
          </div>
        </div>
      </motion.section>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.4 }}
        className="border-t border-white/10 bg-brand-midnight px-6 py-8 md:px-10"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <p className="font-display text-lg italic text-white/50">LiveTrue</p>
          <p className="text-xs text-white/30">Life Alignment Score · © 2026</p>
        </div>
      </motion.footer>
    </main>
  );
}
