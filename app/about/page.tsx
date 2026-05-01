"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Hexagon, Cog, Globe, Microscope, TrendingUp, Award, Users, Zap } from "lucide-react";

const stats = [
  { num: 2040, suffix: "", label: "Est. Year", icon: Award },
  { num: 12, suffix: "K+", label: "Students", icon: Users },
  { num: 300, suffix: "+", label: "Faculty & AI", icon: Zap },
  { num: 98, suffix: "%", label: "Grad Success", icon: TrendingUp },
];

const pillars = [
  {
    title: "AI-Driven Personalisation",
    desc: "Adaptive learning paths tailored to each student's pace, strengths, and goals.",
    icon: Hexagon,
  },
  {
    title: "Robotics Integration",
    desc: "Hands-on engineering labs where students build and program real-world systems.",
    icon: Cog,
  },
  {
    title: "Global Classrooms",
    desc: "Live sessions with peers and mentors from 60+ countries across every time zone.",
    icon: Globe,
  },
  {
    title: "Research-First Culture",
    desc: "Every student ships a publishable project before graduation.",
    icon: Microscope,
  },
];

function AnimatedCounter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, active]);
  return <>{count}{suffix}</>;
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [countersActive, setCountersActive] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCountersActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        background: "#0A0A0A",
        color: "white",
        overflow: "hidden",
        padding: "clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)",
      }}
    >
      {/* Animated background orbs */}
      <motion.div style={{ y: bgY, position: "absolute", top: "-20%", left: "-20%", width: "60%", height: "60%", background: "rgba(255,255,255,0.05)", filter: "blur(150px)", borderRadius: "50%", pointerEvents: "none" }} />
      <motion.div style={{ y: bgY, position: "absolute", bottom: "-20%", right: "-20%", width: "60%", height: "60%", background: "rgba(255,255,255,0.05)", filter: "blur(150px)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Grid pattern */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.2, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", borderRadius: "999px", padding: "0.5rem 1rem", marginBottom: "1.5rem" }}>
            <span style={{ width: "0.5rem", height: "0.5rem", background: "white", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "0.625rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>About Us</span>
          </div>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: "bold", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            <span style={{ color: "white" }}>Redefining</span><br />
            <span style={{ color: "rgba(255,255,255,0.2)" }}>Learning Experience</span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "7rem" }}>
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.3)" }}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", padding: "1.5rem", textAlign: "center", transition: "all 0.3s" }}
            >
              <stat.icon style={{ width: "2rem", height: "2rem", margin: "0 auto 0.75rem", opacity: 0.4 }} />
              <div style={{ fontSize: "2.25rem", fontWeight: 900, letterSpacing: "-0.02em", color: "white" }}>
                <AnimatedCounter target={stat.num} suffix={stat.suffix} active={countersActive} />
              </div>
              <div style={{ fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem" }}>
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: "-1.5rem", left: "-1.5rem", fontSize: "5rem", color: "rgba(255,255,255,0.05)" }}>“</div>
              <p style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)", lineHeight: 1.5, color: "rgba(255,255,255,0.7)", fontStyle: "italic", position: "relative", zIndex: 1 }}>
                Smart School 2040 runs on a hybrid intelligence model — human teachers collaborate with AI tutors to deliver personalised, project-based lessons.
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
              <button style={{ padding: "0.75rem 2rem", background: "white", color: "black", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", borderRadius: "999px", border: "none", cursor: "pointer", transition: "0.3s" }}>Explore Campus →</button>
              <button style={{ padding: "0.75rem 2rem", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", borderRadius: "999px", cursor: "pointer", transition: "0.3s" }}>Our Curriculum</button>
            </div>

            <div style={{ marginTop: "3rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", padding: "1.5rem", background: "rgba(255,255,255,0.01)" }}>
              <p style={{ fontSize: "0.625rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>Evaluation Framework</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["Originality", "Utility", "Aesthetics", "Technical"].map((item) => (
                  <span key={item} style={{ padding: "0.25rem 1rem", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontFamily: "monospace" }}>{item}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <span style={{ height: "1px", width: "2rem", background: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: "0.625rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Core Pillars</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 8, borderColor: "rgba(255,255,255,0.3)" }}
                    style={{ display: "flex", gap: "1.25rem", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.01)", transition: "all 0.3s" }}
                  >
                    <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", transition: "0.3s" }}>
                      <Icon style={{ width: "1.5rem", height: "1.5rem" }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "0.875rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.8)", marginBottom: "0.5rem" }}>{pillar.title}</h3>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{pillar.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Keyframe animation for pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}