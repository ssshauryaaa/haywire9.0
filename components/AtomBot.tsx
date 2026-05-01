"use client";
import { useEffect, useRef } from "react";

export default function AtomBot() {
  return (
    <div style={{
      position: "relative", width: "380px", height: "380px",
      display: "flex", alignItems: "center", justifyContent: "center",
      perspective: "800px",
    }}
      className="animate-float"
    >
      {/* Glow bg */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle, rgba(102,252,241,0.07) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />

      {/* Ring 1 — horizontal */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: "260px", height: "90px",
        marginLeft: "-130px", marginTop: "-45px",
        border: "2px solid rgba(102,252,241,0.55)",
        borderRadius: "50%",
        boxShadow: "0 0 18px rgba(102,252,241,0.3), inset 0 0 8px rgba(102,252,241,0.1)",
        animation: "spinRing1 9s linear infinite",
      }} />

      {/* Ring 2 — tilted */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: "260px", height: "90px",
        marginLeft: "-130px", marginTop: "-45px",
        border: "2px solid rgba(184,41,234,0.55)",
        borderRadius: "50%",
        boxShadow: "0 0 18px rgba(184,41,234,0.3)",
        transform: "rotateX(60deg) rotateY(20deg)",
        animation: "spinRing2 12s linear infinite",
      }} />

      {/* Ring 3 — angled */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: "220px", height: "75px",
        marginLeft: "-110px", marginTop: "-37.5px",
        border: "1.5px solid rgba(102,252,241,0.35)",
        borderRadius: "50%",
        boxShadow: "0 0 12px rgba(102,252,241,0.2)",
        transform: "rotateX(30deg) rotateZ(55deg)",
        animation: "spinRing3 16s linear infinite reverse",
      }} />

      {/* Core sphere */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "110px", height: "110px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 38% 33%, #1a2540, #080c18)",
        border: "2px solid rgba(102,252,241,0.5)",
        boxShadow: "0 0 40px rgba(102,252,241,0.2), 0 0 80px rgba(102,252,241,0.08), inset 0 0 30px rgba(102,252,241,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
        gap: "6px",
      }}>
        {/* Eyes */}
        <div style={{ display: "flex", gap: "12px" }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              width: "14px", height: "14px", borderRadius: "50%",
              background: "var(--cyan)",
              boxShadow: "0 0 10px var(--cyan), 0 0 20px rgba(102,252,241,0.5)",
              animation: "pulseGlow 2.5s ease-in-out infinite",
              animationDelay: `${i * 0.3}s`,
            }} />
          ))}
        </div>
        {/* Mouth / signal bar */}
        <div style={{ display: "flex", gap: "3px", alignItems: "flex-end" }}>
          {[8, 14, 10, 16, 9].map((h, i) => (
            <div key={i} style={{
              width: "4px", height: `${h}px`, borderRadius: "2px",
              background: "var(--cyan)", opacity: 0.7 + i * 0.05,
              boxShadow: "0 0 6px var(--cyan)",
            }} />
          ))}
        </div>
      </div>

      {/* Electrons */}
      <div style={{ position: "absolute", top: "14%", left: "50%", width: "14px", height: "14px", marginLeft: "-7px",
        borderRadius: "50%", background: "var(--cyan)",
        boxShadow: "0 0 16px var(--cyan), 0 0 32px rgba(102,252,241,0.4)",
      }} />
      <div style={{ position: "absolute", top: "48%", left: "6%", width: "12px", height: "12px", marginTop: "-6px",
        borderRadius: "50%", background: "var(--purple)",
        boxShadow: "0 0 14px var(--purple), 0 0 28px rgba(184,41,234,0.4)",
      }} />
      <div style={{ position: "absolute", bottom: "12%", right: "16%", width: "10px", height: "10px",
        borderRadius: "50%", background: "var(--cyan)", opacity: 0.85,
        boxShadow: "0 0 12px var(--cyan)",
      }} />
    </div>
  );
}
