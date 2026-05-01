"use client";
import { useState } from "react";

const features = [
  {
    id: "ai",
    icon: "🧠",
    title: "AI Tutor Network",
    short: "Personalised learning at scale",
    full: "Every student is assigned a personal AI Tutor that learns alongside them. It tracks mastery, recommends resources, and answers questions 24/7.",
    tag: "Core Feature",
    color: "cyan",
  },
  {
    id: "vr",
    icon: "🥽",
    title: "Holographic VR Labs",
    short: "Immersive science & history experiences",
    full: "Forty fully-equipped VR labs allow students to explore space, re-enact historical events, and run chemical experiments without leaving campus.",
    tag: "Immersive Tech",
    color: "purple",
  },
  {
    id: "robotics",
    icon: "🤖",
    title: "Robotics & Maker Space",
    short: "From idea to physical prototype",
    full: "State-of-the-art maker spaces equipped with 3D printers, laser cutters, and industrial-grade robotics arms. Students build real projects from Grade 3.",
    tag: "STEM",
    color: "cyan",
  },
  {
    id: "biometric",
    icon: "💡",
    title: "Biometric Wellness",
    short: "Student wellbeing as a priority",
    full: "Wearable devices detect stress and fatigue. The system adapts lesson pace in real time and flags students for counsellor check-ins proactively.",
    tag: "Wellness",
    color: "purple",
  },
  {
    id: "collab",
    icon: "🌐",
    title: "Global Collaboration",
    short: "Co-create with students worldwide",
    full: "Our platform connects classes with 200+ international schools. Joint projects and cultural exchanges happen across time zones every week.",
    tag: "Global",
    color: "cyan",
  },
  {
    id: "data",
    icon: "📊",
    title: "Predictive Analytics",
    short: "Data-driven decisions for educators",
    full: "Teachers access dashboards showing class-wide trends, dropout risk flags, and curriculum effectiveness scores. All data is GDPR-compliant.",
    tag: "Admin Tools",
    color: "purple",
  },
  {
    id: "energy",
    icon: "☀️",
    title: "Net-Zero Smart Campus",
    short: "Sustainable by design",
    full: "The campus runs entirely on solar and wind energy with AI-managed climate control and rainwater harvesting systems.",
    tag: "Sustainability",
    color: "cyan",
  },
  {
    id: "security",
    icon: "🔒",
    title: "AI Safety & Security",
    short: "Safe, monitored, and inclusive",
    full: "Facial recognition entry and AI-moderated online spaces ensure every student feels physically and digitally safe at all times.",
    tag: "Safety",
    color: "purple",
  },
];

export default function Features() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="features" className="py-24 px-6 lg:px-16 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-16 right-16 h-px bg-gradient-to-r from-transparent via-purple to-transparent opacity-20" />

      <div className="max-w-7xl mx-auto text-center mb-16 space-y-4">
        <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-cyan">
          ◈ Campus Facilities
        </p>
        <h2 className="font-heading text-4xl lg:text-5xl font-bold leading-tight">
          Facilities & Features
        </h2>
        <div className="w-16 h-1 bg-cyan rounded-full mx-auto" />
        <p className="text-text/70 max-w-xl mx-auto text-lg leading-relaxed">
          Eight flagship facilities that make Smart School 2040 unlike anything that came before. Click any card to learn more.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => {
          const isActive = active === f.id;
          const accentColor = f.color === 'cyan' ? 'cyan' : 'purple';
          
          return (
            <div 
              key={f.id} 
              onClick={() => setActive(isActive ? null : f.id)}
              className={`glass-card p-6 cursor-pointer relative overflow-hidden transition-all duration-300 ${isActive ? `border-${accentColor}/50 bg-${accentColor}/5 scale-[1.02] z-20` : 'hover:border-cyan/30'}`}
            >
              {/* Top Accent Line */}
              {isActive && <div className={`absolute top-0 left-0 right-0 h-1 bg-${accentColor} shadow-[0_0_10px_rgba(102,252,241,0.5)]`} />}

              <div className="flex justify-between items-start mb-6">
                <div className={`text-3xl w-12 h-12 flex items-center justify-center rounded-lg bg-darker border border-white/5`}>
                  {f.icon}
                </div>
                <span className={`font-mono text-[0.55rem] tracking-wider uppercase px-2 py-1 border rounded border-${accentColor}/40 text-${accentColor}`}>
                  {f.tag}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                  {f.title}
                </h3>
                <p className="text-xs text-text/60 leading-relaxed min-h-[3rem]">
                  {isActive ? f.full : f.short}
                </p>
              </div>

              <div className={`mt-6 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[0.6rem] tracking-widest uppercase text-${accentColor}`}>
                <span>{isActive ? "Collapse" : "Details"}</span>
                <span className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>▼</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
