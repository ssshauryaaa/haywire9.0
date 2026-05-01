"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
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

// Animated counter component with spring
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

  return (
    <span className="text-5xl md:text-6xl font-black tracking-tighter text-white">
      {count}{suffix}
    </span>
  );
}

// Stat card with hover 3d effect
function StatCard({ stat, active, index }: { stat: typeof stats[0]; active: boolean; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:border-white/30 hover:bg-white/[0.05] shadow-xl"
    >
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"
        style={{ boxShadow: "0 0 30px rgba(255,255,255,0.05)" }} />
      <div className="relative z-10">
        <div className="mb-4 text-white/30 group-hover:text-white/50 transition-colors">
          <stat.icon className="w-8 h-8" />
        </div>
        <div className="font-mono font-bold tracking-tighter text-white">
          <AnimatedCounter target={stat.num} suffix={stat.suffix} active={active} />
        </div>
        <div className="mt-3 text-[11px] tracking-[0.2em] uppercase text-white/40 group-hover:text-white/60 transition-colors">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

// Pillar card with staggered entrance and hover effects
function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const Icon = pillar.icon;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, x: 8 }}
      className="group relative bg-white/[0.01] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6 transition-all duration-500 hover:border-white/30 hover:bg-white/[0.04] cursor-pointer"
    >
      {/* Glowing line on hover */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-white/40 transition-all duration-500 group-hover:w-full" />

      <motion.div
        whileHover={{ rotate: 5, scale: 1.1 }}
        className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex-shrink-0 flex items-center justify-center border border-white/10 bg-white/[0.02] text-white/50 group-hover:text-white group-hover:border-white/30 transition-all duration-300"
      >
        <Icon className="w-7 h-7 md:w-8 md:h-8" />
      </motion.div>

      <div className="flex-1">
        <h3 className="text-base md:text-lg font-bold uppercase tracking-wider text-white/80 group-hover:text-white transition-colors mb-3 font-mono">
          {pillar.title}
        </h3>
        <p className="text-sm md:text-base leading-relaxed text-white/40 group-hover:text-white/60 transition-colors">
          {pillar.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [countersActive, setCountersActive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

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

  // Text animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0A0A0A] text-white overflow-hidden"
      style={{
        paddingTop: "clamp(100px, 12vw, 160px)",
        paddingBottom: "clamp(80px, 10vw, 140px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
      }}
    >
      {/* Animated background gradient orbs */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-white/5 blur-[150px] rounded-full pointer-events-none"
      />
      <motion.div
        style={{ y: backgroundY }}
        className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/5 blur-[150px] rounded-full pointer-events-none"
      />

      {/* Grid pattern with parallax */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated lines */}
      <div className="absolute left-0 top-1/4 w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      <div className="absolute right-0 bottom-1/4 w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-20 md:mb-28"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-3 border border-white/10 bg-white/[0.02] rounded-full px-4 py-2 mb-6 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-medium">The Future of Education</span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            <span className="text-white">Redefining</span>
            <br />
            <span className="text-white/20">Learning Experience</span>
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="w-24 h-[1px] bg-white/20 mx-auto mt-12"
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-28"
        >
          {stats.map((stat, idx) => (
            <StatCard key={stat.label} stat={stat} active={countersActive} index={idx} />
          ))}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Quote / Vision */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-8"
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 text-8xl font-serif text-white/5">“</div>
              <p className="text-xl md:text-2xl leading-relaxed text-white/70 italic font-light relative z-10">
                Smart School 2040 runs on a hybrid intelligence model — human teachers collaborate with AI tutors to deliver lessons that are personalised and project-based.
              </p>
            </div>

            <div className="flex gap-5 flex-wrap pt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-black text-xs tracking-[0.2em] uppercase font-bold rounded-full hover:bg-gray-200 transition-all shadow-xl"
                style={{ fontFamily: "var(--font-orbitron), monospace" }}
              >
                Explore Campus →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-white/10 text-white/50 text-xs tracking-[0.2em] uppercase rounded-full hover:border-white/30 hover:text-white transition-all"
                style={{ fontFamily: "var(--font-orbitron), monospace" }}
              >
                Our Curriculum
              </motion.button>
            </div>

            {/* Evaluation Framework - redesigned as floating badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative overflow-hidden border border-white/10 rounded-2xl p-6 md:p-8 bg-white/[0.01] backdrop-blur-sm mt-8"
            >
              <p className="mb-6 text-[10px] tracking-[0.25em] uppercase text-white/40 font-bold">Evaluation Framework</p>
              <div className="flex flex-wrap gap-3">
                {["Originality", "Utility", "Aesthetics", "Technical"].map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-xs font-mono tracking-wide"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Core Pillars */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-8 bg-white/40" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-bold">Core Pillars</span>
            </motion.div>

            <div className="space-y-5">
              {pillars.map((pillar, idx) => (
                <PillarCard key={pillar.title} pillar={pillar} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}