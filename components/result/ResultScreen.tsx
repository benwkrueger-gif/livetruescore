'use client';

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Share2 } from "lucide-react";
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
  ai_narrative: string | null;
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
  const futureVision = result.future_vision?.trim() ?? "";
  const narrativeText =
    result.ai_narrative ||
    getResultNarrative(typeData.key, {
      firstName,
      topArenaLabel: topGap?.label ?? "your biggest gap",
      futureVision
    });
  const futureVisionFirstFiveWords = futureVision.split(/\s+/).slice(0, 5).join(" ").toLowerCase();
  const shouldShowFutureVisionQuote =
    !!futureVision &&
    (!futureVisionFirstFiveWords ||
      !narrativeText.toLowerCase().includes(futureVisionFirstFiveWords));
  const influenceLabel = influenceLabels[result.influence_source ?? ""] ?? "multiple outside voices";

  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const ringRadius = 45;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - Math.max(0, Math.min(100, score)) / 100);

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
            className="relative overflow-hidden py-24 text-center"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,98,42,0.08) 0%, transparent 70%)"
              }}
            />
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
              <svg className="h-[200px] w-[200px] md:h-[240px] md:w-[240px]" viewBox="0 0 100 100" fill="none">
                <circle
                  cx="50%"
                  cy="50%"
                  r={ringRadius}
                  stroke="rgba(212,98,42,0.15)"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r={ringRadius}
                  stroke="rgba(212,98,42,0.5)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  initial={{ strokeDashoffset: ringCircumference }}
                  animate={{ strokeDashoffset: ringOffset }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                />
              </svg>
            </div>
            <span className="relative z-10 mb-8 block text-xs uppercase tracking-widest text-brand-muted">
              YOUR LIFE ALIGNMENT SCORE
            </span>
            <p className="relative z-10 font-display text-[120px] font-normal leading-none tabular-nums text-brand-amber md:text-[160px]">
              {scoreDisplay}
            </p>
            <span className="relative z-10 mt-4 inline-block rounded-full bg-brand-amber-light px-5 py-1.5 text-sm font-medium text-brand-amber">
              {scoreLabel}
            </span>
            <div className="mx-auto mt-6 h-px w-12 bg-brand-amber/30" />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
            className="my-12 border-y border-brand-rule py-12"
          >
            <span className="mb-3 block text-xs uppercase tracking-widest text-brand-muted">YOUR ALIGNMENT TYPE</span>
            <h2 className="mb-3 text-balance font-display text-5xl font-normal leading-[1.1] text-brand-midnight md:text-6xl">
              {typeData.name}
            </h2>
            <p className="mb-8 font-display text-xl font-normal italic text-brand-amber">{typeData.tagline}</p>
            <p className="max-w-prose text-lg leading-relaxed text-brand-ink-2">{typeData.description}</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.4 }}
            className="mb-8 pt-12"
          >
            <div className="mb-8 flex items-baseline justify-between">
              <span className="block text-xs uppercase tracking-widest text-brand-muted">YOUR TOP GAPS</span>
              <p className="text-xs italic text-brand-muted">Ranked by what matters most to you</p>
            </div>
            {topGaps.slice(0, 3).map((gap, index) => (
              <div key={gap.arena} className="mb-8 last:mb-0">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cream-dark text-xl">
                      {gap.emoji}
                    </span>
                    <p className="text-base font-semibold text-brand-midnight">{gap.label}</p>
                  </div>
                  {gap.importance >= 2.0 ? (
                    <span className="rounded-full bg-brand-amber px-3 py-1 text-xs font-semibold text-white">
                      Top value
                    </span>
                  ) : gap.importance >= 1.5 ? (
                    <span className="rounded-full bg-brand-amber-light px-3 py-1 text-xs font-semibold text-brand-amber">
                      Core value
                    </span>
                  ) : null}
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-brand-rule/60">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-brand-amber"
                    initial={{ width: 0 }}
                    animate={{ width: `${(gap.satisfaction / 10) * 100}%` }}
                    transition={{ duration: 0.9, delay: 3.6 + index * 0.2 }}
                  />
                  <motion.div
                    className="absolute top-0 h-full w-10 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)"
                    }}
                    initial={{ x: -40 }}
                    animate={{ x: `calc(${(gap.satisfaction / 10) * 100}% + 40px)` }}
                    transition={{ duration: 0.6, delay: 3.8 + index * 0.2, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-brand-muted">Not living it</span>
                  <span className="text-sm font-semibold text-brand-midnight">{gap.satisfaction}/10</span>
                </div>
              </div>
            ))}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 4.2 }}
            className="mb-12 overflow-hidden rounded-3xl pt-4"
          >
            <div className="h-1 w-full bg-brand-amber" />
            <div className="bg-brand-midnight p-10 md:p-12">
              <span className="mb-8 block text-xs uppercase tracking-widest text-white/30">YOUR ALIGNMENT READING</span>
              {(() => {
                const [firstChunk, secondChunk] = narrativeText.split("\n\n");
                return (
                  <>
                    <p className="font-display text-2xl font-normal italic leading-[1.6] text-white md:text-3xl">
                      {firstChunk}
                    </p>
                    {secondChunk ? (
                      <p className="mt-6 text-base leading-relaxed text-white/60">{secondChunk}</p>
                    ) : null}
                  </>
                );
              })()}
              {shouldShowFutureVisionQuote ? (
                <div className="mt-8 border-l-2 border-brand-amber/40 pl-5">
                  <span className="mb-3 block text-xs uppercase tracking-widest text-white/30">
                    YOU TOLD US YOU WANT THIS TO BE TRUE IN A YEAR
                  </span>
                  <blockquote className="font-display text-xl font-normal italic leading-relaxed text-white/80">
                    {futureVision}
                  </blockquote>
                  <p className="mt-3 text-sm leading-relaxed text-white/40">
                    That is exactly what closing your gaps points toward.
                  </p>
                </div>
              ) : null}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 4.0 }}
            className="mb-12 pt-12"
          >
            <div
              className="w-full overflow-hidden rounded-3xl bg-brand-midnight p-8 md:p-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 80%, rgba(212,98,42,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,98,42,0.06) 0%, transparent 50%)"
              }}
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-base italic text-white/50">LiveTrue</span>
                <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-brand-amber" />
              </div>
              <div className="mt-6">
                <p className="font-display text-8xl font-normal leading-none text-brand-amber md:text-9xl">{score}</p>
                <p className="mt-2 text-sm text-white/40">{scoreLabel}</p>
              </div>
              <div className="my-6 border-t border-white/10" />
              <div>
                <p className="mb-1 text-sm text-white/30">I am a</p>
                <p className="font-display text-2xl font-normal italic text-white md:text-3xl">{typeData.name}</p>
              </div>
              <div className="mt-4">
                <p className="mb-2 text-xs uppercase tracking-wider text-white/30">Biggest gap:</p>
                <p className="text-base font-medium text-white/70">
                  {topGap?.emoji} {topGap?.label}
                </p>
              </div>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-widest text-white/20">livetruescore.vercel.app</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-brand-midnight px-6 py-3.5 text-white transition-all duration-200 hover:border-white/20 hover:bg-brand-midnight-soft"
                onClick={async () => {
                  const shareText =
                    `My Life Alignment Score: ${score}/100\n` +
                    `I am a ${typeData.name} - ${typeData.tagline}\n` +
                    `Biggest gap: ${topGaps[0]?.label}\n\n` +
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
                }}
              >
                <Share2 className="h-4 w-4" />
                {shareCopied ? "Copied to clipboard" : "Share my score"}
              </button>
              <p className="mt-2 text-center text-xs italic text-brand-muted">
                Only share if it resonates. There&apos;s no gimmicks here.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 4.6 }}
            className="mb-8 pt-12"
          >
            <div className="mb-8 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-midnight">
                WHAT IS INSIDE YOUR FULL REPORT
              </h3>
              <span className="rounded-full border border-brand-rule bg-brand-cream-dark px-3 py-1 text-xs text-brand-muted">
                5 sections
              </span>
            </div>
            <div className="relative">
              {[
                {
                  number: "01",
                  heading: "Your Full Alignment Breakdown",
                  preview:
                    "Here is how all 8 areas of your life are scoring against your values, not just the top 3. Each area analyzed against what you told us matters most..."
                },
                {
                  number: "02",
                  heading: "What Is Actually Driving Your Gaps",
                  preview:
                    "Based on what you sacrifice first and what you most envy in others, here is the root cause pattern behind your score..."
                },
                {
                  number: "03",
                  heading: "Your Influence Audit",
                  preview: `You indicated that ${influenceLabel} has the loudest voice in shaping the life you feel supposed to be living. Here is what that means for your gaps...`
                },
                {
                  number: "04",
                  heading: "Your 3 Personalized Experiments",
                  preview:
                    "One specific micro-experiment for each of your top gaps, built around your exact value profile. Designed to build on each other week by week...",
                  badge: "Most wanted"
                },
                {
                  number: "05",
                  heading: "Your Personal Alignment Path",
                  preview: result.future_vision?.trim()
                    ? `You said you want ${result.future_vision.trim().split(" ").slice(0, 10).join(" ")}... Here is what closing your specific gaps looks like over time...`
                    : "A personalized roadmap for closing your gaps based on your value profile and alignment type..."
                }
              ].map((item, index) => (
                <div
                  key={item.heading}
                  className={cn(
                    "relative mb-6 overflow-hidden rounded-2xl border border-brand-rule border-l-4 border-l-brand-amber/20 bg-white p-6",
                    index >= 3 ? "opacity-85" : "opacity-100"
                  )}
                >
                  {item.badge ? (
                    <span className="absolute right-4 top-4 rounded-full bg-brand-amber px-2 py-0.5 text-xs text-white">
                      {item.badge}
                    </span>
                  ) : null}
                  <p className="mb-1 text-xs font-medium text-brand-muted/50">{item.number}</p>
                  <h4 className="mb-2 text-base font-semibold text-brand-midnight">{item.heading}</h4>
                  <p className="text-sm leading-relaxed text-brand-muted">{item.preview}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-gradient-to-b from-transparent from-[30%] via-white to-white" />
                  <p className="mt-3 text-sm text-brand-muted opacity-25 blur-[6px]">
                    Deep breakdown continues here with weighted arena diagnostics, signal patterns, and next-week sequencing recommendations.
                  </p>
                </div>
              ))}

              <div className="relative z-10 mx-auto my-6 max-w-sm rounded-3xl border border-brand-amber/20 bg-white p-8 text-center shadow-strong">
                <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-brand-amber" />
                <h4 className="mb-1 text-balance font-display text-2xl font-normal text-brand-midnight">
                  Unlock your full report
                </h4>
                <p className="mb-6 text-sm text-brand-muted">
                  Free for founding members. Join the waitlist to access it at launch.
                </p>
                <ul className="mb-5 space-y-0 text-left">
                  <li className="mb-3 flex items-start gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                    <span className="text-sm leading-snug text-brand-ink-2">
                      Your complete 8-arena breakdown with written analysis
                    </span>
                  </li>
                  <li className="mb-3 flex items-start gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                    <span className="text-sm leading-snug text-brand-ink-2">
                      The root cause behind your specific gaps
                    </span>
                  </li>
                  <li className="mb-3 flex items-start gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                    <span className="text-sm leading-snug text-brand-ink-2">Your personal influence audit</span>
                  </li>
                  <li className="mb-3 flex items-start gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                    <span className="text-sm leading-snug text-brand-ink-2">
                      3 experiments calibrated to your exact value profile
                      <span className="ml-2 inline-block rounded-full bg-brand-amber px-2 py-0.5 text-xs font-semibold text-white">
                        Most wanted
                      </span>
                    </span>
                  </li>
                  <li className="mb-3 flex items-start gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
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
                    Yes, put me on the waitlist →
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
