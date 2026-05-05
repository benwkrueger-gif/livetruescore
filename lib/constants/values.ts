import type { ArenaKey } from "@/types/quiz";

export interface ValueDefinition {
  key: string;
  label: string;
  arenaMapping: ArenaKey;
}

export const VALUES: ValueDefinition[] = [
  { key: "freedom", label: "Freedom", arenaMapping: "freedom" },
  { key: "adventure", label: "Adventure", arenaMapping: "play" },
  {
    key: "deep_connection",
    label: "Deep connection",
    arenaMapping: "relationships"
  },
  {
    key: "creative_expression",
    label: "Creative expression",
    arenaMapping: "creativity"
  },
  {
    key: "financial_security",
    label: "Financial security",
    arenaMapping: "financial"
  },
  {
    key: "making_a_difference",
    label: "Making a difference",
    arenaMapping: "contribution"
  },
  { key: "learning_growth", label: "Learning & growth", arenaMapping: "work" },
  { key: "play_humor", label: "Play & humor", arenaMapping: "play" },
  { key: "simplicity", label: "Simplicity", arenaMapping: "freedom" },
  { key: "mastery", label: "Mastery", arenaMapping: "work" },
  { key: "recognition", label: "Recognition", arenaMapping: "work" },
  { key: "belonging", label: "Belonging", arenaMapping: "relationships" },
  { key: "independence", label: "Independence", arenaMapping: "freedom" },
  {
    key: "health_vitality",
    label: "Health & vitality",
    arenaMapping: "health"
  },
  { key: "integrity", label: "Integrity", arenaMapping: "contribution" }
];
