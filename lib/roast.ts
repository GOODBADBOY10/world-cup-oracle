import { MemWal } from "@mysten-incubation/memwal";
import type { UserMemory, Prediction } from "./walrus";

function getMemWal(namespace: string) {
  return MemWal.create({
    key: process.env.MEMWAL_PRIVATE_KEY!,
    accountId: process.env.MEMWAL_ACCOUNT_ID!,
    serverUrl: process.env.MEMWAL_SERVER_URL!,
    namespace,
  });
}

export async function rememberPrediction(userId: string, prediction: Prediction, roast: string) {
  const memwal = getMemWal(userId);
  const memory = `Match: ${prediction.homeTeam} vs ${prediction.awayTeam}. Predicted: ${prediction.predictedWinner} ${prediction.predictedScore.home}-${prediction.predictedScore.away}. Confidence: ${prediction.confidence}/10. ${prediction.hotTake ? `Hot take: "${prediction.hotTake}".` : ""} Oracle roast: "${roast}"`;
  const job = await memwal.remember(memory);
  await memwal.waitForRememberJob(job.job_id);
  return job;
}

export async function recallPredictions(userId: string): Promise<string> {
  const memwal = getMemWal(userId);
  try {
    const result = await memwal.recall({ query: "predictions roasts accuracy confidence" });
    return result.results.map((r: any) => r.text).join("\n");
  } catch {
    return "No past predictions found.";
  }
}

export function buildRoastSystemPrompt(): string {
  return `You are the World Cup Oracle — a savage, all-knowing football deity with a perfect memory and zero mercy. You NEVER forget a bad prediction. You roast users based on their SPECIFIC past calls.

Personality: brutally honest, hilariously savage, theatrical. Reference specific past predictions. Use football metaphors.

Respond ONLY with valid JSON:
{"roast":"string (2-4 sentences, savage and specific)","verdict":"GLORY"|"SHAME"|"MEDIOCRE","rating":number,"callout":"string (most embarrassing prediction)"}`;
}

export function buildRoastUserPrompt(memory: UserMemory, pastMemories: string, newPrediction?: Prediction): string {
  const resolved = memory.predictions.filter((p) => p.resolved);
  const accuracy = resolved.length > 0
    ? Math.round((resolved.filter((p) => p.correct).length / resolved.length) * 100)
    : 0;

  let prompt = `User: ${memory.displayName}
Overall accuracy: ${accuracy}% (${resolved.filter((p) => p.correct).length}/${resolved.length} correct)
Current streak: ${memory.stats.streak}
Best streak: ${memory.stats.bestStreak}
Most wrong team: ${memory.stats.mostWrongTeam || "N/A"}

Past memories from Walrus Memory:
${pastMemories || "No past memories yet."}
`;

  if (newPrediction) {
    prompt += `
NEW PREDICTION:
${newPrediction.homeTeam} vs ${newPrediction.awayTeam}
Winner: ${newPrediction.predictedWinner}
Score: ${newPrediction.predictedScore.home}-${newPrediction.predictedScore.away}
Confidence: ${newPrediction.confidence}/10
${newPrediction.hotTake ? `Hot take: "${newPrediction.hotTake}"` : ""}

Roast this prediction using their full history.`;
  } else {
    prompt += `\nRoast this user's entire prediction record. Be specific.`;
  }

  return prompt;
}


// import type { UserMemory, Prediction } from "./walrus";

// /**
//  * Generate a roast prompt for Claude based on user's full prediction history.
//  * Passed as the system prompt to the Anthropic API.
//  */
// export function buildRoastSystemPrompt(): string {
//   return `You are the World Cup Oracle, a savage football deity who never forgets a bad prediction. Roast users based on their history. Be specific, brutal, and funny. Always respond with valid JSON only:
// {"roast":"string","verdict":"GLORY"|"SHAME"|"MEDIOCRE","rating":number,"callout":"string"}`;
// }

// export function buildRoastUserPrompt(memory: UserMemory, newPrediction?: Prediction): string {
//   const resolved = memory.predictions.filter((p) => p.resolved);
//   const accuracy =
//     resolved.length > 0
//       ? Math.round((resolved.filter((p) => p.correct).length / resolved.length) * 100)
//       : 0;

//   const predHistory = resolved
//     .slice(-10)
//     .map(
//       (p) =>
//         `${p.homeTeam} vs ${p.awayTeam}: predicted ${p.predictedWinner} (${p.predictedScore.home}-${p.predictedScore.away}), confidence ${p.confidence}/10 → ${p.correct ? "CORRECT ✓" : `WRONG ✗ (actual: ${p.actualWinner}, ${p.actualScore?.home}-${p.actualScore?.away})`}`
//     )
//     .join("\n");

//   const unresolved = memory.predictions.filter((p) => !p.resolved);

//   let prompt = `User: ${memory.displayName}
// Overall accuracy: ${accuracy}% (${resolved.filter((p) => p.correct).length}/${resolved.length} correct)
// Current streak: ${memory.stats.streak} ${memory.stats.streak > 0 ? "correct" : "wrong"}
// Best streak ever: ${memory.stats.bestStreak}
// Avg confidence: ${memory.stats.avgConfidence}/10
// Most wrong team: ${memory.stats.mostWrongTeam || "N/A"}

// Recent prediction history:
// ${predHistory || "No resolved predictions yet."}

// Pending predictions (not yet resolved): ${unresolved.length}
// `;

//   if (newPrediction) {
//     prompt += `
// NEW PREDICTION JUST MADE:
// ${newPrediction.homeTeam} vs ${newPrediction.awayTeam}
// Predicted winner: ${newPrediction.predictedWinner}
// Predicted score: ${newPrediction.predictedScore.home}-${newPrediction.predictedScore.away}
// Confidence: ${newPrediction.confidence}/10
// ${newPrediction.hotTake ? `Hot take: "${newPrediction.hotTake}"` : ""}

// Roast this prediction in the context of their full history.`;
//   } else {
//     prompt += `
// Roast this user's overall prediction record. Be specific about their failures.`;
//   }

//   return prompt;
// }

// export function buildChallengePrompt(
//   challenger: UserMemory,
//   rival: UserMemory
// ): string {
//   const challengerAcc =
//     challenger.stats.total > 0
//       ? Math.round((challenger.stats.correct / challenger.stats.total) * 100)
//       : 0;
//   const rivalAcc =
//     rival.stats.total > 0
//       ? Math.round((rival.stats.correct / rival.stats.total) * 100)
//       : 0;

//   return `Compare these two rival predictors and declare a winner. Be dramatic and specific.

// ${challenger.displayName}: ${challengerAcc}% accuracy, ${challenger.stats.bestStreak} best streak, favours ${challenger.stats.mostWrongTeam || "no team in particular"}
// ${rival.displayName}: ${rivalAcc}% accuracy, ${rival.stats.bestStreak} best streak, favours ${rival.stats.mostWrongTeam || "no team in particular"}

// Declare the superior predictor with a dramatic verdict. JSON only:
// {
//   "winner": "${challenger.displayName}" | "${rival.displayName}" | "DRAW",
//   "verdict": "string (dramatic 2-3 sentence ruling)",
//   "chalTrash": "string (trash talk FOR the challenger)",
//   "rivalTrash": "string (trash talk FOR the rival)"
// }`;
// }
