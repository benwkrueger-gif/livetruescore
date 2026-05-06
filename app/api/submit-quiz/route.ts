import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quiz_responses")
      .insert({
        first_name: payload.firstName,
        email: payload.email,
        newsletter_opt_in: payload.newsletterOptIn,
        arena_work: payload.arenaScores?.work ?? null,
        arena_financial: payload.arenaScores?.financial ?? null,
        arena_relationships: payload.arenaScores?.relationships ?? null,
        arena_health: payload.arenaScores?.health ?? null,
        arena_freedom: payload.arenaScores?.freedom ?? null,
        arena_play: payload.arenaScores?.play ?? null,
        arena_creativity: payload.arenaScores?.creativity ?? null,
        arena_contribution: payload.arenaScores?.contribution ?? null,
        values_ranked: payload.valuesRanked ?? null,
        sacrifice_first: payload.sacrificeFirst ?? null,
        envy_signal: payload.envySignal ?? null,
        permission_orientation: payload.permissionOrientation ?? null,
        deferred_dream: payload.deferredDream ?? null,
        deferred_dream_category: payload.deferredDreamCategory ?? null,
        deferred_dream_other: payload.deferredDreamOther ?? null,
        influence_source: payload.influenceSource ?? null,
        future_vision: payload.futureVision ?? null,
        alignment_score: null,
        alignment_type: null,
        top_gaps: null,
        importance_weights: null,
        score_label: null,
        utm_source: payload.utmSource ?? null,
        utm_medium: payload.utmMedium ?? null,
        utm_campaign: payload.utmCampaign ?? null,
        referrer: payload.referrer ?? null
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("submit-quiz insert failed", error);
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
    console.error("submit-quiz request failed", error);
    return NextResponse.json(
      {
        success: false,
        error: "Submission failed"
      },
      { status: 500 }
    );
  }
}
