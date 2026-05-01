"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const pillars = [
  {
    icon: "🧠",
    title: "AI-Driven Personalisation",
    desc: "Adaptive algorithms map each student's strengths, weaknesses, and pace — delivering a truly unique curriculum.",
    color: "#66FCF1",
    glow: "rgba(102,252,241,0.12)",
  },
  {
    icon: "🤖",
    title: "Robotics Integration",
    desc: "Hands-on robotics labs from Grade 1. Every student programs, builds, and deploys real robots.",
    color: "#B829EA",
    glow: "rgba(184,41,234,0.12)",
  },
  {
    icon: "🌐",
    title: "Global Classrooms",
    desc: "Live collaboration with 200+ partner schools across 40 countries via immersive virtual exchange.",
    color: "#66FCF1",
    glow: "rgba(102,252,241,0.12)",
  },
  {
    icon: "🔬",
    title: "Research-First Culture",
    desc: "Student research projects are published and presented at national science fairs from age 12.",
    color: "#B829EA",
    glow: "rgba(184,41,234,0.12)",
  },
];

const stats = [
  { num: 2040, label: "Est. Year", suffix: "" },
  { num: 12, label: "Students", suffix: "K+" },
  { num: 300, label: "Faculty & AI Tutors", suffix: "+" },
  { num: 98, label: "Graduate Success", suffix: "%" },
];

function useCounter(target: number, inView: boolean, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function StatCard({ num, label, suffix, index, inView }: {
  num: number; label: string; suffix: string; index: number; inView: boolean;
}) {
  const count = useCounter(num, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.03 }}
      style={{
        background: "rgba(15,18,32,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(102,252,241,0.1)",
        borderRadius: "12px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTop: "2px solid rgba(102,252,241,0.6)", borderLeft: "2px solid rgba(102,252,241,0.6)", borderRadius: "4px 0 0 0" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: "2px solid rgba(102,252,241,0.2)", borderRight: "2px solid rgba(102,252,241,0.2)", borderRadius: "0 0 4px 0" }} />
      <div style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "1.875rem", fontWeight: 900, color: "#66FCF1", textShadow: "0 0 20px rgba(102,252,241,0.4)" }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(168,178,193,0.7)", marginTop: "8px" }}>
        {label}
      </div>
    </motion.div>
  );
}

function PillarCard({ p, index, inView }: { p: typeof pillars[0]; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <motion.div
        animate={{
          borderColor: hovered
            ? p.color === "#66FCF1" ? "rgba(102,252,241,0.45)" : "rgba(184,41,234,0.45)"
            : "rgba(255,255,255,0.05)",
          background: hovered ? p.glow : "rgba(15,18,32,0.7)",
        }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex", gap: "20px", alignItems: "flex-start",
          padding: "24px", borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.05)",
          cursor: "default", position: "relative", overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            background: p.color, boxShadow: `0 0 12px ${p.color}`,
            position: "absolute", left: 0, top: 0, bottom: 0, width: 3, transformOrigin: "top",
          }}
        />
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="shimmer"
              initial={{ x: "-100%" }} animate={{ x: "250%" }} exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: `linear-gradient(105deg, transparent 35%, ${p.color}18 50%, transparent 65%)`,
              }}
            />
          )}
        </AnimatePresence>
        <motion.div
          animate={{
            borderColor: hovered
              ? p.color === "#66FCF1" ? "rgba(102,252,241,0.45)" : "rgba(184,41,234,0.45)"
              : "rgba(255,255,255,0.06)",
            boxShadow: hovered ? `0 0 18px ${p.glow}` : "none",
          }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: "1.875rem", width: 56, height: 56, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)",
            background: "#060810",
          }}
        >
          {p.icon}
        </motion.div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <motion.h3
            animate={{ color: hovered ? p.color : "#F0F4FF" }}
            transition={{ duration: 0.25 }}
            style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.88rem", fontWeight: 700, lineHeight: 1.4, marginBottom: "8px" }}
          >
            {p.title}
          </motion.h3>
          <p style={{ fontSize: "0.875rem", color: "rgba(168,178,193,0.8)", lineHeight: 1.65, margin: 0 }}>
            {p.desc}
          </p>
        </div>
        <motion.span
          animate={{ x: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: p.color, alignSelf: "center", fontSize: "1rem", flexShrink: 0 }}
        >
          →
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        // overflowX: "hidden",
        paddingTop: "112px",
        paddingBottom: "112px",
        background: "#0F1220",
      }}
    >
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(102,252,241,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(102,252,241,0.025) 1px, transparent 1px)",
        backgroundSize: "52px 52px",
      }} />

      {/* Glow blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.1, 0.06] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: -128, left: -80, width: 560, height: 560, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(102,252,241,0.12) 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{ position: "absolute", bottom: -96, right: -64, width: 480, height: 480, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(184,41,234,0.1) 0%, transparent 70%)" }}
      />

      {/* Particles */}
      {[
        { x: "7%", y: "18%", d: 0, s: 4 }, { x: "14%", y: "72%", d: 1.3, s: 3 },
        { x: "89%", y: "12%", d: 0.7, s: 5 }, { x: "93%", y: "58%", d: 2.1, s: 3 },
        { x: "52%", y: "88%", d: 1.6, s: 4 }, { x: "76%", y: "38%", d: 0.4, s: 3 },
      ].map((p, i) => (
        <motion.div key={i}
          style={{ position: "absolute", left: p.x, top: p.y, width: p.s, height: p.s, borderRadius: "50%", background: "#66FCF1", pointerEvents: "none" }}
          animate={{ y: [0, -28, 0], opacity: [0.08, 0.45, 0.08], scale: [1, 1.5, 1] }}
          transition={{ duration: 4 + p.d, repeat: Infinity, delay: p.d, ease: "easeInOut" }}
        />
      ))}

      {/* SVG circuit */}
      <svg viewBox="0 0 160 380" style={{ position: "absolute", right: 0, top: "8%", height: "82%", opacity: 0.08, pointerEvents: "none" }}>
        <motion.path d="M80 0 Q 118 48 80 95 Q 42 142 80 190 Q 118 238 80 285 Q 42 332 80 380"
          stroke="#66FCF1" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        {[48, 95, 142, 190, 238, 285].map((y, i) => (
          <motion.circle key={i} cx={i % 2 === 0 ? 108 : 52} cy={y} r="4" fill="#66FCF1"
            initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 0.8 } : {}}
            transition={{ delay: 0.4 + i * 0.25, duration: 0.35 }}
          />
        ))}
      </svg>

      {/* Top line */}
      <motion.div
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "absolute", top: 0, left: 64, right: 64, height: 1, transformOrigin: "left", background: "linear-gradient(90deg, transparent, #66FCF1, transparent)" }}
      />

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        /* clamp: min 24px, scales with viewport, max 96px */
        paddingLeft: "clamp(24px, 6vw, 96px)",
        paddingRight: "clamp(24px, 6vw, 96px)",
      }}>
        <div
          className="about-grid"
          style={{ maxWidth: "1280px", margin: "0 auto" }}
        >
          {/* Left column */}
          <div style={{ minWidth: 0 }}>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55 }}
              style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#66FCF1", marginBottom: "20px" }}
            >
              ◈ About Us
            </motion.p>

            <div style={{ overflow: "hidden", marginBottom: "20px" }}>
              <motion.h2
                initial={{ y: "110%" }} animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.15, color: "#F0F4FF", margin: 0 }}
              >
                Reimagining Education
                <br />
                <motion.span
                  animate={{ color: ["#66FCF1", "#a78bfa", "#66FCF1"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  for the Next Century
                </motion.span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ width: 0 }} animate={inView ? { width: "56px" } : {}}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: 2, background: "#66FCF1", borderRadius: 2, boxShadow: "0 0 10px rgba(102,252,241,0.5)", marginBottom: "32px" }}
            />

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.65 }}
              style={{ marginBottom: "32px" }}
            >
              <p style={{ color: "rgba(168,178,193,0.85)", lineHeight: 1.75, fontSize: "0.97rem", marginBottom: "20px" }}>
                Smart School 2040 was founded on a single conviction: the classroom of tomorrow must be built today.
                We exist at the intersection of pedagogy, technology, and human potential.
              </p>
              <p style={{ color: "rgba(168,178,193,0.85)", lineHeight: 1.75, fontSize: "0.97rem", margin: 0 }}>
                Our campus runs on a hybrid intelligence model — human teachers collaborate with AI co-tutors to deliver
                lessons that are personalised, project-based, and globally connected. No two students follow the same path.
              </p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} inView={inView} />)}
            </div>

            <motion.div
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1, duration: 0.6 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-orbitron), monospace", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(102,252,241,0.4)" }}
            >
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>●</motion.span>
              System Online — Academic Year 2040
            </motion.div>
          </div>

          {/* Right column */}
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "18px" }}>
            {pillars.map((p, i) => <PillarCard key={i} p={p} index={i} inView={inView} />)}
          </div>
        </div>
      </div>

      {/* Scoped responsive styles — no Tailwind needed */}
      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 64px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr 1fr;
            gap: 96px;
          }
        }
      `}</style>
    </section>
  );
}