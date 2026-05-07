import type { GapItem, RankedValue } from "@/types/quiz";
import {
  translateEnvy,
  translateInfluenceSource,
  translatePermissionOrientation,
  translateSacrifice
} from "@/lib/scoring/translations";

interface NarrativePayload {
  firstName: string;
  valuesRanked: RankedValue[];
  sacrificeFirst: string | null;
  envySignal: string | null;
  permissionOrientation: string | null;
  influenceSource: string | null;
  futureVision?: string | null;
}

export async function generateAiNarrative(payload: NarrativePayload, topGaps: GapItem[]) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("Missing ANTHROPIC_API_KEY");
    }

    const orientationText = translatePermissionOrientation(payload.permissionOrientation);
    const influenceText = translateInfluenceSource(payload.influenceSource);
    const sacrificeText = translateSacrifice(payload.sacrificeFirst);
    const envyText = translateEnvy(payload.envySignal);

    const valuesText = payload.valuesRanked
      .sort((a, b) => a.rank - b.rank)
      .map((v, i) => `${i + 1}. ${v.label}`)
      .join(", ");

    const gapsText = topGaps
      .slice(0, 3)
      .map((g) => g.label)
      .join(", ");

    const futureText = payload.futureVision?.trim()
      ? `What they want to be true in a year: "${payload.futureVision.trim()}"`
      : "";

    const prompt = `
You are generating a deeply personal mirror reflection for someone who just completed a Life Alignment Score assessment. This is the most important moment in the product. When someone reads this, they should think "how did it know that?"

GOAL: Write 4-5 sentences that feel like a trusted, direct friend who sees something true about this person that they have felt but never quite said out loud.

CRITICAL: The second sentence must be something this person will want to screenshot and send to someone. It should articulate a specific truth about their pattern, not a general observation.

USER DATA:
Name: ${payload.firstName}
Top values in ranked order: ${valuesText}
What they sacrifice first when busy: ${sacrificeText}
What they most envy in others: ${envyText}
Their current orientation: ${orientationText}
Their top 3 life gaps: ${gapsText}
Whose voice most defines the life they feel supposed to be living: ${influenceText}
${futureText}

YOUR TASK:
Find the thread that connects their sacrifice pattern, their envy signal, and their permission orientation. This connection is more revealing than any single answer. Write from that connection outward.

RULES:
- Start with their first name
- Do NOT list or summarize their answers
- Do NOT use em-dashes
- Write exactly 3 paragraphs with a blank line between each
- Each paragraph is 2-3 sentences maximum. No paragraph should exceed 3 sentences.
- Do NOT use any of these words or phrases: journey, unlock, potential, authentic self, best self, transform, empower, step into, thrive, growth
- Write as a direct friend, not a therapist or coach
- Warm but honest, not soft
- 4-5 sentences maximum
- Final sentence must point toward what becomes possible, not just name what is wrong
- No em-dashes under any circumstances

TONE CALIBRATION:
Wrong: "You value freedom and adventure, but your score shows these areas need improvement."

Right example (showing 3-paragraph structure):

Ben, you keep choosing the responsible version of your life over the real one. Not because you do not know what you want, but because you are still waiting for permission nobody else was ever going to give you.

The thing you envy in others is not their lifestyle. It is the evidence that they stopped auditing their own desires before allowing themselves to have them.

When you stop treating what you actually want as something that needs to earn its place first, the gap between where you are and where you want to be stops feeling like a failure and starts feeling like a direction.

The right version names a pattern without summarizing answers. Write at that level.
Respond with only the narrative text. No preamble, no explanation, nothing else.
`.trim();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      }),
      signal: controller.signal
    });

    const data = await response.json();
    const narrative = data.content?.[0]?.text?.trim();

    if (!narrative) {
      throw new Error("Empty narrative response");
    }

    return narrative;
  } catch (error) {
    console.error("AI narrative generation failed:", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
