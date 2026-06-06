import { NextRequest, NextResponse } from "next/server";
import { readMemoryFromWalrus } from "@/lib/walrus";
import { buildRoastSystemPrompt, buildRoastUserPrompt } from "@/lib/roast";

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }],
        generationConfig: {
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini error: ${JSON.stringify(data)}`);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  console.log("Gemini raw response:", text);
  return text;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blobId = searchParams.get("blobId");
    if (!blobId) return NextResponse.json({ error: "Missing blobId" }, { status: 400 });

    const memory = await readMemoryFromWalrus(blobId);
    const text = await callGemini(buildRoastSystemPrompt(), buildRoastUserPrompt(memory));
    const roast = JSON.parse(text);

    return NextResponse.json({ roast, memory });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}