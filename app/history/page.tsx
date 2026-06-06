"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { readMemoryFromWalrus, walrusBlobUrl, type UserMemory } from "@/lib/walrus";

const BLOB_KEY = "oracle_blobId";
const NAME_KEY = "oracle_displayName";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
      <p style={{ fontSize: "0.65rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
        {label}
      </p>
      <p className="display" style={{ fontSize: "2.2rem", color: "var(--gold)", marginTop: "0.25rem" }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: "0.75rem", color: "var(--white-dim)", marginTop: "0.2rem" }}>{sub}</p>}
    </div>
  );
}

export default function HistoryPage() {
  const [memory, setMemory] = useState<UserMemory | null>(null);
  const [loading, setLoading] = useState(true);
  const [blobId, setBlobId] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [activeRoastId, setActiveRoastId] = useState<string | null>(null);
  const [generatingRoast, setGeneratingRoast] = useState(false);
  const [liveRoast, setLiveRoast] = useState<any>(null);

  useEffect(() => {
    const storedBlob = localStorage.getItem(BLOB_KEY) || "";
    const storedName = localStorage.getItem(NAME_KEY) || "";
    setBlobId(storedBlob);
    setDisplayName(storedName);

    if (storedBlob) {
      readMemoryFromWalrus(storedBlob)
        .then(setMemory)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function handleGetRoasted() {
    if (!blobId) return;
    setGeneratingRoast(true);
    setLiveRoast(null);
    try {
      const res = await fetch(`/api/roast?blobId=${blobId}`);
      const data = await res.json();
      setLiveRoast(data.roast);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingRoast(false);
    }
  }

  async function handleShareShame() {
    const text = `The World Cup Oracle has judged me: "${liveRoast?.roast}" 💀 Can you do better? oracle.vercel.app`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  }

  if (loading) {
    return (
      <main style={{ maxWidth: "800px", margin: "10vh auto", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--gold)", fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: "0.05em" }}>
          RETRIEVING FROM WALRUS...
        </p>
      </main>
    );
  }

  if (!blobId) {
    return (
      <main style={{ maxWidth: "600px", margin: "10vh auto", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--white-dim)", marginBottom: "1rem" }}>
          No Oracle memory found. Make some predictions first.
        </p>
        <Link href="/" className="btn-primary">GO PREDICT</Link>
      </main>
    );
  }

  const resolved = memory?.predictions.filter((p) => p.resolved) || [];
  const accuracy = resolved.length > 0
    ? Math.round((resolved.filter((p) => p.correct).length / resolved.length) * 100)
    : 0;

  return (
    <>
      <nav>
        <Link href="/" className="btn-ghost">← Back</Link>
        <div className="display" style={{ fontSize: "1.3rem", color: "var(--gold)" }}>
          {displayName}'s ORACLE RECORD
        </div>
        <div className="blob-pill">
          🐋{" "}
          <a href={walrusBlobUrl(blobId)} target="_blank" rel="noreferrer">
            {blobId.slice(0, 12)}…
          </a>
        </div>
      </nav>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard label="TOTAL" value={memory?.stats.total || 0} />
          <StatCard label="CORRECT" value={memory?.stats.correct || 0} />
          <StatCard label="ACCURACY" value={`${accuracy}%`} />
          <StatCard label="BEST STREAK" value={memory?.stats.bestStreak || 0} />
          <StatCard
            label="AVG CONFIDENCE"
            value={`${memory?.stats.avgConfidence || 0}/10`}
            sub={memory?.stats.avgConfidence && memory.stats.avgConfidence > 7 ? "overconfident" : ""}
          />
          {memory?.stats.mostWrongTeam && (
            <StatCard label="CURSED PICK" value={memory.stats.mostWrongTeam} sub="most wrong" />
          )}
        </div>

        {/* Roast me button */}
        <div className="card-gold" style={{ padding: "1.5rem", marginBottom: "2rem", textAlign: "center" }}>
          <p style={{ color: "var(--white-dim)", marginBottom: "1rem", fontSize: "0.9rem" }}>
            Ready to face the Oracle's full judgment on your entire record?
          </p>
          <button
            className="btn-primary"
            onClick={handleGetRoasted}
            disabled={generatingRoast || (memory?.predictions.length || 0) === 0}
          >
            {generatingRoast ? "ORACLE SPEAKS..." : "⚡ ROAST MY ENTIRE RECORD"}
          </button>

          {liveRoast && (
            <div
              className="fade-in"
              style={{ marginTop: "1.5rem", textAlign: "left", background: "rgba(10,26,15,0.6)", borderRadius: "6px", padding: "1.25rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: "var(--font-display)", color: "var(--gold-dim)", letterSpacing: "0.05em" }}>
                  ORACLE VERDICT
                </span>
                <span className={`verdict-${liveRoast.verdict?.toLowerCase()}`}>
                  {liveRoast.verdict}
                </span>
              </div>
              <p style={{ fontSize: "1rem", lineHeight: 1.7, fontStyle: "italic", color: "var(--white)" }}>
                "{liveRoast.roast}"
              </p>
              <button
                className="btn-ghost"
                onClick={handleShareShame}
                style={{ marginTop: "1rem" }}
              >
                Share this verdict 📣
              </button>
            </div>
          )}
        </div>

        {/* Predictions list */}
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.1em", color: "var(--white-dim)", marginBottom: "1rem" }}>
          PREDICTION HISTORY
        </p>

        {(!memory || memory.predictions.length === 0) && (
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "var(--white-dim)" }}>No predictions yet. The Oracle is waiting.</p>
            <Link href="/" className="btn-primary" style={{ display: "inline-block", marginTop: "1rem" }}>
              MAKE A PREDICTION
            </Link>
          </div>
        )}

        {memory?.predictions.slice().reverse().map((p, i) => {
          const roast = memory.roasts.find((r) => r.predictionId === p.id);
          const isExpanded = activeRoastId === p.id;

          return (
            <div
              key={p.id}
              className="card"
              style={{
                marginBottom: "0.75rem",
                borderColor: p.resolved
                  ? p.correct
                    ? "rgba(212,175,55,0.3)"
                    : "rgba(192,57,43,0.3)"
                  : "var(--border)",
              }}
            >
              <div
                style={{ padding: "1rem 1.25rem", cursor: "pointer" }}
                onClick={() => setActiveRoastId(isExpanded ? null : p.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                      {p.homeTeam} vs {p.awayTeam}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "var(--white-dim)", marginTop: "0.25rem" }}>
                      Predicted: {p.predictedWinner} · {p.predictedScore.home}–{p.predictedScore.away} ·{" "}
                      <span style={{ color: "var(--gold-dim)" }}>{p.confidence}/10 conf</span>
                    </p>
                    {p.resolved && p.actualScore && (
                      <p style={{ fontSize: "0.8rem", color: p.correct ? "var(--gold)" : "#e88", marginTop: "0.2rem" }}>
                        {p.correct ? "✓ Correct" : `✗ Actual: ${p.actualWinner} ${p.actualScore.home}–${p.actualScore.away}`}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {p.resolved ? (
                      <span style={{ fontSize: "1.5rem" }}>{p.correct ? "🏆" : "💀"}</span>
                    ) : (
                      <span style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", border: "1px solid var(--border)", borderRadius: "3px", padding: "2px 6px" }}>
                        PENDING
                      </span>
                    )}
                    <p style={{ fontSize: "0.65rem", color: "var(--white-dim)", marginTop: "0.25rem" }}>
                      {isExpanded ? "▲" : "▼"}
                    </p>
                  </div>
                </div>
              </div>

              {isExpanded && roast && (
                <div
                  className="fade-in"
                  style={{
                    borderTop: "1px solid var(--border)",
                    padding: "1rem 1.25rem",
                    background: "rgba(10,26,15,0.4)",
                  }}
                >
                  <p style={{ fontSize: "0.7rem", color: "var(--gold-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                    ORACLE'S JUDGMENT
                  </p>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.6, fontStyle: "italic", color: "var(--white-dim)" }}>
                    "{roast.roast}"
                  </p>
                  {p.hotTake && (
                    <p style={{ fontSize: "0.8rem", color: "var(--white-dim)", marginTop: "0.75rem" }}>
                      Your hot take: <em>"{p.hotTake}"</em>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Walrus provenance */}
        <div style={{ marginTop: "3rem", padding: "1.5rem", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--white-dim)", marginBottom: "0.5rem" }}>
            This memory is permanently stored on Walrus Mainnet
          </p>
          <a
            href={walrusBlobUrl(blobId)}
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--gold-dim)", wordBreak: "break-all" }}
          >
            {walrusBlobUrl(blobId)}
          </a>
        </div>
      </main>
    </>
  );
}
