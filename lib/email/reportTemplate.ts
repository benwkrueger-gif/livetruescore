interface EmailRow {
  id: string;
  first_name: string | null;
  email: string | null;
  alignment_score: number | null;
  score_label: string | null;
  alignment_type: string | null;
}

interface ReportSections {
  alignment_breakdown: string | null;
  root_cause: string | null;
  influence_audit: string | null;
  experiments: string | null;
  alignment_path: string | null;
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildReportEmail(row: EmailRow, reportSections: ReportSections) {
  const firstName = row.first_name || "Friend";
  const score = row.alignment_score ?? 0;
  const scoreLabel = row.score_label ?? "Partially Aligned";
  const typeName = row.alignment_type ?? "Your alignment type";
  const sections = [
    { number: "01", title: "Your Full Alignment Breakdown", content: reportSections.alignment_breakdown },
    { number: "02", title: "What Is Actually Driving Your Gaps", content: reportSections.root_cause },
    { number: "03", title: "Your Influence Audit", content: reportSections.influence_audit },
    { number: "04", title: "Your 3 Personalized Experiments", content: reportSections.experiments },
    { number: "05", title: "Your Personal Alignment Path", content: reportSections.alignment_path }
  ];

  const sectionBlocks = sections
    .map((section, index) => {
      const background = index % 2 === 0 ? "#FFFFFF" : "#FAFAF8";
      const content = section.content
        ? escapeHtml(section.content)
        : "<em style=\"color:#6B7280;\">This section could not be generated. We will send an updated version shortly.</em>";

      return `
        <div style="background:${background};padding:32px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#D4622A;font-family:Helvetica,sans-serif;margin-bottom:8px;">
            ${section.number}
          </div>
          <div style="font-size:20px;font-weight:bold;color:#111827;margin-bottom:16px;font-family:Georgia,serif;">
            ${section.title}
          </div>
          <div style="font-size:16px;line-height:1.8;color:#374151;font-family:Helvetica,sans-serif;white-space:pre-wrap;">
            ${content}
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#FAFAF8;">
      <div style="background:#111827;padding:24px 32px;">
        <div style="font-style:italic;color:rgba(255,255,255,0.5);font-size:18px;">LiveTrue</div>
      </div>

      <div style="background:white;padding:48px 32px;text-align:center;border-bottom:1px solid #E5E7EB;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6B7280;font-family:Helvetica,sans-serif;">
          YOUR LIFE ALIGNMENT SCORE
        </div>
        <div style="font-size:80px;color:#D4622A;font-family:Georgia,serif;line-height:1;">${score}</div>
        <div style="font-size:14px;color:#D4622A;font-family:Helvetica,sans-serif;margin-top:8px;">${escapeHtml(scoreLabel)}</div>
        <div style="font-size:26px;font-style:italic;color:#111827;margin-top:16px;">${escapeHtml(typeName)}</div>
        <div style="font-size:16px;font-style:italic;color:#6B7280;margin-top:4px;">Alignment result</div>
      </div>

      <div style="padding:32px;background:#FAFAF8;">
        <p style="font-family:Helvetica,sans-serif;font-size:16px;color:#1A1A18;margin:0 0 16px 0;">Hi ${escapeHtml(firstName)},</p>
        <p style="font-family:Helvetica,sans-serif;font-size:16px;color:#1A1A18;line-height:1.7;margin:0 0 14px 0;">
          Here is your full Life Alignment Report. It is built entirely from your answers - not a template.
        </p>
        <p style="font-family:Helvetica,sans-serif;font-size:16px;color:#1A1A18;line-height:1.7;margin:0;">
          Your report has 5 sections. Read through it once, then come back to the experiments section. That is where most people find the most immediate value.
        </p>
      </div>

      ${sectionBlocks}

      <div style="background:#111827;padding:24px 32px;text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/result/${row.id}" style="color:#D4622A;font-size:14px;font-family:Helvetica,sans-serif;text-decoration:underline;">
          View your result page
        </a>
        <div style="color:rgba(255,255,255,0.3);font-size:12px;font-family:Helvetica,sans-serif;margin-top:10px;">
          LiveTrue - livetruescore.vercel.app
        </div>
      </div>
    </div>
  `;
}
