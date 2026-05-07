import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { buildReportEmail } from "@/lib/email/reportTemplate";
import { generateFullReport } from "@/lib/scoring/generateReport";

export async function POST(request: Request) {
  try {
    const { id } = (await request.json()) as { id?: string };
    if (!id) {
      return NextResponse.json({ success: false, error: "Result not found" }, { status: 404 });
    }

    const supabase = await createClient();
    const { data: row, error } = await supabase.from("quiz_responses").select("*").eq("id", id).single();

    if (error || !row) {
      return NextResponse.json({ success: false, error: "Result not found" }, { status: 404 });
    }

    const report = await generateFullReport(row);

    const { error: updateError } = await supabase.from("quiz_responses").update({ full_report: report }).eq("id", id);
    if (updateError) {
      throw updateError;
    }

    const html = buildReportEmail(row, report.sections);
    const resend = new Resend(process.env.RESEND_API_KEY);

    // TODO: Update from email address when custom domain is configured.
    await resend.emails.send({
      from: "LiveTrue <onboarding@resend.dev>",
      to: row.email,
      subject: `${row.first_name}, your Life Alignment Report is ready`,
      html
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send report error:", error);
    return NextResponse.json(
      { success: false, error: "Report generation failed. Please try again." },
      { status: 500 }
    );
  }
}
