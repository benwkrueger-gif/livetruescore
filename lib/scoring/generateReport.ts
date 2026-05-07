import { ARENAS } from "@/lib/constants/arenas";
import type { GapItem, RankedValue } from "@/types/quiz";
import {
  translateEnvy,
  translateInfluenceSource,
  translatePermissionOrientation,
  translateSacrifice
} from "@/lib/scoring/translations";

interface ReportRow {
  id: string;
  first_name: string | null;
  alignment_score: number | null;
  alignment_type: string | null;
  top_gaps: GapItem[] | null;
  values_ranked: RankedValue[] | null;
  sacrifice_first: string | null;
  envy_signal: string | null;
  permission_orientation: string | null;
  influence_source: string | null;
  future_vision: string | null;
  importance_weights: Record<string, number> | null;
  arena_work: number | null;
  arena_financial: number | null;
  arena_relationships: number | null;
  arena_health: number | null;
  arena_freedom: number | null;
  arena_play: number | null;
  arena_creativity: number | null;
  arena_contribution: number | null;
}

async function makeClaudeCall(prompt: string, model: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("Missing ANTHROPIC_API_KEY");
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }]
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Anthropic request failed (${response.status})`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text?.trim();
    return content || null;
  } catch (error) {
    console.error("Claude section generation failed:", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function getArenaScore(row: ReportRow, arenaKey: string) {
  const map: Record<string, number | null> = {
    work: row.arena_work,
    financial: row.arena_financial,
    relationships: row.arena_relationships,
    health: row.arena_health,
    freedom: row.arena_freedom,
    play: row.arena_play,
    creativity: row.arena_creativity,
    contribution: row.arena_contribution
  };
  return map[arenaKey] ?? 0;
}

function getImportanceLevel(weight: number) {
  if (weight >= 2.0) return "Top value";
  if (weight >= 1.5) return "Core value";
  return "Present";
}

export async function generateFullReport(row: ReportRow) {
  const firstName = row.first_name || "Friend";
  const topGaps = row.top_gaps ?? [];
  const topGapLabels = topGaps.slice(0, 3).map((g) => g.label).join(", ");
  const valuesText = (row.values_ranked ?? []).map((v) => v.label).join(", ");

  const arenaBreakdownText = ARENAS.map((arena) => {
    const score = getArenaScore(row, arena.key);
    const weight = row.importance_weights?.[arena.key] ?? 1;
    const importanceLevel = getImportanceLevel(weight);
    return `${arena.label}: ${score}/10 - ${importanceLevel}`;
  }).join("\n");

  const section1Prompt = `You are writing the Full Alignment Breakdown section of a personal Life Alignment Report for ${firstName}.

Their 8 arena scores and importance to them:
${arenaBreakdownText}
(Build this string: for each arena, show "[arena label]: [score]/10 - [importance level]" where importance level is "Top value", "Core value", or "Present" based on weights)

Write 1-2 specific sentences for each arena analyzing what their score means in the context of what they told us matters. Reference their actual values. Do not be generic.
Do not use em-dashes.
Format: start each arena with its emoji and name on a new line, then the analysis.

Top values: ${valuesText}`.trim();

  const section2Prompt = `You are writing the Root Cause Analysis section of a personal Life Alignment Report for ${firstName}.

Key data:
- What they sacrifice first when busy: ${translateSacrifice(row.sacrifice_first)}
- What they most envy in others: ${translateEnvy(row.envy_signal)}
- Their current orientation: ${translatePermissionOrientation(row.permission_orientation)}
- Their top 3 gaps: ${topGapLabels}

Write 3 paragraphs identifying the 2-3 core patterns driving their alignment gaps. Find the thread that connects these data points. Be direct and specific to their data.
Do not summarize their answers back to them.
Do not use em-dashes.
2-3 sentences per paragraph maximum.`.trim();

  const section3Prompt = `You are writing the Influence Audit section of a personal Life Alignment Report for ${firstName}.

The voice that most defines the life they feel supposed to be living is: ${translateInfluenceSource(row.influence_source)}

Their top gap is: ${topGaps[0]?.label ?? "Unknown"}
Their alignment type is: ${row.alignment_type ?? "Unknown"}

Write 3 paragraphs analyzing how this influence has specifically shaped their gap pattern. Be concrete about how this shows up in real life for someone with their profile.
Do not use em-dashes.
2-3 sentences per paragraph maximum.`.trim();

  const section4Prompt = `You are writing the 3 Personalized Experiments section of a Life Alignment Report for ${firstName}.

Their top 3 gaps in order:
1. ${topGaps[0]?.label ?? "Unknown"} (score: ${topGaps[0]?.satisfaction ?? "?"}/10)
2. ${topGaps[1]?.label ?? "Unknown"} (score: ${topGaps[1]?.satisfaction ?? "?"}/10)
3. ${topGaps[2]?.label ?? "Unknown"} (score: ${topGaps[2]?.satisfaction ?? "?"}/10)

Their top value: ${row.values_ranked?.[0]?.label ?? "Unknown"}
Their permission orientation: ${translatePermissionOrientation(row.permission_orientation)}

Design one specific micro-experiment for each gap. Each experiment should:
- Have a memorable 3-5 word name
- Take one week or less
- Be immediately actionable today
- Be specific to their profile, not generic
- Build in difficulty from experiment 1 to 3

Format each as:
EXPERIMENT NAME
Description: 2-3 sentences of exactly what to do and when.
Why this for you: 1 sentence connecting it to their specific pattern.

Do not use em-dashes.`.trim();

  const section5Prompt = `You are writing the Personal Alignment Path section of a Life Alignment Report for ${firstName}.

${
    row.future_vision?.trim()
      ? `They said they want this to be true in a year: "${row.future_vision.trim()}"`
      : `Their alignment type is: ${row.alignment_type ?? "Unknown"}`
  }

Their biggest gap: ${topGaps[0]?.label ?? "Unknown"}
Their current score: ${row.alignment_score ?? 0}/100
Their type: ${row.alignment_type ?? "Unknown"}

Write 3 paragraphs describing what closing this gap actually looks like over time. Not a generic plan. A specific path based on their type, their values, and where they said they want to be.
Do not use em-dashes.
2-3 sentences per paragraph maximum.`.trim();

  const [alignment_breakdown, root_cause, influence_audit, experiments, alignment_path] = await Promise.all([
    makeClaudeCall(section1Prompt, "claude-haiku-4-5"),
    makeClaudeCall(section2Prompt, "claude-sonnet-4-6"),
    makeClaudeCall(section3Prompt, "claude-haiku-4-5"),
    makeClaudeCall(section4Prompt, "claude-sonnet-4-6"),
    makeClaudeCall(section5Prompt, "claude-haiku-4-5")
  ]);

  return {
    sections: {
      alignment_breakdown,
      root_cause,
      influence_audit,
      experiments,
      alignment_path
    },
    generated_at: new Date().toISOString()
  };
}
