'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Lock, X } from "lucide-react";
import { ALIGNMENT_TYPES } from "@/lib/constants/alignmentTypes";
import { Button } from "@/components/ui/Button";
import { getFirstExperiment } from "@/lib/scoring/experiments";
import { getResultNarrative } from "@/lib/scoring/narratives";
import { cn } from "@/lib/utils";
import type { ArenaKey, GapItem } from "@/types/quiz";

interface ResultRow {
  id: string;
  score_label: string | null;
  alignment_score: number | null;
  alignment_type: string | null;
  top_gaps: GapItem[] | null;
  first_name: string | null;
  future_vision: string | null;
  newsletter_opt_in: boolean | null;
  influence_source: string | null;
  envy_signal: string | null;
  deferred_dream_category: string | null;
  email: string | null;
}

const influenceLabels: Record<string, string> = {
  parents: "your parents and upbringing",
  partner_family: "your partner or family",
  peers: "your peers and social circle",
  society: "society and cultural pressure",
  past_decisions: "decisions you made years ago",
  inner_critic: "your inner critic"
};

export function ResultScreen({ result }: { result: ResultRow }) {
  const score = result.alignment_score ?? 0;
  const scoreLabel = result.score_label ?? "Partially Aligned";
  const topGaps = (result.top_gaps ?? []) as GapItem[];
  const topGap = topGaps[0];
  const typeData = ALIGNMENT_TYPES.find((item) => item.key === result.alignment_type) ?? ALIGNMENT_TYPES[4];
  const firstName = result.first_name || "Friend";
  const narrative = getResultNarrative(typeData.key, {
    firstName,
    topArenaLabel: topGap?.label ?? "your biggest gap",
    futureVision: result.future_vision
  });
  const narrativeParts = narrative.split("\n\n");
  const experiment = getFirstExperiment((topGap?.arena ?? "freedom") as ArenaKey);
  const influenceLabel = influenceLabels[result.influence_source ?? ""] ?? "multiple outside voices";

  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [showExperiment, setShowExperiment] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const experimentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = Math.max(0, Math.min(100, score));
    const phaseOneTarget = Math.round(target * 0.8);
    let current = 0;
    const first = window.setInterval(() => {
      current += 1;
      setScoreDisplay(current);
      if (current >= phaseOneTarget) {
        window.clearInterval(first);
        const second = window.setInterval(() => {
          current += 1;
          setScoreDisplay(current);
          if (current >= target) {
            window.clearInterval(second);
          }
        }, 35);
      }
    }, 18);

    return () => window.clearInterval(first);
  }, [score]);

  const shareText = useMemo(
    () =>
      `My Life Alignment Score: ${score}/100
Type: ${typeData.name}
Biggest gap: ${topGap?.label ?? "Unknown"}

What is yours? livetruescore.vercel.app`,
    [score, typeData.name, topGap?.label]
  );

  return (
    <div className="min-h-screen bg-brand-cream">
      <AnimatePresence>
        <motion.main
          key={result.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto max-w-2xl px-6 py-12 md:py-20"
        >
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16 text-center"
          >
            <span className="mb-6 block text-xs uppercase tracking-widest text-brand-muted">
              YOUR LIFE ALIGNMENT SCORE
            </span>
            <p className="font-display text-[96px] font-normal leading-none tabular-nums text-brand-amber md:text-[120px]">
              {scoreDisplay}
            </p>
            <span className="mt-4 inline-block rounded-full bg-brand-amber-light px-5 py-1.5 text-sm font-medium text-brand-amber">
              {scoreLabel}
            </span>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
            className="mb-8 rounded-3xl border border-brand-rule/50 bg-white p-8 shadow-medium"
          >
            <span className="mb-3 block text-xs uppercase tracking-widest text-brand-muted">YOUR ALIGNMENT TYPE</span>
            <h2 className="mb-2 font-display text-3xl font-normal text-brand-midnight">{typeData.name}</h2>
            <p className="mb-5 text-lg italic text-brand-muted">{typeData.tagline}</p>
            <hr className="mb-5 border-brand-rule" />
            <p className="text-base leading-relaxed text-brand-ink-2">{typeData.description}</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.4 }}
            className="mb-8"
          >
            <span className="mb-2 block text-xs uppercase tracking-widest text-brand-muted">YOUR TOP GAPS</span>
            <p className="mb-6 text-sm text-brand-muted">
              The areas where your values and your life are furthest apart.
            </p>
            {topGaps.slice(0, 3).map((gap, index) => (
              <div key={gap.arena} className="mb-6 last:mb-0">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-brand-midnight">
                    {gap.emoji} {gap.label}
                  </p>
                  {gap.importance >= 2.0 ? (
                    <span className="rounded-full bg-brand-amber-light px-2 py-0.5 text-xs font-medium text-brand-amber">
                      Top value
                    </span>
                  ) : gap.importance >= 1.5 ? (
                    <span className="rounded-full bg-brand-amber-light px-2 py-0.5 text-xs font-medium text-brand-amber">
                      Core value
                    </span>
                  ) : null}
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-rule">
                  <motion.div
                    className="h-full rounded-full bg-brand-amber"
                    initial={{ width: 0 }}
                    animate={{ width: `${(gap.satisfaction / 10) * 100}%` }}
                    transition={{ duration: 0.9, delay: 3.6 + index * 0.2 }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-brand-muted">
                  <span>Not living it</span>
                  <span>{gap.satisfaction}/10</span>
                </div>
              </div>
            ))}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 4.2 }}
            className="mb-8 rounded-3xl bg-brand-midnight p-8"
          >
            <span className="mb-4 block text-xs uppercase tracking-widest text-white/40">YOUR ALIGNMENT READING</span>
            <p className="font-display text-xl font-normal italic leading-relaxed text-white">{narrativeParts[0]}</p>
            {narrativeParts[1] ? (
              <p className="mt-4 text-base leading-relaxed text-white/60">{narrativeParts[1]}</p>
            ) : null}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 4.6 }}
            className="mb-8"
          >
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-brand-midnight">YOUR FULL REPORT</h3>
            <div className="relative">
              {[
                {
                  heading: "Your Full Alignment Breakdown",
                  preview:
                    "Here is how all 8 areas of your life are scoring against your values, not just the top 3. Each area analyzed against what you told us matters most..."
                },
                {
                  heading: "What Is Actually Driving Your Gaps",
                  preview:
                    "Based on what you sacrifice first and what you most envy in others, here is the root cause pattern behind your score..."
                },
                {
                  heading: "Your Influence Audit",
                  preview: `You indicated that ${influenceLabel} has the loudest voice in shaping the life you feel supposed to be living. Here is what that means for your gaps...`
                },
                {
                  heading: "Your 3 Personalized Experiments",
                  preview:
                    "One specific micro-experiment for each of your top gaps, built around your exact value profile. Designed to build on each other week by week...",
                  badge: "Most requested"
                },
                {
                  heading: "Your Personal Alignment Path",
                  preview: result.future_vision?.trim()
                    ? `You said you want ${result.future_vision.trim().split(" ").slice(0, 10).join(" ")}... Here is what closing your specific gaps looks like over time...`
                    : "A personalized roadmap for closing your gaps based on your value profile and alignment type..."
                }
              ].map((item, index) => (
                <div
                  key={item.heading}
                  className={cn(
                    "relative mb-6 overflow-hidden rounded-2xl border border-brand-rule bg-white p-6",
                    index >= 3 ? "opacity-80" : "opacity-100"
                  )}
                >
                  {item.badge ? (
                    <span className="absolute right-4 top-4 rounded-full bg-brand-amber-light px-2 py-0.5 text-xs text-brand-amber">
                      {item.badge}
                    </span>
                  ) : null}
                  <h4 className="mb-1 text-base font-semibold text-brand-midnight">{item.heading}</h4>
                  <p className="text-sm leading-relaxed text-brand-muted">{item.preview}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-gradient-to-b from-transparent via-white to-white" />
                  <p className="mt-3 text-sm text-brand-muted opacity-30 blur-sm">
                    Deep breakdown continues here with weighted arena diagnostics, signal patterns, and next-week sequencing recommendations.
                  </p>
                </div>
              ))}

              <div className="relative z-10 mx-auto my-6 max-w-sm rounded-3xl border border-brand-amber/20 bg-white p-8 text-center shadow-strong">
                <Lock className="mx-auto mb-4 h-8 w-8 text-brand-amber" />
                <h4 className="mb-3 text-balance font-display text-2xl font-normal text-brand-midnight">
                  Unlock your full report
                </h4>
                <p className="mb-4 text-balance text-sm leading-relaxed text-brand-muted">
                  LiveTrue is a living practice that walks alongside you as you close the gap. Weekly
                  experiments that build on each other, monthly deeper reflections, and your score evolving as
                  your life does. Not a course. Not coaching. A practice.
                </p>
                <p className="mb-4 text-sm font-semibold text-brand-midnight">
                  Founding member rate: $69/year - limited spots
                </p>
                {!waitlistJoined ? (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => {
                      // TODO: connect to Beehiiv waitlist tag via API.
                      setWaitlistJoined(true);
                    }}
                  >
                    Join the Founding Member Waitlist
                  </Button>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <CheckCircle className="mx-auto mb-2 h-6 w-6 text-brand-sage" />
                    <p className="text-sm font-medium text-brand-sage">You are on the list.</p>
                    <p className="mt-1 text-xs text-brand-muted">We will reach out before founding spots open.</p>
                  </motion.div>
                )}
                <p className="mt-3 text-xs text-brand-muted">
                  No payment now. We will contact you with founding member details before we launch.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 5 }}
            className="mb-8 border-t border-brand-rule pt-8"
          >
            <div className="rounded-2xl border border-brand-rule bg-brand-cream-dark p-6 text-center">
              <h4 className="mb-2 text-base font-semibold text-brand-midnight">Not ready to commit?</h4>
              <p className="mb-5 text-sm text-brand-muted">
                Share your score and unlock your first personalized experiment free - specific to your biggest
                gap, immediately actionable.
              </p>
              <Button variant="secondary" fullWidth onClick={() => setShowShareModal(true)}>
                Share my score - unlock my experiment
              </Button>
            </div>
          </motion.section>

          <AnimatePresence>
            {showShareModal ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-brand-midnight/60 px-6 backdrop-blur-sm"
              >
                <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-strong">
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-brand-muted"
                    onClick={() => setShowShareModal(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <h4 className="mb-6 font-display text-2xl font-normal text-brand-midnight">Share your score</h4>
                  <div className="relative mb-6 overflow-hidden rounded-2xl bg-brand-midnight p-5 text-center">
                    <p className="pointer-events-none absolute -right-4 -top-4 select-none font-display text-[120px] leading-none text-white/[0.04]">
                      {score}
                    </p>
                    <p className="mb-3 text-sm italic text-white/50">LiveTrue</p>
                    <p className="font-display text-5xl font-normal leading-none text-brand-amber">{score}</p>
                    <p className="mb-3 mt-1 text-xs text-white/50">{scoreLabel}</p>
                    <p className="text-base italic text-white">I am a {typeData.name}</p>
                    <p className="mt-1 text-xs text-white/40">
                      Biggest gap: {topGap?.emoji} {topGap?.label}
                    </p>
                  </div>
                  <textarea
                    readOnly
                    value={shareText}
                    onClick={(event) => event.currentTarget.select()}
                    className="mb-4 w-full rounded-xl bg-brand-cream p-4 text-sm leading-relaxed text-brand-muted outline-none"
                  />
                  <Button
                    fullWidth
                    className="mb-3"
                    onClick={async () => {
                      await navigator.clipboard.writeText(shareText);
                      setShareCopied(true);
                      window.setTimeout(() => setShareCopied(false), 2000);
                    }}
                  >
                    {shareCopied ? "Copied!" : "Copy share text"}
                  </Button>
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      setShowShareModal(false);
                      setShowExperiment(true);
                      setTimeout(() => experimentRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
                    }}
                  >
                    Done sharing - show me my experiment
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {showExperiment ? (
              <motion.section
                ref={experimentRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 mt-8"
              >
                <span className="mb-4 block text-xs uppercase tracking-widest text-brand-amber">YOUR FIRST EXPERIMENT</span>
                <p className="mb-4 text-sm text-brand-muted">
                  Specific to your biggest gap in {topGap?.label ?? "your top arena"}.
                </p>
                <div className="rounded-2xl bg-brand-midnight p-7">
                  <p className="mb-3 text-xs uppercase tracking-wider text-white/40">
                    {topGap?.emoji} {topGap?.label}
                  </p>
                  <h4 className="mb-4 font-display text-2xl font-normal italic text-white">{experiment.title}</h4>
                  <p className="text-base leading-relaxed text-white/75">{experiment.description}</p>
                </div>
                <p className="mt-4 text-center text-xs text-brand-muted">
                  This is one of the experiments included in the full LiveTrue program.
                </p>
              </motion.section>
            ) : null}
          </AnimatePresence>

          {result.newsletter_opt_in ? (
            <section className="mt-6 text-center">
              <p className="text-xs text-brand-muted">
                Your free weekly experiment is already on its way to {result.email ?? "your inbox"}.
              </p>
            </section>
          ) : null}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
