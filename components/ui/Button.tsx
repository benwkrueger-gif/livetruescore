'use client';

import * as React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-body font-medium tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber/30 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "btn-amber-glow bg-brand-amber text-white hover:bg-brand-amber-hover disabled:shadow-none",
        secondary: "bg-brand-midnight text-white shadow-medium hover:bg-brand-midnight-soft",
        ghost:
          "border border-brand-rule bg-transparent text-brand-ink hover:border-brand-ink/20 hover:bg-brand-cream-dark"
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
      },
      fullWidth: {
        true: "w-full",
        false: ""
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  showArrow?: boolean;
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  showArrow = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      <span>{children}</span>
      {showArrow && !loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
