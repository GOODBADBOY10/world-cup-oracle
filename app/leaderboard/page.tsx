"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { WALRUS_AGGREGATOR, walrusBlobUrl } from "@/lib/walrus";

const BLOB_KEY = "oracle_blobId";
const REGISTRY_KEY = "oracle_registry"; // comma-separated blob IDs

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  blobId: string;
  total: number;
  correct: number;
  accuracy: number;
  bestStreak: number;
  avgConfidence: number;
}

const MEDAL = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myBlobId, setMyBlobId] = useState<string>("");
  const [registerMsg, setRegisterMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(BLOB_KEY) || "";
    setMyBlobId(stored);

    // Try registry blob first, fall back to manual list
    const registryBlobId = localStorage.getItem("oracle_registry_blobId") || "";
    const manualRegistry = localStorage.getItem(REGISTRY_KEY) || "";

    const load = async () => {
      let blobIds: string[] = [];

      if (registryBlobId) {
        try {
          // const res = await fetch(
          // `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${registryBlobId}`
          // );
          const res = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${registryBlobId}`);
          if (res.ok) {
            const registry = await res.json();
            blobIds = registry.blobIds || [];
          }
        } catch (e) {
          console.error("Registry fetch error:", e);
        }
      }

      // Merge with any manually added blobs
      const manual = manualRegistry.split(",").filter(Boolean);
      if (stored) manual.push(stored);
      blobIds = [...new Set([...blobIds, ...manual])];

      if (blobIds.length === 0) { setLoading(false); return; }

      // Save merged list back to manual registry
      localStorage.setItem(REGISTRY_KEY, blobIds.join(","));

      fetch(`/api/leaderboard?blobs=${blobIds.join(",")}`)
        .then((r) => r.json())
        .then((d) => setEntries(d.leaderboard || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    load();
  }, []);

  async function handleAddBlob() {
    const input = prompt("Enter a friend's Walrus blob ID to add them to the leaderboard:");
    if (!input?.trim()) return;
    const registry = localStorage.getItem(REGISTRY_KEY) || "";
    const blobs = [...new Set([...registry.split(",").filter(Boolean), input.trim()])];
    localStorage.setItem(REGISTRY_KEY, blobs.join(","));
    setRegisterMsg("Blob added! Refresh to see the leaderboard update.");
  }

  return (
    <>
      <nav>
        <Link href="/" className="btn-ghost">← Back</Link>
        <div className="display" style={{ fontSize: "1.3rem", color: "var(--gold)" }}>
          ⚽ ORACLE LEADERBOARD
        </div>
        <button className="btn-ghost" onClick={handleAddBlob}>+ Add friend</button>
      </nav>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--gold)" }}>
            WHO DOES THE ORACLE RESPECT?
          </h1>
          <p style={{ color: "var(--white-dim)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
            All memory stored publicly on Walrus Mainnet. No hiding your shame.
          </p>
          {registerMsg && <p style={{ color: "var(--gold)", fontSize: "0.85rem", marginTop: "0.5rem" }}>{registerMsg}</p>}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <p style={{ color: "var(--gold)", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
              RETRIEVING MEMORIES FROM WALRUS...
            </p>
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏜️</p>
            <p style={{ color: "var(--white-dim)", marginBottom: "1rem" }}>
              No entries yet. Be the first to face the Oracle.
            </p>
            <Link href="/" className="btn-primary">MAKE A PREDICTION</Link>
          </div>
        )}

        {entries.map((entry, i) => {
          const isMe = entry.blobId === myBlobId;
          return (
            <div
              key={entry.blobId}
              className="card fade-in"
              style={{
                marginBottom: "0.75rem",
                borderColor: isMe ? "var(--gold)" : "var(--border)",
                background: isMe ? "rgba(212,175,55,0.06)" : undefined,
              }}
            >
              <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "2.5rem 1fr auto", gap: "1rem", alignItems: "center" }}>

                {/* Rank */}
                <div style={{ textAlign: "center" }}>
                  {i < 3 ? (
                    <span style={{ fontSize: "1.5rem" }}>{MEDAL[i]}</span>
                  ) : (
                    <span className="display" style={{ fontSize: "1.3rem", color: "var(--white-dim)" }}>
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <p style={{ fontWeight: 500, fontSize: "1rem" }}>{entry.displayName}</p>
                    {isMe && (
                      <span style={{ fontSize: "0.65rem", color: "var(--gold)", border: "1px solid var(--gold-dim)", borderRadius: "3px", padding: "1px 6px", fontFamily: "var(--font-mono)" }}>
                        YOU
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--white-dim)" }}>
                      {entry.correct}/{entry.total} correct
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--white-dim)" }}>
                      🔥 best streak: {entry.bestStreak}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--white-dim)" }}>
                      avg conf: {entry.avgConfidence}/10
                    </span>
                  </div>
                  <div className="blob-pill" style={{ marginTop: "0.4rem", display: "inline-flex" }}>
                    🐋{" "}
                    {/* <a href={walrusBlobUrl(entry.blobId)} target="_blank" rel="noreferrer">
                      {entry.blobId.slice(0, 12)}…
                    </a> */}
                    <a href={entry.blobId ? walrusBlobUrl(entry.blobId) : "#"} target="_blank" rel="noreferrer">
                      {entry.blobId?.slice(0, 12) ?? "unknown"}…
                    </a>
                  </div>
                </div>

                {/* Accuracy */}
                <div style={{ textAlign: "right" }}>
                  <p className="display" style={{ fontSize: "2rem", color: entry.accuracy >= 60 ? "var(--gold)" : entry.accuracy >= 40 ? "var(--white)" : "#e88" }}>
                    {entry.accuracy}%
                  </p>
                  <div className="progress-bar" style={{ width: "80px", marginTop: "4px" }}>
                    <div className="progress-fill" style={{ width: `${entry.accuracy}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: "2.5rem", padding: "1.5rem", textAlign: "center", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--white-dim)", marginBottom: "0.75rem" }}>
            Share your blob ID with friends to compete. All data is public on Walrus.
          </p>
          {myBlobId && (
            <div className="blob-pill" style={{ justifyContent: "center", display: "inline-flex" }}>
              🐋 Your blob:{" "}
              <button
                onClick={() => { navigator.clipboard.writeText(myBlobId); alert("Copied!"); }}
                style={{ background: "none", border: "none", color: "var(--gold-dim)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}
              >
                {myBlobId.slice(0, 20)}… (click to copy)
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
