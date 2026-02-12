import { useState, useEffect, useRef } from "react";

const FACES = ["Government", "Donor", "Senior Management", "Situation & Context"];
const COLORS = ["#ef4444", "#3b82f6", "#a855f7", "#f59e0b"];
const EMOJIS = ["🏛️", "🤝", "👔", "🌍"];

function Dot({ x, y }) {
  return <circle cx={x} cy={y} r={8} fill="white" />;
}

function DiceFace({ value }) {
  const dots = {
    1: [[50,50]],
    2: [[25,25],[75,75]],
    3: [[25,25],[50,50],[75,75]],
    4: [[25,25],[75,25],[25,75],[75,75]],
    5: [[25,25],[75,25],[50,50],[25,75],[75,75]],
    6: [[25,25],[75,25],[25,50],[75,50],[25,75],[75,75]],
  };
  const d = dots[value] || dots[1];
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {d.map(([x,y], i) => <Dot key={i} x={x} y={y} />)}
    </svg>
  );
}

export default function App() {
  const [rollIndex, setRollIndex] = useState(-1);
  const [isRolling, setIsRolling] = useState(false);
  const [displayFace, setDisplayFace] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  const roll = () => {
    if (isRolling) return;
    const next = rollIndex + 1;
    if (next >= FACES.length) return;

    setIsRolling(true);
    setShowResult(false);

    let tick = 0;
    const maxTicks = 18;
    intervalRef.current = setInterval(() => {
      tick++;
      setDisplayFace(Math.floor(Math.random() * 6) + 1);
      if (tick >= maxTicks) {
        clearInterval(intervalRef.current);
        setDisplayFace(next + 1);
        setRollIndex(next);
        setShowResult(true);
        setIsRolling(false);
        setHistory(h => [...h, FACES[next]]);
      }
    }, 80 + tick * 4);
  };

  const reset = () => {
    setRollIndex(-1);
    setIsRolling(false);
    setDisplayFace(1);
    setShowResult(false);
    setHistory([]);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const allDone = rollIndex >= FACES.length - 1 && !isRolling;
  const currentColor = rollIndex >= 0 ? COLORS[rollIndex] : "#64748b";

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: 24,
      gap: 24,
    }}>
      <h1 style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
        🎲 Strategic Pillars Dice
      </h1>
      <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
        Roll {rollIndex + 2 > FACES.length ? "" : `${rollIndex + 2} of ${FACES.length}`}
        {allDone ? " — All pillars revealed!" : ""}
      </p>

      {/* Dice */}
      <div style={{
        width: 160, height: 160,
        background: isRolling
          ? "linear-gradient(145deg, #334155, #475569)"
          : showResult
            ? `linear-gradient(145deg, ${currentColor}dd, ${currentColor})`
            : "linear-gradient(145deg, #334155, #475569)",
        borderRadius: 24,
        boxShadow: isRolling
          ? "0 0 40px rgba(255,255,255,0.15)"
          : showResult
            ? `0 8px 40px ${currentColor}44`
            : "0 8px 30px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s",
        animation: isRolling ? "shake 0.12s infinite alternate" : "none",
        position: "relative",
      }}>
        <style>{`
          @keyframes shake {
            0% { transform: rotate(-8deg) scale(1.05); }
            50% { transform: rotate(8deg) scale(0.95); }
            100% { transform: rotate(-5deg) scale(1.02); }
          }
          @keyframes pop {
            0% { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.15); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeUp {
            0% { transform: translateY(10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}</style>
        <div style={{ width: "65%", height: "65%" }}>
          <DiceFace value={displayFace} />
        </div>
      </div>

      {/* Result text */}
      <div style={{ minHeight: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {showResult && (
          <div style={{ animation: "pop 0.4s ease-out", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 4 }}>{EMOJIS[rollIndex]}</div>
            <div style={{
              color: currentColor,
              fontSize: 26,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              {FACES[rollIndex]}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        {!allDone ? (
          <button
            onClick={roll}
            disabled={isRolling}
            style={{
              padding: "14px 40px",
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 12,
              border: "none",
              cursor: isRolling ? "wait" : "pointer",
              background: isRolling ? "#475569" : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "white",
              boxShadow: isRolling ? "none" : "0 4px 20px rgba(59,130,246,0.4)",
              transition: "all 0.2s",
              letterSpacing: 0.5,
            }}
          >
            {isRolling ? "Rolling..." : rollIndex === -1 ? "🎲  Roll the Dice" : "🎲  Roll Again"}
          </button>
        ) : (
          <button
            onClick={reset}
            style={{
              padding: "14px 40px",
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
              letterSpacing: 0.5,
            }}
          >
            🔄  Start Over
          </button>
        )}
      </div>

      {/* History trail */}
      {history.length > 0 && (
        <div style={{
          display: "flex",
          gap: 12,
          marginTop: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {history.map((h, i) => (
            <div key={i} style={{
              animation: "fadeUp 0.3s ease-out",
              padding: "8px 16px",
              borderRadius: 10,
              background: `${COLORS[i]}22`,
              border: `1px solid ${COLORS[i]}44`,
              color: COLORS[i],
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <span>{EMOJIS[i]}</span>
              <span>Roll {i + 1}: {h}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
