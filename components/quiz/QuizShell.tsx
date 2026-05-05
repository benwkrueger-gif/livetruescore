import type { ReactNode } from "react";

interface QuizShellProps {
  children: ReactNode;
}

export function QuizShell({ children }: QuizShellProps) {
  return <div className="mx-auto w-full max-w-3xl px-6 py-10">{children}</div>;
}
