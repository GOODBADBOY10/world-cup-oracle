export const WALRUS_PUBLISHER = "https://publisher.walrus-testnet.walrus.space";
export const WALRUS_AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
export const REGISTRY_BLOB_KEY = "oracle_registry_blobId";

export interface Prediction {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  predictedWinner: string | "draw";
  predictedScore: { home: number; away: number };
  confidence: number;
  hotTake?: string;
  createdAt: string;
  actualWinner?: string | "draw";
  actualScore?: { home: number; away: number };
  resolved?: boolean;
  correct?: boolean;
}

export interface RoastEntry {
  id: string;
  predictionId: string;
  roast: string;
  createdAt: string;
  type: "shame" | "glory" | "neutral";
}

export interface UserMemory {
  userId: string;
  displayName: string;
  blobId?: string;
  predictions: Prediction[];
  roasts: RoastEntry[];
  rivalId?: string;
  stats: {
    total: number;
    correct: number;
    streak: number;
    bestStreak: number;
    mostWrongTeam?: string;
    avgConfidence: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Registry {
  blobIds: string[];
  updatedAt: string;
}

export function createEmptyMemory(userId: string, displayName: string): UserMemory {
  return {
    userId,
    displayName,
    predictions: [],
    roasts: [],
    stats: { total: 0, correct: 0, streak: 0, bestStreak: 0, avgConfidence: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function computeStats(memory: UserMemory): UserMemory["stats"] {
  const resolved = memory.predictions.filter((p) => p.resolved);
  const correct = resolved.filter((p) => p.correct);

  let streak = 0;
  for (let i = resolved.length - 1; i >= 0; i--) {
    if (resolved[i].correct) streak++;
    else break;
  }

  let best = 0, cur = 0;
  for (const p of resolved) {
    if (p.correct) { cur++; best = Math.max(best, cur); }
    else cur = 0;
  }

  const wrongCounts: Record<string, number> = {};
  resolved.filter((p) => !p.correct).forEach((p) => {
    wrongCounts[p.predictedWinner] = (wrongCounts[p.predictedWinner] || 0) + 1;
  });
  const mostWrongTeam = Object.entries(wrongCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  const avgConfidence = memory.predictions.length > 0
    ? Math.round(memory.predictions.reduce((s, p) => s + p.confidence, 0) / memory.predictions.length)
    : 0;

  return { total: memory.predictions.length, correct: correct.length, streak, bestStreak: best, mostWrongTeam, avgConfidence };
}

export async function writeMemoryToWalrus(memory: UserMemory): Promise<string> {
  const json = JSON.stringify({ ...memory, updatedAt: new Date().toISOString() });

  const res = await fetch(`${WALRUS_PUBLISHER}/v1/blobs?epochs=5`, {
    method: "PUT",
    body: json,
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Walrus write failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const blobId =
    data?.newlyCreated?.blobObject?.blobId ||
    data?.alreadyCertified?.blobId ||
    data?.blobId;

  if (!blobId) throw new Error("No blobId returned: " + JSON.stringify(data));
  return blobId;
}

export async function readMemoryFromWalrus(blobId: string): Promise<UserMemory> {
  const res = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`);
  if (!res.ok) throw new Error(`Walrus read failed: ${res.status}`);
  return res.json();
}

export function walrusBlobUrl(blobId: string): string {
  return `${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`;
}

export async function readRegistry(registryBlobId: string): Promise<Registry> {
  const res = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${registryBlobId}`);
  if (!res.ok) return { blobIds: [], updatedAt: new Date().toISOString() };
  return res.json();
}

export async function writeRegistry(registry: Registry): Promise<string> {
  const json = JSON.stringify({ ...registry, updatedAt: new Date().toISOString() });
  const res = await fetch(`${WALRUS_PUBLISHER}/v1/blobs?epochs=5`, {
    method: "PUT",
    body: json,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Registry write failed: ${res.status}`);
  const data = await res.json();
  return data?.newlyCreated?.blobObject?.blobId || data?.alreadyCertified?.blobId || data?.blobId;
}