'use client';

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Lock } from "lucide-react";
import { ALIGNMENT_TYPES } from "@/lib/constants/alignmentTypes";
import { Button } from "@/components/ui/Button";
import { getResultNarrative } from "@/lib/scoring/narratives";
import { cn } from "@/lib/utils";
import type { GapItem } from "@/types/quiz";

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
    futureVision: ""
  });
  const futureVision = result.future_vision?.trim() ?? "";
  const influenceLabel = influenceLabels[result.influence_source ?? ""] ?? "multiple outside voices";

  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [waitlistJoined, setWaitlistJoined] = useState(false);

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
            <p className="font-display text-xl font-normal italic leading-relaxed text-white">{narrative}</p>
            {futureVision ? (
              <div className="mt-6">
                <span className="mb-2 block text-xs uppercase tracking-wider text-white/40">
                  YOU TOLD US YOU WANT THIS TO BE TRUE IN A YEAR:
                </span>
                <blockquote className="mb-4 rounded-xl bg-white/10 px-5 py-4 font-display text-lg font-normal italic leading-relaxed text-white">
                  {futureVision}
                </blockquote>
                <p className="text-sm leading-relaxed text-white/60">
                  That is exactly what closing your gaps points toward.
                </p>
              </div>
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
                <Lock className="mx-auto mb-4 h-7 w-7 text-brand-amber" />
                <h4 className="mb-2 text-balance font-display text-2xl font-normal text-brand-midnight">
                  Unlock your full report
                </h4>
                <p className="mb-5 text-sm text-brand-muted">Join the waitlist to get instant access.</p>
                <ul className="mb-5 space-y-2.5 text-left">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                    <span className="text-sm leading-snug text-brand-ink-2">
                      Your complete 8-arena breakdown with written analysis
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                    <span className="text-sm leading-snug text-brand-ink-2">
                      The root cause behind your specific gaps
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                    <span className="text-sm leading-snug text-brand-ink-2">Your personal influence audit</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                    <span className="text-sm leading-snug text-brand-ink-2">
                      3 experiments calibrated to your exact value profile
                      <span className="ml-2 inline-block rounded-full bg-brand-amber-light px-2 py-0.5 text-xs font-semibold text-brand-amber">
                        Most wanted
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                    <span className="text-sm leading-snug text-brand-ink-2">
                      Your Personal Alignment Path to get where you want to be
                    </span>
                  </li>
                </ul>
                <p className="mb-5 text-center text-xs italic text-brand-muted">
                  Every experiment is specific to your alignment type and top gap, not generic advice.
                </p>
                <hr className="mb-5 border-brand-rule" />
                {!waitlistJoined ? (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => {
                      // TODO: connect to Beehiiv waitlist tag via API.
                      setWaitlistJoined(true);
                    }}
                  >
                    Yes, put me on the waitlist
                  </Button>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <CheckCircle className="mx-auto mb-2 h-7 w-7 text-brand-sage" />
                    <p className="text-sm font-medium text-brand-sage">You are on the list.</p>
                    <p className="mx-auto mt-1 max-w-[220px] text-xs leading-relaxed text-brand-muted">
                      Check your email for the full report and updates as we prepare to launch LiveTrue.
                    </p>
                  </motion.div>
                )}
                <p className="mt-3 text-xs text-brand-muted">
                  No payment required. Founding member offer details to follow.
                </p>
              </div>
            </div>
          </motion.section>

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
