import type { QuizResult } from "@/types/quiz";

interface ScoreCardProps {
  result: QuizResult;
}

export function ScoreCard({ result }: ScoreCardProps) {
  return (
    <article className="rounded-2xl border border-brand-rule bg-brand-card p-6">
      <p className="text-sm uppercase tracking-[0.16em] text-brand-muted">Life Alignment Score</p>
      <p className="mt-2 text-5xl font-semibold text-brand-midnight">{result.score}</p>
      <p className="mt-1 text-brand-muted">{result.scoreLabel}</p>
    </article>
  );
}
