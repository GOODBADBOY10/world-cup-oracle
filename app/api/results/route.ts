import { NextRequest, NextResponse } from "next/server";
import { readMemoryFromWalrus, writeMemoryToWalrus, computeStats } from "@/lib/walrus";

/**
 * POST /api/results
 * Called (manually or by cron) to update predictions with real match results.
 * Body: { blobId, matchId, actualScore: { home, away }, actualWinner }
 */
export async function POST(req: NextRequest) {
  try {
    const { blobId, matchId, actualScore, actualWinner } = await req.json();

    if (!blobId || !matchId || !actualScore || !actualWinner) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const memory = await readMemoryFromWalrus(blobId);

    let updated = 0;
    memory.predictions = memory.predictions.map((p) => {
      if (p.matchId === matchId && !p.resolved) {
        const correct =
          p.predictedWinner === actualWinner &&
          p.predictedScore.home === actualScore.home &&
          p.predictedScore.away === actualScore.away;
        // Partial credit: winner correct even if score wrong
        const winnerCorrect = p.predictedWinner === actualWinner;
        updated++;
        return {
          ...p,
          actualWinner,
          actualScore,
          resolved: true,
          correct: winnerCorrect, // correct if winner right (score is bonus)
        };
      }
      return p;
    });

    memory.stats = computeStats(memory);
    const newBlobId = await writeMemoryToWalrus(memory);

    return NextResponse.json({ blobId: newBlobId, updated, memory });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
