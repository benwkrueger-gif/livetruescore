'use client';

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";

interface QuizShellProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  showBack: boolean;
  fullBleed?: boolean;
}

export function QuizShell({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBack,
  fullBleed = false
}: QuizShellProps) {
  const showProgress = currentStep > 0 && currentStep <= totalSteps;

  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-3xl px-5 py-6 md:px-8 md:py-8">
        {showProgress && (
          <ProgressBar
            current={currentStep}
            total={totalSteps}
            label={`Question ${currentStep} of ${totalSteps}`}
          />
        )}
        <div className="mt-4 flex min-h-[32px] items-center">
          {showBack ? (
            <Button variant="ghost" size="sm" onClick={onBack} className="px-3">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : null}
        </div>
        <section className={fullBleed ? "mt-4 w-full" : "mx-auto mt-4 w-full max-w-lg"}>{children}</section>
      </div>
    </main>
  );
}
