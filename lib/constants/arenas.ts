import type { ArenaKey } from "@/types/quiz";

export interface ArenaDefinition {
  key: ArenaKey;
  label: string;
  emoji: string;
  question: string;
  scaleMin: string;
  scaleMax: string;
}

export const ARENAS: ArenaDefinition[] = [
  {
    key: "work",
    label: "Work & Career",
    emoji: "💼",
    question:
      "When you think about your work, how often does it feel like something you chose, rather than something that just happened to you?",
    scaleMin: "Rarely mine",
    scaleMax: "Fully mine"
  },
  {
    key: "financial",
    label: "Financial Security",
    emoji: "💰",
    question: "How settled do you feel about money, not rich, just not worried?",
    scaleMin: "Constant worry",
    scaleMax: "Solid foundation"
  },
  {
    key: "relationships",
    label: "Close Relationships",
    emoji: "❤️",
    question:
      "In your closest relationships, how often do you feel like the real version of yourself?",
    scaleMin: "Rarely myself",
    scaleMax: "Fully myself"
  },
  {
    key: "health",
    label: "Health & Body",
    emoji: "🏃",
    question: "How well are you taking care of the physical version of yourself?",
    scaleMin: "Neglecting it",
    scaleMax: "Living well in it"
  },
  {
    key: "freedom",
    label: "Freedom & Autonomy",
    emoji: "🧭",
    question:
      "How free do you feel to structure your time and life the way you actually want?",
    scaleMin: "Very constrained",
    scaleMax: "Genuinely free"
  },
  {
    key: "play",
    label: "Play & Adventure",
    emoji: "🌿",
    question:
      "How much room does your life currently have for things that excite, surprise, or delight you?",
    scaleMin: "Almost none",
    scaleMax: "It's a priority"
  },
  {
    key: "creativity",
    label: "Creative Expression",
    emoji: "🎨",
    question:
      "How often do you make or create something, anything, just because you wanted to?",
    scaleMin: "Almost never",
    scaleMax: "Regularly"
  },
  {
    key: "contribution",
    label: "Contribution & Meaning",
    emoji: "🌍",
    question:
      "How often do you go to bed feeling like today mattered, that something you did made a real difference?",
    scaleMin: "Rarely",
    scaleMax: "Most days"
  }
];
