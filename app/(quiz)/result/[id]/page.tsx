import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ResultScreen } from "@/components/result/ResultScreen";

interface ResultPageProps {
  params: { id: string };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("quiz_responses").select("*").eq("id", params.id).single();

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-cream px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl text-brand-midnight">Result not found</h1>
          <p className="mt-3 text-brand-muted">
            This result may have expired or the link may be incorrect.
          </p>
          <Link href="/quiz" className="mt-4 inline-block text-brand-amber">
            Go to quiz
          </Link>
        </div>
      </main>
    );
  }

  return <ResultScreen result={data} />;
}
