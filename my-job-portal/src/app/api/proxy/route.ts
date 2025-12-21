import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Proxy is up. Use /api/proxy/<path> to forward requests." });
}

export async function POST() {
  return NextResponse.json({ message: "Proxy root only for health checks. Use /api/proxy/<path> to forward requests." }, { status: 405 });
}
