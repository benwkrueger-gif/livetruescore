import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Life Alignment Score | LiveTrue",
  description:
    "Measure the gap between what you value and how you're living. Free 5-minute assessment."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfairDisplay.variable} bg-brand-cream`}
    >
      <body className="min-h-screen bg-brand-cream font-body text-brand-midnight antialiased">
        {children}
      </body>
    </html>
  );
}
