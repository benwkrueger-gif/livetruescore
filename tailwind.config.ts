import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          midnight: "#111827",
          "midnight-soft": "#1F2937",
          cream: "#FAFAF8",
          "cream-dark": "#F4F3EF",
          amber: "#D4622A",
          "amber-hover": "#B8521F",
          "amber-light": "#FDF0E8",
          "amber-glow": "#FF7A3520",
          sage: "#2D6A4F",
          "sage-light": "#EAF5EF",
          ink: "#111827",
          "ink-2": "#374151",
          muted: "#6B7280",
          rule: "#E5E7EB",
          "rule-dark": "#374151"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-body)", "DM Sans", "Helvetica Neue", "sans-serif"]
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)",
        medium: "0 4px 16px 0 rgba(0,0,0,0.08), 0 2px 4px 0 rgba(0,0,0,0.04)",
        strong: "0 8px 32px 0 rgba(0,0,0,0.12), 0 4px 8px 0 rgba(0,0,0,0.06)",
        amber: "0 4px 20px 0 rgba(212,98,42,0.25)",
        "amber-strong": "0 6px 28px 0 rgba(212,98,42,0.35)"
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px"
      }
    }
  },
  plugins: []
};

export default config;
