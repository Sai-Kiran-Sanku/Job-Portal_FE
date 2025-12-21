import { NextResponse } from "next/server";

// Deprecated: retained for a short time, but prefer the catch-all /api/proxy/[...path]
export async function POST(req: Request) {
  return NextResponse.json({ message: "Deprecated: use /api/proxy/auth/register instead" }, { status: 410 });
}
