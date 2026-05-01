"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

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
    <motion.div className="pointer-events-none fixed inset-0 z-0">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#0A0A0A",
        overflow: "hidden",
      }}
    >
      {/* ── BACKGROUND LAYERS (BLACK & WHITE / GRAYSCALE) ── */}
      <MouseGlow />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.25,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: "radial-gradient(ellipse at center, transparent 20%, #0A0A0A 90%)",
        }}
      />

      {/* ── SPLINE 3D MODEL — shifted left ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
          transform: "translate(-12%, 5%)",
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
            margin: "auto",
          }}
          title="Smart School 2040 Spline Interaction"
        />
      </div>

      {/* ── TEXT OVERLAY — right side, pure grayscale elegance ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "28%",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 2rem",
          pointerEvents: "none",
          transform: "translateY(-5%)",
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              fontFamily: "var(--font-orbitron), monospace",
              border: "0.5px solid rgba(255,255,255,0.15)",
              padding: "0.3rem 0.9rem",
              borderRadius: "999px",
            }}
          >
            Est. 2040
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#FFFFFF",
            marginBottom: "0.4rem",
            fontFamily: "var(--font-syne), sans-serif",
            letterSpacing: "-0.03em",
          }}
        >
          Smart School
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#FFFFFF",
            marginBottom: "0.75rem",
            fontFamily: "var(--font-syne), sans-serif",
            letterSpacing: "-0.03em",
          }}
        >
          2040
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.45)",
            fontStyle: "italic",
            marginBottom: "1.75rem",
            letterSpacing: "0.01em",
          }}
        >
          Where Learning Meets the Future
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
          style={{
            height: "0.5px",
            background: "rgba(255,255,255,0.15)",
            width: "80%",
            marginBottom: "1.75rem",
            transformOrigin: "left",
          }}
        />

        {/* Body text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          style={{
            fontSize: "0.88rem",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "28ch",
          }}
        >
          Imagine a school where technology transforms every classroom into an interactive,
          intelligent, and immersive learning space.
        </motion.p>
      </div>
    </section>
  );
}