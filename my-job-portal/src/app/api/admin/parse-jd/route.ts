import { NextResponse } from "next/server";
import { parseJDServer } from "@/lib/server/aiParserServer";

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json();

    if (typeof rawText !== "string" || rawText.trim().length === 0) {
      return NextResponse.json(
        { message: "rawText is required" },
        { status: 400 },
      );
    }

    const parsed = await parseJDServer(rawText);
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse JD";
    return NextResponse.json({ message }, { status: 500 });
  }
}
