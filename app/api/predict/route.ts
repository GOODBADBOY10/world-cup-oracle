import { NextRequest, NextResponse } from "next/server";
import {
  readMemoryFromWalrus,
  writeMemoryToWalrus,
  createEmptyMemory,
  computeStats,
  type Prediction,
} from "@/lib/walrus";
import { buildRoastSystemPrompt, buildRoastUserPrompt } from "@/lib/roast";
import { readRegistry, writeRegistry } from "@/lib/walrus";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, displayName, blobId, prediction } = body as {
      userId: string;
      displayName: string;
      blobId?: string;
      prediction: Omit<Prediction, "id" | "createdAt">;
    };

    if (!userId || !prediction) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let memory = blobId
      ? await readMemoryFromWalrus(blobId)
      : createEmptyMemory(userId, displayName);

    const newPred: Prediction = {
      ...prediction,
      id: `pred_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    memory.predictions.push(newPred);
    memory.stats = computeStats(memory);

    let roastData = {
      roast: "The Oracle sees your prediction. Time will tell if it's wisdom or folly.",
      verdict: "MEDIOCRE" as "GLORY" | "SHAME" | "MEDIOCRE",
      rating: 5,
      callout: "",
    };

    try {
      const text = await callGemini(buildRoastSystemPrompt(), buildRoastUserPrompt(memory, newPred));
      console.log("Gemini raw response:", text);
      roastData = JSON.parse(text);
    } catch (e) {
      console.error("Roast generation error:", e);
    }

    memory.roasts.push({
      id: `roast_${Date.now()}`,
      predictionId: newPred.id,
      roast: roastData.roast,
      createdAt: new Date().toISOString(),
      type: roastData.verdict === "GLORY" ? "glory" : roastData.verdict === "SHAME" ? "shame" : "neutral",
    });

    const newBlobId = await writeMemoryToWalrus(memory);
    memory.blobId = newBlobId;

    try {
      const registryBlobId = req.headers.get("x-registry-blob") || "";
      let registry = registryBlobId
        ? await readRegistry(registryBlobId)
        : { blobIds: [], updatedAt: new Date().toISOString() };

      if (!registry.blobIds.includes(newBlobId)) {
        registry.blobIds.push(newBlobId);
        const newRegistryBlobId = await writeRegistry(registry);
        // Return new registry blob ID so client can store it
        return NextResponse.json({
          blobId: newBlobId,
          registryBlobId: newRegistryBlobId,
          prediction: newPred,
          roast: roastData,
          memory,
        });
      }
    } catch (e) {
      console.error("Registry update error:", e);
    }

    return NextResponse.json({ blobId: newBlobId, prediction: newPred, roast: roastData, memory })
  } catch (err: any) {
    console.error("Predict API error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}