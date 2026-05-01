"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Spline from "@splinetool/react-spline";

const words = ["AI-Powered", "Immersive", "Intelligent", "Future-Ready"];

const stats = [
  { num: "500+", label: "AI Modules" },
  { num: "40+", label: "VR Labs" },
  { num: "98%", label: "Pass Rate" },
  { num: "2040", label: "Vision" },
];

function MouseGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(600px circle at var(--mx) var(--my), rgba(102,252,241,0.04), transparent 60%)",
      }}
    >
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(102,252,241,0.06) 0%, transparent 65%)",
        }}
      />
    </motion.div>
  );
}

function GlassStatCard({ num, label, index }: { num: string; label: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group cursor-default pointer-events-auto"
    >
      <motion.div
        animate={{
          background: hovered ? "rgba(102,252,241,0.07)" : "rgba(6,8,16,0.6)",
          borderColor: hovered ? "rgba(102,252,241,0.35)" : "rgba(255,255,255,0.07)",
        }}
        transition={{ duration: 0.3 }}
        className="px-6 py-4 rounded-xl border backdrop-blur-md relative overflow-hidden text-center min-w-[120px]"
      >
        {/* Glass shine */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? "200%" : "-100%" }}
          transition={{ duration: 0.55 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(102,252,241,0.08) 50%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ color: hovered ? "#66FCF1" : "#66FCF1" }}
          className="font-mono text-2xl font-black text-cyan"
          style={{ textShadow: hovered ? "0 0 20px rgba(102,252,241,0.5)" : "none" }}
        >
          {num}
        </motion.div>
        <div className="text-[0.65rem] uppercase tracking-widest text-white/50 mt-1">
          {label}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx((i) => (i + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#060810",
        overflow: "hidden",
      }}
    >
      {/* ── BACKGROUND LAYERS ── */}
      <MouseGlow />
      <div
        className="absolute inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(102,252,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(102,252,241,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 20%, #060810 90%)",
        }}
      />

      {/* ── SPLINE — full section, centered ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",

        }}
      >
        <iframe
          src="https://my.spline.design/hanastarterfile-WE78OsCR6rUGkiUggYdsOkoW-jD9/"
          frameBorder="0"
          allow="autoplay; fullscreen; vr"
          style={{
            width: "80%",
            height: "80%",
            border: "none",
            display: "block",
          }}
          title="Smart School 2040 Spline Interaction"
        />
      </div>
    </section>
  );
}