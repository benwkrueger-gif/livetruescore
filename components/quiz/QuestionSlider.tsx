'use client';

import { Button } from "@/components/ui/Button";

interface QuestionSliderProps {
  question: string;
  scaleMin: string;
  scaleMax: string;
  value: number | null;
  onChange: (value: number) => void;
  onNext: () => void;
  nextLabel?: string;
}

export function QuestionSlider({
  question,
  scaleMin,
  scaleMax,
  value,
  onChange,
  onNext,
  nextLabel = "Next"
}: QuestionSliderProps) {
  const sliderValue = value ?? 5;
  const progressPercent = ((sliderValue - 1) / 9) * 100;

  return (
    <div className="rounded-3xl border border-brand-rule bg-white p-6 shadow-soft md:p-8">
      <h2 className="text-balance font-display text-[26px] leading-tight text-brand-midnight">{question}</h2>
      <div className="mt-8 text-center">
        <p className="font-display text-[72px] leading-none text-brand-amber">
          {value === null ? <span className="text-brand-muted">-</span> : value}
        </p>
      </div>
      <div className="mt-8">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={sliderValue}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-11 w-full accent-brand-amber"
          style={{
            background: `linear-gradient(to right, #D4622A 0%, #D4622A ${progressPercent}%, #E5E7EB ${progressPercent}%, #E5E7EB 100%)`,
            borderRadius: "999px"
          }}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-brand-muted">
          <span>{scaleMin}</span>
          <span>{scaleMax}</span>
        </div>
      </div>
      <Button size="lg" fullWidth className="mt-8" onClick={onNext} disabled={value === null} showArrow>
        {nextLabel}
      </Button>
    </div>
  );
}
