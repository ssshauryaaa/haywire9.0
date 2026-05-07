"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  X, Mail, MapPin, Globe, Send, Terminal,
  ArrowUpRight, Atom, Radio, Cpu, Brain,
} from "lucide-react";



function FooterCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = c.offsetWidth;
    let H = c.height = c.offsetHeight;

    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
      r: 0.6 + Math.random() * 1,
    }));

    let id: number;
    const draw = () => {
      id = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 100) * 0.055})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    };
    draw();

    const onR = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    window.addEventListener("resize", onR);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onR); };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}



function SpinningCube({ size = 22 }: { size?: number }) {
  return (
    <div style={{ perspective: "300px", width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: "100%", height: "100%", position: "relative",
          transformStyle: "preserve-3d",
          animation: "footerSpin 12s infinite linear",
        }}
      >
        {[
          "translateZ(" + size / 2 + "px)",
          "rotateY(180deg) translateZ(" + size / 2 + "px)",
          "rotateY(90deg) translateZ(" + size / 2 + "px)",
          "rotateY(-90deg) translateZ(" + size / 2 + "px)",
          "rotateX(90deg) translateZ(" + size / 2 + "px)",
          "rotateX(-90deg) translateZ(" + size / 2 + "px)",
        ].map((t, i) => (
          <div
            key={i}
            style={{
              position: "absolute", width: "100%", height: "100%",
              border: "1px solid rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.02)",
              transform: t,
            }}
          />
        ))}
      </div>
    </div>
  );
}


function FooterTicker() {
  const items = [
    "QCL-01 · Quantum Lab",
    "NIS-02 · Neural Studio",
    "HAR-03 · Holo Arena",
    "RBY-04 · Robotics Bay",
    "DSO-05 · Observatory",
    "BSL-06 · BioSynth Lab",
    "CGA-07 · CyberGrid",
    "ZGD-08 · Zero-G Studio",
  ].join("   ——   ");

  return (
    <div
      className="overflow-hidden whitespace-nowrap"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="inline-block py-2.5"
        style={{ fontSize: "8px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}
      >
        {`${items}   ——   ${items}   ——   `}
      </motion.div>
    </div>
  );
}


function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <div
        className="font-black"
        style={{ fontSize: "clamp(22px, 3vw, 36px)", letterSpacing: "-0.04em", lineHeight: 1 }}
      >
        {value}
      </div>
      <div className="mt-1 text-[8px] tracking-[0.28em] uppercase" style={{ color: "rgba(255,255,255,0.28)" }}>
        {label}
      </div>
    </motion.div>
  );
}



function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.li whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
      <Link
        href={href}
        className="group flex items-center gap-1 text-sm font-light transition-colors duration-200"
        style={{ color: "rgba(255,255,255,0.38)", textDecoration: "none" }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
      >
        <span>{label}</span>
        <ArrowUpRight
          className="w-2.5 h-2.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
        />
      </Link>
    </motion.li>
  );
}



function SocialBtn({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.4)", color: "#fff" } as any}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
        color: "rgba(255,255,255,0.45)",
        textDecoration: "none", flexShrink: 0,
      }}
    >
      {icon}
    </motion.a>
  );
}


function SubmitBtn() {
  const [sent, setSent] = useState(false);
  const handle = () => { setSent(true); setTimeout(() => setSent(false), 2500); };
  return (
    <motion.button
      onClick={handle}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: sent ? "rgba(255,255,255,0.15)" : "#fff",
        color: sent ? "#fff" : "#000",
        border: sent ? "1px solid rgba(255,255,255,0.2)" : "none",
        padding: "0 14px", borderRadius: "10px",
        cursor: "crosshair", flexShrink: 0,
        display: "flex", alignItems: "center", gap: "6px",
        fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
        fontWeight: 700, height: "100%",
        transition: "background 0.3s, color 0.3s, border 0.3s",
      }}
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.span
            key="sent"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>✓</span> Linked
          </motion.span>
        ) : (
          <motion.span
            key="send"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <Send size={11} /> Transmit
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}


const NAV_COLS = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Facilities", href: "/facilities" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Neural Labs", href: "#" },
      { label: "Simulations", href: "#" },
      { label: "Hardware", href: "#" },
      { label: "Protocols", href: "#" },
    ],
  },
  {
    title: "Systems",
    links: [
      { label: "Access Control", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Status", href: "#" },
      { label: "Network", href: "#" },
    ],
  },
];

const STATS = [
  { value: "40+", label: "World-class labs" },
  { value: "2K+", label: "Student patents" },
  { value: "12", label: "Global campuses" },
  { value: "2040", label: "Est. future" },
];

const LAB_ICONS = [
  { Icon: Atom, code: "QCL" },
  { Icon: Brain, code: "NIS" },
  { Icon: Cpu, code: "RBY" },
  { Icon: Radio, code: "DSO" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const rootRef = useRef<HTMLElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-60px" });

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden"
      style={{
        background: "#000",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        color: "rgba(255,255,255,0.5)",
        zIndex: 10,
      }}
    >
      
      <style>{`
        @keyframes footerSpin {
          0%   { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>

      
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <FooterCanvas />
      </div>

      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Top-edge vignette from page above */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{ zIndex: 1, background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)" }}
      />

      <div className="relative" style={{ zIndex: 2 }}>
        {/* Ticker */}
        <FooterTicker />

        {/* ── STATS BAR ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="py-8 px-6"
              style={{ borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
            >
              <StatCounter value={s.value} label={s.label} />
            </div>
          ))}
        </motion.div>

        
        <div
          className="grid"
          style={{
            gridTemplateColumns: "1fr auto",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          
          <div
            className="p-10 md:p-14 flex flex-col gap-10"
            style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
          >
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
                <SpinningCube size={24} />
                <span
                  className="font-black tracking-tighter"
                  style={{ fontSize: "clamp(18px, 2vw, 26px)", letterSpacing: "-0.04em", color: "#fff" }}
                >
                  SMART SCHOOL
                  <span style={{ color: "rgba(255,255,255,0.2)", WebkitTextStroke: "1px rgba(255,255,255,0.25)", marginLeft: "0.35em" }}>
                    2040
                  </span>
                </span>
              </Link>
              <p
                className="mt-4 text-sm font-light leading-relaxed max-w-xs"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                A modern AI-based school with eight advanced labs, open to everyone, built for future learners.
              </p>
            </motion.div>

            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3"
            >
              <p className="text-[8px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.28)" }}>
                Broadcast channel
              </p>
              <div
                className="flex gap-2"
                style={{ height: "40px" }}
              >
                <input
                  type="email"
                  placeholder="Enter root email..."
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    padding: "0 14px",
                    fontSize: "11px",
                    borderRadius: "10px",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.4)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <SubmitBtn />
              </div>
            </motion.div>

            
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center gap-2 flex-wrap"
            >
              {LAB_ICONS.map(({ Icon, code }) => (
                <div
                  key={code}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
                >
                  <Icon className="w-3 h-3" style={{ color: "rgba(255,255,255,0.45)" }} />
                  <span className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>{code}</span>
                </div>
              ))}
              <div
                className="px-3 py-1.5 rounded-full text-[8px] tracking-widest uppercase"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.25)" }}
              >
                +4 more
              </div>
            </motion.div>
          </div>

          {/* Right block — nav cols + contact */}
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr) auto" }}
          >
            {NAV_COLS.map((col, ci) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.08 * ci, ease: [0.22, 1, 0.36, 1] }}
                className="p-10 md:p-12 flex flex-col gap-6"
                style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[8px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {col.title}
                </p>
                <ul className="flex flex-col gap-4 list-none p-0 m-0">
                  {col.links.map(l => <NavLink key={l.label} {...l} />)}
                </ul>
              </motion.div>
            ))}

            {/* Contact card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="p-10 md:p-12 flex flex-col gap-6"
              style={{ minWidth: "200px" }}
            >
              <p className="text-[8px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                Node Coordinates
              </p>

              <div className="flex flex-col gap-5 text-sm font-light" style={{ color: "rgba(255,255,255,0.4)" }}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.55)" }} />
                  <span style={{ lineHeight: 1.6 }}>Tagore Int.<br />Vasant Vihar</span>
                </div>
                <div className="flex items-center gap-3">
                  <Terminal className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.55)" }} />
                  <span style={{ fontFamily: "monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                    ssh root@2040
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.55)" }} />
                  <span style={{ fontSize: "11px" }}>pyrotech@tagoreint.com</span>
                </div>
              </div>

              {/* Status chip */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl self-start"
                style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
              >
                <span
                  className="rounded-full"
                  style={{ width: 6, height: 6, background: "rgba(255,255,255,0.7)", flexShrink: 0, animation: "pulse 2s infinite" }}
                />
                <span className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                  All systems nominal
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 px-10 md:px-14 py-5"
        >
          {/* Left — copyright */}
          <div className="flex items-center gap-6">
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              © {year} <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>Smart School 2040</span> · End of file.
            </p>
            <div className="hidden md:flex items-center gap-5">
              {["Privacy", "Terms", "Ethics Board"].map(l => (
                <Link
                  key={l}
                  href="#"
                  className="text-[9px] tracking-widest uppercase transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.22)", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Right — socials */}
          <div className="flex items-center gap-2">
            <SocialBtn href="#" label="X / Twitter" icon={<X size={14} />} />
            <SocialBtn href="#" label="GitHub" icon={<GithubIcon />} />
            <SocialBtn href="#" label="LinkedIn" icon={<LinkedinIcon />} />
            <SocialBtn href="#" label="Website" icon={<Globe size={14} />} />
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}