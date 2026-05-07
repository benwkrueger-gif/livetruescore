'use client';

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { ALIGNMENT_TYPES } from "@/lib/constants/alignmentTypes";
import { Button } from "@/components/ui/Button";
import { getResultNarrative } from "@/lib/scoring/narratives";
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

export function ResultScreen({ result }: { result: ResultRow }) {
  const router = useRouter();
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
  const narrativeParagraphs = narrativeText
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const ringRadius = 45;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - Math.max(0, Math.min(100, score)) / 100);

  async function handleSendReport() {
    try {
      setReportError(null);
      setIsGeneratingReport(true);

      // TODO: Wire to actual report generation and Resend email in Prompt 5B.
      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: result.id })
      });

      if (!response.ok) {
        throw new Error("Failed to request report");
      }

      router.push(`/result/${result.id}/share`);
    } catch {
      setReportError("Something went wrong. Please try again.");
      setIsGeneratingReport(false);
    }
  }

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
            className="mb-12 rounded-3xl border-l-4 border-brand-amber bg-white p-8 shadow-soft md:p-10"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-8 bg-brand-amber" />
              <span className="text-xs uppercase tracking-widest text-brand-muted">YOUR ALIGNMENT READING</span>
            </div>
            {narrativeParagraphs.map((paragraph, index) => (
              <div key={`${paragraph.slice(0, 24)}-${index}`} className="mb-6 last:mb-0">
                <p className="text-balance font-display text-xl font-normal italic leading-[1.7] text-brand-midnight">
                  {paragraph}
                </p>
                {index < narrativeParagraphs.length - 1 ? (
                  <div className="mb-6 mt-0 h-px w-6 bg-brand-amber/30" />
                ) : null}
              </div>
            ))}
            {shouldShowFutureVisionQuote ? (
              <div className="mt-8 border-t border-brand-rule pt-6">
                <span className="mb-3 block text-xs uppercase tracking-widest text-brand-muted">
                  YOU SAID YOU WANT THIS TO BE TRUE IN A YEAR
                </span>
                <blockquote className="rounded-xl bg-brand-cream px-5 py-4 font-display text-lg font-normal italic leading-relaxed text-brand-midnight">
                  {futureVision}
                </blockquote>
                <p className="mt-3 text-sm text-brand-muted">
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
            <h3 className="mb-2 text-xl font-semibold text-brand-midnight">Your full report is ready to build.</h3>
            <p className="mb-8 text-base text-brand-muted">
              Everything below is specific to your answers - not a template.
            </p>

            <div className="relative mx-auto max-w-sm">
              <div className="absolute inset-x-4 bottom-0 z-0 h-full translate-y-2 rotate-2 rounded-2xl border border-brand-rule bg-white shadow-soft" />
              <div className="absolute inset-x-2 bottom-0 z-10 h-full translate-y-1 -rotate-1 rounded-2xl border border-brand-rule bg-white shadow-soft" />
              <div className="relative z-20 overflow-hidden rounded-2xl border border-brand-rule bg-white shadow-medium">
                <div className="flex h-12 items-center justify-between bg-brand-midnight px-5">
                  <span className="font-display text-sm italic text-white/70">LiveTrue</span>
                  <span className="h-2 w-2 rounded-full bg-brand-amber" />
                </div>
                <div className="relative p-6">
                  <p className="mb-1 text-sm font-semibold text-brand-midnight">{firstName}&apos;s Life Alignment Report</p>
                  <p className="mb-5 text-xs text-brand-muted">Based on your assessment results</p>

                  {[
                    "Your Full Alignment Breakdown",
                    "What Is Actually Driving Your Gaps",
                    "Your Influence Audit",
                    "Your 3 Personalized Experiments",
                    "Your Personal Alignment Path"
                  ].map((title, index) => (
                    <div key={title} className="flex items-center gap-3 border-b border-brand-rule/50 py-2.5 last:border-0">
                      <span className="w-6 shrink-0 text-xs font-semibold text-brand-amber">{String(index + 1).padStart(2, "0")}</span>
                      <span className="flex-1 text-sm font-medium text-brand-midnight">{title}</span>
                      <Lock className={`h-3 w-3 ${index === 0 ? "text-brand-amber" : "text-brand-rule"}`} />
                    </div>
                  ))}

                  <div
                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 rounded-b-2xl"
                    style={{ background: "linear-gradient(to bottom, transparent, white)" }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <h4 className="mb-2 text-balance font-display text-2xl font-normal text-brand-midnight">
                Ready to see the full picture?
              </h4>
              <p className="mb-6 text-sm text-brand-muted">
                Your report is built from your exact answers. Takes about 5 minutes to generate and arrives in your inbox.
              </p>
              <Button
                fullWidth
                size="lg"
                showArrow
                className="rounded-xl btn-amber-glow"
                loading={isGeneratingReport}
                disabled={isGeneratingReport}
                onClick={handleSendReport}
              >
                {isGeneratingReport ? "Building your report..." : "Send Me My Full Report"}
              </Button>
              {reportError ? <p className="mt-3 text-sm text-red-500">{reportError}</p> : null}
              <p className="mt-3 text-xs text-brand-muted">
                Free. Arrives at {result.email ?? "your inbox"} in about 5 minutes.
              </p>
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
