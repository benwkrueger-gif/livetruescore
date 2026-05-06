import { ARENAS } from "@/lib/constants/arenas";
import { VALUES } from "@/lib/constants/values";
import type { ArenaKey, GapItem, RankedValue } from "@/types/quiz";

const RANK_WEIGHT: Record<1 | 2 | 3 | 4, number> = {
  1: 2.5,
  2: 2.0,
  3: 1.5,
  4: 1.0
};

interface ScorePayload {
  arenaScores: Partial<Record<ArenaKey, number>>;
  valuesRanked: RankedValue[];
}

interface ArenaScored {
  arena: ArenaKey;
  label: string;
  emoji: string;
  satisfaction: number;
  importance: number;
  gap: number;
  priorityScore: number;
}

export interface ScoreResult {
  score: number;
  scoreLabel: string;
  topGaps: GapItem[];
  importanceWeights: Record<ArenaKey, number>;
  allArenaData: ArenaScored[];
}

export function calculateScore(payload: ScorePayload): ScoreResult {
  const selectedWeightMap = new Map<string, number>();
  payload.valuesRanked.forEach((item) => {
    selectedWeightMap.set(item.key, RANK_WEIGHT[item.rank] ?? 0.5);
  });

  const importanceWeights = {} as Record<ArenaKey, number>;
  for (const arena of ARENAS) {
    const mapped = VALUES.filter((value) => value.arenaMapping === arena.key);
    const maxWeight =
      mapped.reduce((max, value) => Math.max(max, selectedWeightMap.get(value.key) ?? 0.5), 0.5) || 0.5;
    importanceWeights[arena.key] = maxWeight;
  }

  const allArenaData: ArenaScored[] = ARENAS.map((arena) => {
    const satisfactionRaw = payload.arenaScores[arena.key] ?? 0;
    const satisfaction = Math.max(0, Math.min(10, satisfactionRaw)) / 10;
    const importance = importanceWeights[arena.key];
    const arenaScore = satisfaction * importance;
    const arenaMax = 1 * importance;
    const arenaGap = arenaMax - arenaScore;
    const gapPriority = importance * arenaGap;

    return {
      arena: arena.key,
      label: arena.label,
      emoji: arena.emoji,
      satisfaction: Math.max(0, Math.min(10, satisfactionRaw)),
      importance,
      gap: arenaGap,
      priorityScore: gapPriority
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const totalScore = allArenaData.reduce((sum, item) => sum + (item.satisfaction / 10) * item.importance, 0);
  const totalMax = allArenaData.reduce((sum, item) => sum + item.importance, 0);
  const raw = totalMax > 0 ? totalScore / totalMax : 0;
  const score = Math.max(0, Math.min(100, Math.round(raw * 100)));

  const scoreLabel =
    score >= 75
      ? "Strongly Aligned"
      : score >= 60
        ? "Partially Aligned"
        : score >= 45
          ? "Noticeably Drifted"
          : "Significantly Off Track";

  const topGaps: GapItem[] = allArenaData.slice(0, 3).map((item) => ({
    arena: item.arena,
    label: item.label,
    emoji: item.emoji,
    importance: item.importance,
    satisfaction: item.satisfaction,
    gap: item.gap,
    priorityScore: item.priorityScore
  }));

  return {
    score,
    scoreLabel,
    topGaps,
    importanceWeights,
    allArenaData
  };
}
