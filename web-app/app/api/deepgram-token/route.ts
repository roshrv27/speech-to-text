import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
    const { result, error } = await deepgram.manage.createProjectKey(
      process.env.DEEPGRAM_PROJECT_ID!,
      {
        comment: "temp-browser-key",
        scopes: ["usage:write"],
        time_to_live_in_seconds: 600,
      }
    );
    
    if (error || !result) {
      return NextResponse.json({ error: "Failed to create key" }, { status: 500 });
    }
    
    return NextResponse.json({ key: result.key });
  } catch (err) {
    console.error("Deepgram error:", err);
    return NextResponse.json({ error: "Failed to create key" }, { status: 500 });
  }
}
