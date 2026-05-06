import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Submit quiz called with payload:", JSON.stringify(body).slice(0, 200));
    const supabase = await createClient();

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
        alignment_score: null,
        alignment_type: null,
        top_gaps: null,
        importance_weights: null,
        score_label: null,
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
          error: error?.message || "Unknown error",
          details: JSON.stringify(error)
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
        error: error instanceof Error ? error.message : "Unknown error",
        details: JSON.stringify(error)
      },
      { status: 500 }
    );
  }
}
