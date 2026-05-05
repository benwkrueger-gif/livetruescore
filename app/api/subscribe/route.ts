import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Beehiiv subscription route scaffolded; integration pending." },
    { status: 501 }
  );
}
