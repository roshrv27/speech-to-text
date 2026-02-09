import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  const projectId = process.env.DEEPGRAM_PROJECT_ID;
  
  console.log("API Key exists:", !!apiKey);
  console.log("Project ID exists:", !!projectId);
  
  if (!apiKey) {
    console.error("DEEPGRAM_API_KEY not found in environment");
    return NextResponse.json({ 
      error: "DEEPGRAM_API_KEY not configured",
      hint: "Add DEEPGRAM_API_KEY to Vercel environment variables and redeploy"
    }, { status: 500 });
  }
  
  return NextResponse.json({ 
    key: apiKey,
    projectId: projectId 
  });
}
