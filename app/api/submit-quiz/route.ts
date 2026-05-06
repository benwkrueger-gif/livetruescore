import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  console.log("submit-quiz payload", payload);

  // TODO: Full scoring logic added in Prompt 3.
  return NextResponse.json({ id: "preview-result" });
}
