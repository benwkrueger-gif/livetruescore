export type ArenaKey =
  | "work"
  | "financial"
  | "relationships"
  | "health"
  | "freedom"
  | "play"
  | "creativity"
  | "contribution";

export interface ArenaScores {
  work: number;
  financial: number;
  relationships: number;
  health: number;
  freedom: number;
  play: number;
  creativity: number;
  contribution: number;
}

export interface RankedValue {
  key: string;
  label: string;
  rank: 1 | 2 | 3 | 4;
}

export interface QuizState {
  currentStep: number;
  totalSteps: number;
  arenaScores: Partial<ArenaScores>;
  valuesRanked: RankedValue[];
  sacrificeFirst: string | null;
  envySignal: string | null;
  permissionOrientation: "A" | "B" | "C" | "D" | null;
  deferredDream: boolean | null;
  deferredDreamCategory: string | null;
  deferredDreamOther: string;
  influenceSource: string | null;
  futureVision: string;
  firstName: string;
  email: string;
  newsletterOptIn: boolean;
}

export interface GapItem {
  arena: ArenaKey;
  label: string;
  emoji: string;
  importance: number;
  satisfaction: number;
  gap: number;
  priorityScore: number;
}

export interface QuizResult {
  id: string;
  score: number;
  scoreLabel: string;
  alignmentType: string;
  typeName: string;
  typeTagline: string;
  typeDescription: string;
  topGaps: GapItem[];
  firstName: string;
  futureVision: string;
  importanceWeights: Record<ArenaKey, number>;
}
