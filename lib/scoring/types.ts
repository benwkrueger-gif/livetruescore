import type { GapItem } from "@/types/quiz";
import { calculateScore } from "@/lib/scoring/algorithm";

interface TypePayload {
  permissionOrientation: "A" | "B" | "C" | "D" | null;
  envySignal: string | null;
  arenaScores: Record<string, number>;
  valuesRanked: Array<{ key: string; rank: 1 | 2 | 3 | 4; label: string }>;
}

export function assignAlignmentType(payload: TypePayload, topGaps: GapItem[]): string {
  const topGap0 = topGaps[0];
  const topGap1 = topGaps[1];
  const highGapCount = calculateScore(payload).allArenaData.filter((item) => item.gap > 0.25).length;

  if (payload.permissionOrientation === "D" && highGapCount >= 4) {
    return "scattered_potential";
  }

  if (
    payload.permissionOrientation === "B" &&
    [topGap0?.arena, topGap1?.arena].some((arena) =>
      ["play", "freedom", "contribution"].includes(arena ?? "")
    )
  ) {
    return "goalpost_mover";
  }

  if (
    payload.permissionOrientation === "A" &&
    [topGap0?.arena, topGap1?.arena].some((arena) => ["freedom", "play"].includes(arena ?? ""))
  ) {
    return "obligation_carrier";
  }

  if (["contribution", "work"].includes(topGap0?.arena ?? "") && payload.envySignal === "purpose_impact") {
    return "quiet_achiever";
  }

  if (
    [topGap0?.arena, topGap1?.arena].some((arena) => ["play", "creativity"].includes(arena ?? "")) &&
    ["A", "B"].includes(payload.permissionOrientation ?? "")
  ) {
    return "deferred_explorer";
  }

  if (topGap0 && topGap0.priorityScore > (topGap1?.priorityScore ?? 0) * 1.8) {
    return "almost_there";
  }

  return "mid_crossing";
}
