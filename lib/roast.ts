import type { UserMemory, Prediction } from "./walrus";

/**
 * Generate a roast prompt for Claude based on user's full prediction history.
 * Passed as the system prompt to the Anthropic API.
 */
export function buildRoastSystemPrompt(): string {
  return `You are the World Cup Oracle, a savage football deity who never forgets a bad prediction. Roast users based on their history. Be specific, brutal, and funny. Always respond with valid JSON only:
{"roast":"string","verdict":"GLORY"|"SHAME"|"MEDIOCRE","rating":number,"callout":"string"}`;
}

export function buildRoastUserPrompt(memory: UserMemory, newPrediction?: Prediction): string {
  const resolved = memory.predictions.filter((p) => p.resolved);
  const accuracy =
    resolved.length > 0
      ? Math.round((resolved.filter((p) => p.correct).length / resolved.length) * 100)
      : 0;

  const predHistory = resolved
    .slice(-10)
    .map(
      (p) =>
        `${p.homeTeam} vs ${p.awayTeam}: predicted ${p.predictedWinner} (${p.predictedScore.home}-${p.predictedScore.away}), confidence ${p.confidence}/10 → ${p.correct ? "CORRECT ✓" : `WRONG ✗ (actual: ${p.actualWinner}, ${p.actualScore?.home}-${p.actualScore?.away})`}`
    )
    .join("\n");

  const unresolved = memory.predictions.filter((p) => !p.resolved);

  let prompt = `User: ${memory.displayName}
Overall accuracy: ${accuracy}% (${resolved.filter((p) => p.correct).length}/${resolved.length} correct)
Current streak: ${memory.stats.streak} ${memory.stats.streak > 0 ? "correct" : "wrong"}
Best streak ever: ${memory.stats.bestStreak}
Avg confidence: ${memory.stats.avgConfidence}/10
Most wrong team: ${memory.stats.mostWrongTeam || "N/A"}

Recent prediction history:
${predHistory || "No resolved predictions yet."}

Pending predictions (not yet resolved): ${unresolved.length}
`;

  if (newPrediction) {
    prompt += `
NEW PREDICTION JUST MADE:
${newPrediction.homeTeam} vs ${newPrediction.awayTeam}
Predicted winner: ${newPrediction.predictedWinner}
Predicted score: ${newPrediction.predictedScore.home}-${newPrediction.predictedScore.away}
Confidence: ${newPrediction.confidence}/10
${newPrediction.hotTake ? `Hot take: "${newPrediction.hotTake}"` : ""}

Roast this prediction in the context of their full history.`;
  } else {
    prompt += `
Roast this user's overall prediction record. Be specific about their failures.`;
  }

  return prompt;
}

export function buildChallengePrompt(
  challenger: UserMemory,
  rival: UserMemory
): string {
  const challengerAcc =
    challenger.stats.total > 0
      ? Math.round((challenger.stats.correct / challenger.stats.total) * 100)
      : 0;
  const rivalAcc =
    rival.stats.total > 0
      ? Math.round((rival.stats.correct / rival.stats.total) * 100)
      : 0;

  return `Compare these two rival predictors and declare a winner. Be dramatic and specific.

${challenger.displayName}: ${challengerAcc}% accuracy, ${challenger.stats.bestStreak} best streak, favours ${challenger.stats.mostWrongTeam || "no team in particular"}
${rival.displayName}: ${rivalAcc}% accuracy, ${rival.stats.bestStreak} best streak, favours ${rival.stats.mostWrongTeam || "no team in particular"}

Declare the superior predictor with a dramatic verdict. JSON only:
{
  "winner": "${challenger.displayName}" | "${rival.displayName}" | "DRAW",
  "verdict": "string (dramatic 2-3 sentence ruling)",
  "chalTrash": "string (trash talk FOR the challenger)",
  "rivalTrash": "string (trash talk FOR the rival)"
}`;
}
