'use client';

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { ALIGNMENT_TYPES } from "@/lib/constants/alignmentTypes";
import type { GapItem } from "@/types/quiz";

interface SharePageProps {
  id: string;
  score: number;
  scoreLabel: string;
  alignmentType: string;
  firstName: string;
  email: string;
  topGaps: GapItem[];
}

export function SharePage({ id, score, scoreLabel, alignmentType, email, topGaps }: SharePageProps) {
  const [shareCopied, setShareCopied] = useState(false);
  const typeName = ALIGNMENT_TYPES.find((item) => item.key === alignmentType)?.name ?? "The Mid-Crossing";
  const topGap = topGaps[0];

  async function handleShare() {
    const shareText =
      `My Life Alignment Score: ${score}/100\n` +
      `I am a ${typeName}\n` +
      `Biggest gap: ${topGap?.emoji} ${topGap?.label}\n\n` +
      `Kind of uncomfortably accurate.\n` +
      `Find out yours: livetruescore.vercel.app`;

    if (navigator.share) {
      await navigator.share({
        title: "My Life Alignment Score",
        text: shareText
      });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 2500);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-6 py-16">
      <div className="mx-auto w-full max-w-sm text-center">
        <section className="mb-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-sage-light"
          >
            <CheckCircle className="h-6 w-6 text-brand-sage" />
          </motion.div>
          <h1 className="mb-3 text-balance font-display text-3xl font-normal text-brand-midnight">
            Your report is on its way.
          </h1>
          <p className="text-balance text-base leading-relaxed text-brand-muted">
            Your full report takes about 5 minutes to build and will arrive at {email}. While you wait, share your
            score. Someone you know might need to see this right now.
          </p>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 w-full overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #E8713A 0%, #C85520 45%, #8B3210 100%)"
          }}
        >
          <div className="relative overflow-hidden p-8">
            <p className="pointer-events-none absolute -right-5 -top-5 select-none font-display text-[200px] leading-none text-white/[0.05]">
              {score}
            </p>
            <div className="mb-6 flex items-start justify-between">
              <span className="font-display text-base italic text-white/60">LiveTrue</span>
              <span className="h-2 w-2 rounded-full bg-white/40" />
            </div>
            <p className="font-display text-[96px] font-normal leading-none text-white">{score}</p>
            <p className="mb-5 mt-1 text-sm text-white/60">{scoreLabel}</p>
            <div className="mb-5 border-t border-white/20" />
            <p className="mb-1 text-xs uppercase tracking-wider text-white/40">I am a</p>
            <p className="mb-4 font-display text-2xl font-normal italic text-white">{typeName}</p>
            <p className="text-sm font-medium text-white/60">
              {topGap?.emoji} {topGap?.label}
            </p>
            <div className="mt-6 border-t border-white/15 pt-5">
              <p className="text-xs uppercase tracking-widest text-white/25">livetruescore.vercel.app</p>
            </div>
          </div>
        </motion.section>

        <button
          type="button"
          onClick={handleShare}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-amber py-4 font-medium text-brand-amber transition-all duration-200 hover:bg-brand-amber hover:text-white"
        >
          <Share2 className="h-4 w-4" />
          {shareCopied ? "Copied to clipboard" : "Share my score"}
        </button>
        <p className="mt-3 text-center text-xs italic text-brand-muted">
          Share because it resonated, not because you have to.
        </p>

        <Link
          href={`/result/${id}`}
          className="mt-8 inline-block text-xs text-brand-muted underline underline-offset-2 hover:text-brand-midnight"
        >
          View my result page
        </Link>
      </div>
    </main>
  );
}
