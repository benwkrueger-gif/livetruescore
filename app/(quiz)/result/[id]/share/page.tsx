import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SharePage } from "@/components/result/SharePage";
import type { GapItem } from "@/types/quiz";

interface ShareResultPageProps {
  params: { id: string };
}

export default async function ShareResultPage({ params }: ShareResultPageProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("quiz_responses").select("*").eq("id", params.id).single();

  if (error || !data) {
    redirect("/quiz");
  }

  return (
    <SharePage
      id={data.id}
      score={data.alignment_score ?? 0}
      scoreLabel={data.score_label ?? "Partially Aligned"}
      alignmentType={data.alignment_type ?? "unknown"}
      firstName={data.first_name ?? "Friend"}
      email={data.email ?? "your inbox"}
      topGaps={(data.top_gaps ?? []) as GapItem[]}
    />
  );
}
