"use client";

import { Button } from "@/components/ui/Button";

interface QuestionTextProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onSkip: () => void;
  placeholder: string;
  skipLabel: string;
}

export function QuestionText({
  value,
  onChange,
  onNext,
  onSkip,
  placeholder,
  skipLabel
}: QuestionTextProps) {
  return (
    <div className="rounded-3xl border border-brand-rule bg-white p-6 shadow-soft md:p-8">
      <textarea
        rows={5}
        value={value}
        maxLength={500}
        onFocus={(event) => {
          setTimeout(() => event.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
        }}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-brand-rule bg-brand-cream px-4 py-4 text-base text-brand-ink outline-none transition-all focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/20"
      />
      <p className="mt-2 text-right text-xs text-brand-muted">{value.length} / 500</p>
      <Button size="lg" fullWidth className="mt-5" onClick={onNext} showArrow>
        Next
      </Button>
      <button type="button" onClick={onSkip} className="mt-4 text-xs text-brand-muted hover:text-brand-ink-2">
        {skipLabel}
      </button>
    </div>
  );
}
