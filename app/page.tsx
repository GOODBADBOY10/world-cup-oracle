"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MATCHES, getUpcomingMatches, ROUND_LABELS } from "@/lib/matches";
import type { UserMemory, Prediction } from "@/lib/walrus";

// ─── Local storage keys ───────────────────────────────────────────────────────
const BLOB_KEY = "oracle_blobId";
const USER_KEY = "oracle_userId";
const NAME_KEY = "oracle_displayName";

function genUserId() {
  return "user_" + Math.random().toString(36).slice(2, 10);
}

// ─── Components ──────────────────────────────────────────────────────────────

function Nav({ displayName, blobId }: { displayName: string; blobId?: string }) {
  return (
    <nav>
      <div className="display" style={{ fontSize: "1.5rem", color: "var(--gold)", letterSpacing: "0.05em" }}>
        ⚽ WORLD CUP ORACLE
      </div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link href="/leaderboard" className="btn-ghost">Leaderboard</Link>
        <Link href="/history" className="btn-ghost">My History</Link>
        {blobId && (
          <div className="blob-pill">
            <span>🐋</span>
            <a
              href={`https://aggregator.walrus-mainnet.walrus.space/v1/blobs/${blobId}`}
              target="_blank"
              rel="noreferrer"
              title="View your memory on Walrus"
            >
              {blobId.slice(0, 8)}…
            </a>
          </div>
        )}
        <span style={{ fontSize: "0.8rem", color: "var(--white-dim)" }}>{displayName}</span>
      </div>
    </nav>
  );
}

function RoastPanel({
  roast,
  verdict,
  rating,
  callout,
  loading,
}: {
  roast: string;
  verdict: string;
  rating: number;
  callout?: string;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔮</div>
        <p style={{ color: "var(--gold)", fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "0.05em" }}>
          THE ORACLE CONSULTS THE SACRED SCROLLS...
        </p>
        <p style={{ color: "var(--white-dim)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          Your prediction is being committed to the blockchain of shame
        </p>
      </div>
    );
  }

  const verdictClass =
    verdict === "GLORY" ? "verdict-glory" : verdict === "SHAME" ? "verdict-shame" : "verdict-mediocre";
  const verdictEmoji =
    verdict === "GLORY" ? "🏆" : verdict === "SHAME" ? "💀" : "😐";

  return (
    <div
      className={`card fade-in ${verdict === "SHAME" ? "shame-flash" : verdict === "GLORY" ? "glow-pulse" : ""}`}
      style={{ padding: "1.5rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--white-dim)", letterSpacing: "0.05em" }}>
          ORACLE SPEAKS
        </p>
        <span className={verdictClass}>
          {verdictEmoji} {verdict}
        </span>
      </div>

      <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "var(--white)", marginBottom: "1rem" }}>
        "{roast}"
      </p>

      {callout && (
        <div style={{ background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: "4px", padding: "0.6rem 1rem", marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#e88", fontFamily: "var(--font-mono)" }}>
            📌 {callout}
          </p>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--white-dim)" }}>Oracle Rating</p>
        <div className="progress-bar" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${rating * 10}%` }} />
        </div>
        <span style={{ fontSize: "0.85rem", color: "var(--gold)", fontFamily: "var(--font-mono)" }}>
          {rating}/10
        </span>
      </div>
    </div>
  );
}

const FLAG_CODES: Record<string, string> = {
  "Mexico": "mx", "South Africa": "za", "South Korea": "kr", "Czechia": "cz",
  "Canada": "ca", "Bosnia and Herzegovina": "ba", "Qatar": "qa", "Switzerland": "ch",
  "Brazil": "br", "Morocco": "ma", "Haiti": "ht", "Scotland": "gb-sct",
  "USA": "us", "Paraguay": "py", "Australia": "au", "Türkiye": "tr",
  "Germany": "de", "Curaçao": "cw", "Ivory Coast": "ci", "Ecuador": "ec",
  "Netherlands": "nl", "Japan": "jp", "Sweden": "se", "Tunisia": "tn",
  "Belgium": "be", "Egypt": "eg", "Iran": "ir", "New Zealand": "nz",
  "Spain": "es", "Cape Verde": "cv", "Saudi Arabia": "sa", "Uruguay": "uy",
  "France": "fr", "Senegal": "sn", "Iraq": "iq", "Norway": "no",
  "Argentina": "ar", "Algeria": "dz", "Austria": "at", "Jordan": "jo",
  "Portugal": "pt", "DR Congo": "cd", "Uzbekistan": "uz", "Colombia": "co",
  "England": "gb-eng", "Croatia": "hr", "Ghana": "gh", "Panama": "pa",
};

function FlagImg({ team, size = 24 }: { team: string; size?: number }) {
  const code = FLAG_CODES[team];
  if (!code) return <span>🏳️</span>;
  return (
    <img
      src={`https://flagcdn.com/w${size * 2}/${code}.png`}
      width={size * 1.5}
      height={size}
      alt={team}
      style={{ borderRadius: "2px", objectFit: "cover", verticalAlign: "middle" }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

function MatchCard({
  match,
  onSelect,
  selected,
}: {
  match: ReturnType<typeof getUpcomingMatches>[0];
  onSelect: () => void;
  selected: boolean;
}) {
  const kickoff = new Date(match.kickoff);
  const isKnown = match.homeTeam !== "TBD";

  return (
    <button
      onClick={onSelect}
      style={{
        background: selected ? "rgba(212,175,55,0.12)" : "rgba(15,37,24,0.8)",
        border: `1px solid ${selected ? "var(--gold)" : "var(--border)"}`,
        borderRadius: "8px",
        padding: "1rem",
        cursor: isKnown ? "pointer" : "default",
        textAlign: "left",
        transition: "border-color 0.15s, background 0.15s",
        opacity: isKnown ? 1 : 0.5,
        width: "100%",
      }}
      disabled={!isKnown}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.7rem", color: "var(--gold-dim)", fontFamily: "var(--font-mono)" }}>
          {match.group ? `GROUP ${match.group}` : ROUND_LABELS[match.round].toUpperCase()}
        </span>
        <span style={{ fontSize: "0.7rem", color: "var(--white-dim)" }}>
          {kickoff.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
          <FlagImg team={match.homeTeam} size={20} /> {match.homeTeam}
        </span>
        <span style={{ color: "var(--white-dim)", fontSize: "0.8rem", flexShrink: 0 }}>vs</span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
          {match.awayTeam} <FlagImg team={match.awayTeam} size={20} />
        </span>
      </div>
      <p style={{ fontSize: "0.7rem", color: "var(--white-dim)", marginTop: "0.4rem" }}>
        📍 {match.city}
      </p>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [userId, setUserId] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [blobId, setBlobId] = useState<string | undefined>();
  const [memory, setMemory] = useState<UserMemory | null>(null);
  const [nameInput, setNameInput] = useState<string>("");
  const [started, setStarted] = useState(false);

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [predictedWinner, setPredictedWinner] = useState<string>("");
  const [scoreHome, setScoreHome] = useState<number>(1);
  const [scoreAway, setScoreAway] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(7);
  const [hotTake, setHotTake] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [roastResult, setRoastResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);

  const upcomingMatches = getUpcomingMatches();
  const selectedMatch = MATCHES.find((m) => m.id === selectedMatchId);


  // Load from localStorage on mount
  useEffect(() => {
    const storedBlob = localStorage.getItem(BLOB_KEY) || undefined;
    const storedUser = localStorage.getItem(USER_KEY) || genUserId();
    const storedName = localStorage.getItem(NAME_KEY) || "";

    setUserId(storedUser);
    setBlobId(storedBlob);
    setNameInput(storedName);

    if (storedName) {
      setDisplayName(storedName);
      setStarted(true);
    }

    localStorage.setItem(USER_KEY, storedUser);
  }, []);

  function handleStart() {
    if (!nameInput.trim()) return;
    const name = nameInput.trim();
    setDisplayName(name);
    localStorage.setItem(NAME_KEY, name);
    setStarted(true);
  }

  async function handleSubmitPrediction() {
    if (!selectedMatch || !predictedWinner) {
      setError("Select a match and a winner.");
      return;
    }
    setError("");
    setLoading(true);
    setRoastResult(null);

    try {
      const prediction = {
        matchId: selectedMatch.id,
        homeTeam: selectedMatch.homeTeam,
        awayTeam: selectedMatch.awayTeam,
        predictedWinner,
        predictedScore: { home: scoreHome, away: scoreAway },
        confidence,
        hotTake: hotTake.trim() || undefined,
        resolved: false,
      };

      const registryBlobId = localStorage.getItem("oracle_registry_blobId") || "";

      const res = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-registry-blob": registryBlobId,
        },
        body: JSON.stringify({ userId, displayName, blobId, prediction }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setBlobId(data.blobId);
      setMemory(data.memory);
      setRoastResult(data.roast);
      localStorage.setItem(BLOB_KEY, data.blobId);
      if (data.registryBlobId) {
        localStorage.setItem("oracle_registry_blobId", data.registryBlobId);
      }

      // Reset form
      setSelectedMatchId(null);
      setPredictedWinner("");
      setHotTake("");
      setScoreHome(1);
      setScoreAway(0);
      setConfidence(7);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // ── Splash / name entry ────────────────────────────────────────────────────
  if (!started) {
    return (
      <>
        <Nav displayName="" blobId={undefined} />
        <main style={{ maxWidth: "480px", margin: "8vh auto", padding: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "5rem", color: "var(--gold)", lineHeight: 1 }}>
              ⚽
            </p>
            <h1
              className="display"
              style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", color: "var(--white)", marginBottom: "0.5rem" }}
            >
              WORLD CUP ORACLE
            </h1>
            <p style={{ color: "var(--white-dim)", fontSize: "1rem", lineHeight: 1.6 }}>
              Make predictions. Get roasted. The Oracle remembers every bad call — across sessions, forever,
              on the blockchain.
            </p>
          </div>

          <div className="card" style={{ padding: "2rem" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "0.05em", color: "var(--gold)", marginBottom: "1rem" }}>
              IDENTIFY YOURSELF, MORTAL
            </p>
            <input
              placeholder="Enter your name or alias"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              style={{ marginBottom: "1rem" }}
            />
            <button className="btn-primary" onClick={handleStart} style={{ width: "100%" }}>
              ENTER THE ORACLE
            </button>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <div className="blob-pill">
              <span>🐋</span>
              <span>Powered by Walrus Mainnet</span>
            </div>
            <div className="blob-pill">
              <span>🧠</span>
              <span>Memory persists forever</span>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Main oracle UI ─────────────────────────────────────────────────────────
  const resolved = memory?.predictions.filter((p) => p.resolved) || [];
  const accuracy =
    resolved.length > 0
      ? Math.round((resolved.filter((p) => p.correct).length / resolved.length) * 100)
      : null;

  return (
    <>
      <Nav displayName={displayName} blobId={blobId} />
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--gold)" }}>
            MAKE YOUR PREDICTION
          </h1>
          <p style={{ color: "var(--white-dim)", marginTop: "0.25rem" }}>
            The Oracle sees all, remembers all, judges all.
          </p>
        </div>

        {/* Stats row */}
        {memory && (
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "PREDICTIONS", value: memory.stats.total },
              { label: "CORRECT", value: memory.stats.correct },
              { label: "ACCURACY", value: accuracy !== null ? `${accuracy}%` : "—" },
              { label: "BEST STREAK", value: memory.stats.bestStreak },
            ].map((s) => (
              <div key={s.label} className="card" style={{ padding: "1rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.65rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>{s.label}</p>
                <p className="display" style={{ fontSize: "2rem", color: "var(--gold)", marginTop: "0.25rem" }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>

          {/* Left: Match picker only */}
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.1em", color: "var(--white-dim)", marginBottom: "1rem" }}>
              SELECT A MATCH
            </p>
            <div className="match-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {upcomingMatches.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  selected={selectedMatchId === m.id}
                  onSelect={() => {
                    setSelectedMatchId(m.id);
                    setPredictedWinner("");
                    setScoreHome(1);
                    setScoreAway(0);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: prediction form OR oracle verdict */}
          <div className="right-panel" style={{ position: "sticky", top: "80px" }}>

            {/* No match selected yet */}
            {!selectedMatch && !roastResult && (
              <div className="card" style={{ padding: "2.5rem", textAlign: "center", borderStyle: "dashed" }}>
                <p style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🔮</p>
                <p style={{ color: "var(--white-dim)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  ← Pick a match to make your prediction.
                </p>
                {blobId && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--white-dim)", marginBottom: "0.5rem" }}>Your memory on Walrus:</p>
                    <div className="blob-pill" style={{ justifyContent: "center" }}>
                      🐋 <a href={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`} target="_blank" rel="noreferrer">{blobId.slice(0, 16)}…</a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Match selected — show prediction form */}
            {selectedMatch && !loading && !roastResult && (
              <div className="card fade-in" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <p className="display" style={{ fontSize: "1.1rem", color: "var(--gold)" }}>
                    {selectedMatch.homeFlag} {selectedMatch.homeTeam} vs {selectedMatch.awayTeam} {selectedMatch.awayFlag}
                  </p>
                  <button onClick={() => setSelectedMatchId(null)} style={{ background: "none", border: "none", color: "var(--white-dim)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
                </div>

                {/* Winner selector */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", display: "block", marginBottom: "0.5rem" }}>
                    PREDICTED WINNER
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[selectedMatch.homeTeam, "Draw", selectedMatch.awayTeam].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setPredictedWinner(opt === "Draw" ? "draw" : opt)}
                        style={{
                          flex: 1,
                          padding: "0.6rem",
                          background: predictedWinner === (opt === "Draw" ? "draw" : opt) ? "rgba(212,175,55,0.2)" : "transparent",
                          border: `1px solid ${predictedWinner === (opt === "Draw" ? "draw" : opt) ? "var(--gold)" : "var(--border)"}`,
                          borderRadius: "4px",
                          color: predictedWinner === (opt === "Draw" ? "draw" : opt) ? "var(--gold)" : "var(--white-dim)",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          transition: "all 0.15s",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "0.75rem", alignItems: "center", marginBottom: "1.25rem" }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", display: "block", marginBottom: "0.4rem" }}>
                      {selectedMatch.homeTeam.toUpperCase()}
                    </label>
                    <input
                      type="number" min={0} max={20} value={scoreHome}
                      onChange={(e) => {
                        const h = parseInt(e.target.value) || 0;
                        setScoreHome(h);
                        if (h > scoreAway) setPredictedWinner(selectedMatch.homeTeam);
                        else if (h < scoreAway) setPredictedWinner(selectedMatch.awayTeam);
                        else setPredictedWinner("draw");
                      }}
                      style={{ textAlign: "center", fontSize: "1.5rem", fontFamily: "var(--font-display)" }}
                    />
                  </div>
                  <span style={{ color: "var(--white-dim)", fontSize: "1.2rem", marginTop: "1.2rem" }}>—</span>
                  <div>
                    <label style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", display: "block", marginBottom: "0.4rem" }}>
                      {selectedMatch.awayTeam.toUpperCase()}
                    </label>
                    <input
                      type="number" min={0} max={20} value={scoreAway}
                      onChange={(e) => {
                        const a = parseInt(e.target.value) || 0;
                        setScoreAway(a);
                        if (scoreHome > a) setPredictedWinner(selectedMatch.homeTeam);
                        else if (scoreHome < a) setPredictedWinner(selectedMatch.awayTeam);
                        else setPredictedWinner("draw");
                      }}
                      style={{ textAlign: "center", fontSize: "1.5rem", fontFamily: "var(--font-display)" }}
                    />
                  </div>
                </div>

                {/* Confidence */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>CONFIDENCE</label>
                    <span style={{ fontSize: "0.85rem", color: "var(--gold)", fontFamily: "var(--font-display)" }}>{confidence}/10</span>
                  </div>
                  <input type="range" min={1} max={10} value={confidence} onChange={(e) => setConfidence(parseInt(e.target.value))} style={{ background: "transparent", padding: 0 }} />
                </div>

                {/* Hot take */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>
                    HOT TAKE (optional)
                  </label>
                  <textarea
                    placeholder="e.g. 'Messi will carry Argentina single-handedly'"
                    value={hotTake}
                    onChange={(e) => setHotTake(e.target.value)}
                    rows={2}
                    style={{ resize: "vertical" }}
                  />
                </div>

                {/* Conflict warnings */}
                {predictedWinner && predictedWinner !== "draw" && scoreHome === scoreAway && (
                  <p style={{ color: "#e88", fontSize: "0.8rem", marginBottom: "0.75rem" }}>⚠️ Score is a draw but winner is {predictedWinner}.</p>
                )}
                {predictedWinner === "draw" && scoreHome !== scoreAway && (
                  <p style={{ color: "#e88", fontSize: "0.8rem", marginBottom: "0.75rem" }}>⚠️ Score isn't level but Draw is selected.</p>
                )}
                {predictedWinner === selectedMatch?.homeTeam && scoreHome < scoreAway && (
                  <p style={{ color: "#e88", fontSize: "0.8rem", marginBottom: "0.75rem" }}>⚠️ Score says {selectedMatch.awayTeam} wins but you picked {selectedMatch.homeTeam}.</p>
                )}
                {predictedWinner === selectedMatch?.awayTeam && scoreHome > scoreAway && (
                  <p style={{ color: "#e88", fontSize: "0.8rem", marginBottom: "0.75rem" }}>⚠️ Score says {selectedMatch.homeTeam} wins but you picked {selectedMatch.awayTeam}.</p>
                )}

                {error && <p style={{ color: "#e88", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

                <button
                  className="btn-primary"
                  onClick={handleSubmitPrediction}
                  disabled={
                    loading || !predictedWinner ||
                    (predictedWinner !== "draw" && scoreHome === scoreAway) ||
                    (predictedWinner === "draw" && scoreHome !== scoreAway) ||
                    (predictedWinner === selectedMatch?.homeTeam && scoreHome < scoreAway) ||
                    (predictedWinner === selectedMatch?.awayTeam && scoreHome > scoreAway)
                  }
                  style={{ width: "100%" }}
                >
                  SUBMIT TO THE ORACLE
                </button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔮</div>
                <p style={{ color: "var(--gold)", fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "0.05em" }}>
                  THE ORACLE CONSULTS THE SACRED SCROLLS...
                </p>
                <p style={{ color: "var(--white-dim)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  Committing your prediction to the blockchain of shame
                </p>
              </div>
            )}

            {/* Roast result */}
            {roastResult && !loading && (
              <div>
                <RoastPanel
                  loading={false}
                  roast={roastResult.roast}
                  verdict={roastResult.verdict}
                  rating={roastResult.rating}
                  callout={roastResult.callout}
                />
                <button
                  className="btn-ghost"
                  onClick={() => { setRoastResult(null); setSelectedMatchId(null); }}
                  style={{ width: "100%", marginTop: "0.75rem" }}
                >
                  ← Make another prediction
                </button>

                {/* Recent predictions */}
                {memory && memory.predictions.length > 0 && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <p style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                      RECENT PREDICTIONS
                    </p>
                    {memory.predictions.slice(-3).reverse().map((p) => (
                      <div key={p.id} className="card" style={{ padding: "0.75rem 1rem", marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.85rem" }}>{p.homeTeam} vs {p.awayTeam}</span>
                          {p.resolved
                            ? <span style={{ fontSize: "0.8rem", color: p.correct ? "var(--gold)" : "#e88" }}>{p.correct ? "✓" : "✗"}</span>
                            : <span style={{ fontSize: "0.7rem", color: "var(--white-dim)" }}>pending</span>
                          }
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--white-dim)", marginTop: "0.2rem" }}>
                          {p.predictedWinner} · {p.predictedScore.home}–{p.predictedScore.away} · <span style={{ color: "var(--gold-dim)" }}>{p.confidence}/10</span>
                        </p>
                      </div>
                    ))}
                    <Link href="/history" className="btn-ghost" style={{ display: "block", textAlign: "center", marginTop: "0.75rem" }}>
                      View full history →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// // ── Main oracle UI ─────────────────────────────────────────────────────────
// const resolved = memory?.predictions.filter((p) => p.resolved) || [];
// const accuracy =
//   resolved.length > 0
//     ? Math.round((resolved.filter((p) => p.correct).length / resolved.length) * 100)
//     : null;

// return (
//   <>
//     <Nav displayName={displayName} blobId={blobId} />
//     <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>

//       {/* Header */}
//       <div style={{ marginBottom: "2.5rem" }}>
//         <h1 className="display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--gold)" }}>
//           MAKE YOUR PREDICTION
//         </h1>
//         <p style={{ color: "var(--white-dim)", marginTop: "0.25rem" }}>
//           The Oracle sees all, remembers all, judges all.
//         </p>
//       </div>

//       {/* Stats row */}
//       {memory && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
//             gap: "1rem",
//             marginBottom: "2rem",
//           }}
//         >
//           {[
//             { label: "PREDICTIONS", value: memory.stats.total },
//             { label: "CORRECT", value: `${memory.stats.correct}` },
//             { label: "ACCURACY", value: accuracy !== null ? `${accuracy}%` : "—" },
//             { label: "BEST STREAK", value: memory.stats.bestStreak },
//           ].map((s) => (
//             <div key={s.label} className="card" style={{ padding: "1rem", textAlign: "center" }}>
//               <p style={{ fontSize: "0.65rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
//                 {s.label}
//               </p>
//               <p className="display" style={{ fontSize: "2rem", color: "var(--gold)", marginTop: "0.25rem" }}>
//                 {s.value}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem" }}>

//         {/* Left: Match picker + form */}
//         <div>
//           <p
//             style={{
//               fontFamily: "var(--font-display)",
//               fontSize: "0.85rem",
//               letterSpacing: "0.1em",
//               color: "var(--white-dim)",
//               marginBottom: "1rem",
//             }}
//           >
//             SELECT A MATCH
//           </p>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
//               gap: "0.75rem",
//               marginBottom: "2rem",
//             }}
//           >
//             {upcomingMatches.map((m) => (
//               <MatchCard
//                 key={m.id}
//                 match={m}
//                 selected={selectedMatchId === m.id}
//                 onSelect={() => {
//                   setSelectedMatchId(m.id);
//                   setPredictedWinner("");
//                   setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
//                 }}
//               />
//             ))}
//           </div>

//           {selectedMatch && (
//             <div ref={formRef} className="card fade-in" style={{ padding: "1.5rem" }}>
//               <p className="display" style={{ fontSize: "1.2rem", color: "var(--gold)", marginBottom: "1.5rem" }}>
//                 {selectedMatch.homeFlag} {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}{" "}
//                 {selectedMatch.awayFlag}
//               </p>

//               {/* {selectedMatch && (
// <div ref={formRef} className="card fade-in" style={{ padding: "1.5rem" }}> */}

//               {/* Winner selector */}
//               <div style={{ marginBottom: "1.25rem" }}>
//                 <label style={{ fontSize: "0.75rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", display: "block", marginBottom: "0.5rem" }}>
//                   PREDICTED WINNER
//                 </label>
//                 <div style={{ display: "flex", gap: "0.5rem" }}>
//                   {[selectedMatch.homeTeam, "Draw", selectedMatch.awayTeam].map((opt) => (
//                     <button
//                       key={opt}
//                       onClick={() => setPredictedWinner(opt === "Draw" ? "draw" : opt)}
//                       style={{
//                         flex: 1,
//                         padding: "0.6rem",
//                         background: predictedWinner === (opt === "Draw" ? "draw" : opt) ? "rgba(212,175,55,0.2)" : "transparent",
//                         border: `1px solid ${predictedWinner === (opt === "Draw" ? "draw" : opt) ? "var(--gold)" : "var(--border)"}`,
//                         borderRadius: "4px",
//                         color: predictedWinner === (opt === "Draw" ? "draw" : opt) ? "var(--gold)" : "var(--white-dim)",
//                         cursor: "pointer",
//                         fontSize: "0.85rem",
//                         transition: "all 0.15s",
//                       }}
//                     >
//                       {opt}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Score */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "0.75rem", alignItems: "center", marginBottom: "1.25rem" }}>
//                 <div>
//                   <label style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", display: "block", marginBottom: "0.4rem" }}>
//                     {selectedMatch.homeTeam.toUpperCase()}
//                   </label>
//                   <input
//                     type="number"
//                     min={0}
//                     max={20}
//                     value={scoreHome}
//                     onChange={(e) => {
//                       const h = parseInt(e.target.value) || 0;
//                       setScoreHome(h);
//                       // Auto-sync winner with score
//                       if (h > scoreAway) setPredictedWinner(selectedMatch.homeTeam);
//                       else if (h < scoreAway) setPredictedWinner(selectedMatch.awayTeam);
//                       else setPredictedWinner("draw");
//                     }}
//                     style={{ textAlign: "center", fontSize: "1.5rem", fontFamily: "var(--font-display)" }}
//                   />
//                 </div>
//                 <span style={{ color: "var(--white-dim)", fontSize: "1.2rem", marginTop: "1.2rem" }}>—</span>
//                 <div>
//                   <label style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", display: "block", marginBottom: "0.4rem" }}>
//                     {selectedMatch.awayTeam.toUpperCase()}
//                   </label>
//                   <input
//                     type="number"
//                     min={0}
//                     max={20}
//                     value={scoreAway}
//                     onChange={(e) => {
//                       const a = parseInt(e.target.value) || 0;
//                       setScoreAway(a);
//                       // Auto-sync winner with score
//                       if (scoreHome > a) setPredictedWinner(selectedMatch.homeTeam);
//                       else if (scoreHome < a) setPredictedWinner(selectedMatch.awayTeam);
//                       else setPredictedWinner("draw");
//                     }}
//                     style={{ textAlign: "center", fontSize: "1.5rem", fontFamily: "var(--font-display)" }}
//                   />
//                 </div>
//               </div>

//               {/* Confidence */}
//               <div style={{ marginBottom: "1.25rem" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
//                   <label style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
//                     CONFIDENCE
//                   </label>
//                   <span style={{ fontSize: "0.85rem", color: "var(--gold)", fontFamily: "var(--font-display)" }}>
//                     {confidence}/10
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min={1}
//                   max={10}
//                   value={confidence}
//                   onChange={(e) => setConfidence(parseInt(e.target.value))}
//                   style={{ background: "transparent", padding: 0 }}
//                 />
//               </div>

//               {/* Hot take */}
//               <div style={{ marginBottom: "1.5rem" }}>
//                 <label style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>
//                   HOT TAKE (optional — the Oracle will remember this)
//                 </label>
//                 <textarea
//                   placeholder="e.g. 'France haven't got a chance without Mbappé firing'"
//                   value={hotTake}
//                   onChange={(e) => setHotTake(e.target.value)}
//                   rows={2}
//                   style={{ resize: "vertical" }}
//                 />
//               </div>

//               {error && (
//                 <p style={{ color: "#e88", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>
//               )}

//               {/* Conflict warning */}
//               {predictedWinner && predictedWinner !== "draw" && scoreHome === scoreAway && (
//                 <p style={{ color: "#e88", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
//                   ⚠️ Score is a draw but winner is set to {predictedWinner} — fix the score or select Draw.
//                 </p>
//               )}
//               {predictedWinner === "draw" && scoreHome !== scoreAway && (
//                 <p style={{ color: "#e88", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
//                   ⚠️ Score isn't level but winner is Draw — fix the score or pick a winner.
//                 </p>
//               )}

//               {predictedWinner === selectedMatch?.homeTeam && scoreHome < scoreAway && (
//                 <p style={{ color: "#e88", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
//                   ⚠️ Score says {selectedMatch.awayTeam} wins but you picked {selectedMatch.homeTeam} — fix the score or change winner.
//                 </p>
//               )}
//               {predictedWinner === selectedMatch?.awayTeam && scoreHome > scoreAway && (
//                 <p style={{ color: "#e88", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
//                   ⚠️ Score says {selectedMatch.homeTeam} wins but you picked {selectedMatch.awayTeam} — fix the score or change winner.
//                 </p>
//               )}

//               <button
//                 className="btn-primary"
//                 onClick={handleSubmitPrediction}
//                 disabled={
//                   loading ||
//                   !predictedWinner ||
//                   (predictedWinner !== "draw" && scoreHome === scoreAway) ||
//                   (predictedWinner === "draw" && scoreHome !== scoreAway) ||
//                   (predictedWinner === selectedMatch?.homeTeam && scoreHome < scoreAway) ||
//                   (predictedWinner === selectedMatch?.awayTeam && scoreHome > scoreAway)
//                 }
//                 style={{ width: "100%" }}
//               >
//                 {loading ? "CONSULTING THE ORACLE..." : "SUBMIT TO THE ORACLE"}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Right: Oracle panel */}
//         <div>
//           <p
//             style={{
//               fontFamily: "var(--font-display)",
//               fontSize: "0.85rem",
//               letterSpacing: "0.1em",
//               color: "var(--white-dim)",
//               marginBottom: "1rem",
//             }}
//           >
//             ORACLE VERDICT
//           </p>

//           {loading || roastResult ? (
//             <RoastPanel
//               loading={loading}
//               roast={roastResult?.roast || ""}
//               verdict={roastResult?.verdict || "MEDIOCRE"}
//               rating={roastResult?.rating || 5}
//               callout={roastResult?.callout}
//             />
//           ) : (
//             <div
//               className="card"
//               style={{ padding: "2.5rem", textAlign: "center", borderStyle: "dashed" }}
//             >
//               <p style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🔮</p>
//               <p style={{ color: "var(--white-dim)", fontSize: "0.95rem", lineHeight: 1.6 }}>
//                 Select a match and make a prediction. The Oracle will judge you.
//               </p>
//               {blobId && (
//                 <div style={{ marginTop: "1.5rem" }}>
//                   <p style={{ fontSize: "0.75rem", color: "var(--white-dim)", marginBottom: "0.5rem" }}>
//                     Your memory lives on Walrus:
//                   </p>
//                   <div className="blob-pill" style={{ justifyContent: "center" }}>
//                     🐋{" "}
//                     <a
//                       href={`https://aggregator.walrus-mainnet.walrus.space/v1/blobs/${blobId}`}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       {blobId.slice(0, 16)}…
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Recent predictions */}
//           {memory && memory.predictions.length > 0 && (
//             <div style={{ marginTop: "1.5rem" }}>
//               <p style={{ fontSize: "0.7rem", color: "var(--white-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
//                 RECENT PREDICTIONS
//               </p>
//               {memory.predictions
//                 .slice(-4)
//                 .reverse()
//                 .map((p) => (
//                   <div
//                     key={p.id}
//                     className="card"
//                     style={{ padding: "0.75rem 1rem", marginBottom: "0.5rem" }}
//                   >
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                       <span style={{ fontSize: "0.85rem" }}>
//                         {p.homeTeam} vs {p.awayTeam}
//                       </span>
//                       {p.resolved ? (
//                         <span style={{ fontSize: "0.8rem", color: p.correct ? "var(--gold)" : "#e88" }}>
//                           {p.correct ? "✓" : "✗"}
//                         </span>
//                       ) : (
//                         <span style={{ fontSize: "0.7rem", color: "var(--white-dim)" }}>pending</span>
//                       )}
//                     </div>
//                     <p style={{ fontSize: "0.75rem", color: "var(--white-dim)", marginTop: "0.2rem" }}>
//                       {p.predictedWinner} · {p.predictedScore.home}–{p.predictedScore.away} ·{" "}
//                       <span style={{ color: "var(--gold-dim)" }}>{p.confidence}/10</span>
//                     </p>
//                   </div>
//                 ))}
//               <Link href="/history" className="btn-ghost" style={{ display: "block", textAlign: "center", marginTop: "0.75rem" }}>
//                 View full history →
//               </Link>
//             </div>
//           )}
//         </div>

//       </div>

//     </main>
//   </>
// );
