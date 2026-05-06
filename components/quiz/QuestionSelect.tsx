'use client';

import { useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SelectOption {
  key: string;
  label: string;
}

interface QuestionSelectProps {
  question: string;
  options: SelectOption[];
  value: string | null;
  onChange: (key: string) => void;
  onNext: () => void;
  autoAdvance?: boolean;
  note?: string;
  nextLabel?: string;
}

export function QuestionSelect({
  question,
  options,
  value,
  onChange,
  onNext,
  autoAdvance = false,
  note,
  nextLabel = "Next"
}: QuestionSelectProps) {
  useEffect(() => {
    if (!autoAdvance || !value) return;
    const timeout = window.setTimeout(() => onNext(), 400);
    return () => window.clearTimeout(timeout);
  }, [autoAdvance, onNext, value]);

  return (
    <div className="rounded-3xl border border-brand-rule bg-white p-6 shadow-soft md:p-8">
      <h2 className="text-balance font-display text-[30px] leading-tight text-brand-midnight">{question}</h2>
      {note ? <p className="mt-3 text-sm italic text-brand-muted">{note}</p> : null}

      <div className="mt-6 space-y-3">
        {options.map((option) => {
          const selected = value === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className={cn(
                "flex min-h-14 w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                selected
                  ? "border-brand-midnight bg-brand-midnight text-white"
                  : "border-brand-rule bg-white text-brand-midnight hover:border-brand-amber/60"
              )}
            >
              <span className="pr-4 leading-relaxed">{option.label}</span>
              {selected ? <Check className="h-5 w-5 shrink-0" /> : null}
            </button>
          );
        })}
      </div>

      {!autoAdvance ? (
        <Button size="lg" fullWidth className="mt-6" onClick={onNext} disabled={!value} showArrow>
          {nextLabel}
        </Button>
      ) : null}
    </div>
  );
}
