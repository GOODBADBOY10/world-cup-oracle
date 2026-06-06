import { NextRequest, NextResponse } from "next/server";
import { readMemoryFromWalrus } from "@/lib/walrus";

/**
 * GET /api/leaderboard?blobs=id1,id2,id3
 * Reads multiple Walrus blobs and returns ranked leaderboard data.
 * In production you'd maintain a registry blob; here we accept blob IDs as query params.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blobsParam = searchParams.get("blobs") || "";
    const blobIds = blobsParam.split(",").filter(Boolean).slice(0, 50); // cap at 50

    if (blobIds.length === 0) {
      return NextResponse.json({ leaderboard: [] });
    }

    const results = await Promise.allSettled(
      blobIds.map((id) => readMemoryFromWalrus(id))
    );

    const entries = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => {
        const mem = (r as PromiseFulfilledResult<any>).value;
        const resolved = mem.predictions.filter((p: any) => p.resolved);
        const accuracy =
          resolved.length > 0
            ? Math.round((mem.stats.correct / resolved.length) * 100)
            : 0;
        return {
          userId: mem.userId,
          displayName: mem.displayName,
          blobId: mem.blobId,
          total: mem.stats.total,
          correct: mem.stats.correct,
          accuracy,
          bestStreak: mem.stats.bestStreak,
          avgConfidence: mem.stats.avgConfidence,
        };
      })
      .sort((a, b) => b.accuracy - a.accuracy || b.correct - a.correct);

    return NextResponse.json({ leaderboard: entries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/leaderboard
 * Register a user's blob ID in the global registry blob.
 * Body: { blobId, registryBlobId? }
 */
export async function POST(req: NextRequest) {
  // In production: read registry blob, append blobId, rewrite to Walrus
  // Simplified: just return 200 and instruct client to store registry externally
  const { blobId } = await req.json();
  return NextResponse.json({ registered: true, blobId });
}
