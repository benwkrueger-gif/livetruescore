import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateScore } from "@/lib/scoring/algorithm";
import { assignAlignmentType } from "@/lib/scoring/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { score, scoreLabel, topGaps, importanceWeights } = calculateScore(body);
    const typeKey = assignAlignmentType(body, topGaps);

    const { data, error } = await supabase
      .from("quiz_responses")
      .insert({
        first_name: body.firstName,
        email: body.email,
        newsletter_opt_in: body.newsletterOptIn,
        arena_work: body.arenaScores?.work ?? null,
        arena_financial: body.arenaScores?.financial ?? null,
        arena_relationships: body.arenaScores?.relationships ?? null,
        arena_health: body.arenaScores?.health ?? null,
        arena_freedom: body.arenaScores?.freedom ?? null,
        arena_play: body.arenaScores?.play ?? null,
        arena_creativity: body.arenaScores?.creativity ?? null,
        arena_contribution: body.arenaScores?.contribution ?? null,
        values_ranked: body.valuesRanked ?? null,
        sacrifice_first: body.sacrificeFirst ?? null,
        envy_signal: body.envySignal ?? null,
        permission_orientation: body.permissionOrientation ?? null,
        deferred_dream: body.deferredDream ?? null,
        deferred_dream_category: body.deferredDreamCategory ?? null,
        deferred_dream_other: body.deferredDreamOther ?? null,
        influence_source: body.influenceSource ?? null,
        future_vision: body.futureVision ?? null,
        alignment_score: score,
        alignment_type: typeKey,
        top_gaps: topGaps,
        importance_weights: importanceWeights,
        score_label: scoreLabel,
        utm_source: body.utmSource ?? null,
        utm_medium: body.utmMedium ?? null,
        utm_campaign: body.utmCampaign ?? null,
        referrer: body.referrer ?? null
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Submission failed"
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id
    });
  } catch (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Submission failed"
      },
      { status: 500 }
    );
  }
}
