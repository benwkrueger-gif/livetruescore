"use client";

interface SliderProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
}

export function Slider({ min = 1, max = 10, value, onChange }: SliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-brand-amber-light accent-brand-amber"
    />
  );
}
