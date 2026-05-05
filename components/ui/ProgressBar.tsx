"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? Math.max(0, Math.min(100, (current / total) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end text-sm text-brand-muted">
        {current} of {total}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-rule">
        <motion.div
          layout
          className="h-full rounded-full bg-brand-amber"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.35 }}
        />
      </div>
    </div>
  );
}
