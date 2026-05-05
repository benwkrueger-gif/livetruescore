import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "submit-quiz API route scaffolded for Prompt 3." },
    { status: 501 }
  );
}
