/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import {
  Brain, Cpu, Globe, Zap, Users, BookOpen, Layers, Radio,
  ChevronRight, ArrowRight, Plus, Minus, Sparkles, Eye,
  MessageSquare, Wifi, BarChart3, Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";



// ─── DATA ─────────────────────────────────────────────────────────────────────

const steps = [
  {
    id: "enroll",
    number: "01",
    phase: "Enrollment",
    title: "Welcome. The System Adapts to You.",
    subtitle: "Day one smart assessment",
    description:
      "On your first day, we don't just give you a schedule. Instead, a 48-hour smart assessment learns how you think, learn, and create. It doesn't grade you; it guides you.",
    detail:
      "The system looks at how you respond to different tasks, what makes you curious, and when you focus best. It uses this information to build a learning plan just for you. Every student enters the same door, but follows their own unique path.",
    icon: Brain,
    visual: "neural-net",
    tags: ["AI Profiling", "No Grades", "48h Setup"],
    stat: { value: "48h", label: "to build your plan" },
  },
  {
    id: "learn",
    number: "02",
    phase: "Learning",
    title: "Classrooms That Think With You.",
    subtitle: "Smart, interactive spaces",
    description:
      "Every desk and wall is an interactive screen. The room itself changes its lighting, sound, and temperature to match what helps you focus best. Learning happens with the room, not just inside it.",
    detail:
      "Smart sensors quietly check how well you are concentrating. If you start to lose focus, the room adjusts by changing the activity, adding a fun challenge, or giving you a short break. This helps you stay engaged for much longer.",
    icon: Layers,
    visual: "grid-pulse",
    tags: ["Smart Rooms", "Health Sensors", "Deep Focus AI"],
    stat: { value: "3.4×", label: "better memory" },
  },
  {
    id: "build",
    number: "03",
    phase: "Creating",
    title: "Bring Your Ideas to Life. Immediately.",
    subtitle: "Real-world tools from day one",
    description:
      "We don't just use practice tests. Students build real things from their first semester. You will write real computer code, build robots in the lab, and run experiments on actual advanced computers.",
    detail:
      "With access to powerful AI, unlimited cloud storage, and over 40 special labs, your imagination is the only limit. A new student can turn an idea into a real product in just 3 days. Our students have already filed over 2,000 patents.",
    icon: Zap,
    visual: "particle-field",
    tags: ["Real Hardware", "Live Tools", "3 Days to Launch"],
    stat: { value: "2K+", label: "student patents" },
  },
  {
    id: "connect",
    number: "04",
    phase: "Connecting",
    title: "The World Is Your Classroom.",
    subtitle: "A global student network",
    description:
      "You never learn alone. Every project connects you to a global network of 40,000 students across 12 cities. You can share ideas, solve problems together, and form research teams instantly.",
    detail:
      "3D holograms let you work with classmates in Tokyo, Nairobi, and São Paulo as if they are right next to you. The AI matches you with partners who have the skills you need, no matter where they live.",
    icon: Globe,
    visual: "globe",
    tags: ["40K Students", "12 Cities", "3D Holograms"],
    stat: { value: "40K", label: "global classmates" },
  },
  {
    id: "evolve",
    number: "05",
    phase: "Evolving",
    title: "The School Learns, Too.",
    subtitle: "Always improving for you",
    description:
      "Our school is also a learning system. Every time a student interacts with it, the school gets smarter. It constantly improves what we teach, how our labs work, and how we help different types of minds learn best.",
    detail:
      "A dedicated team watches over the AI to make sure it always does what is best for the students. We also share what our system learns with the world, helping everyone understand how people learn best.",
    icon: BarChart3,
    visual: "waveform",
    tags: ["Self-Improving", "Open Data", "Safe AI"],
    stat: { value: "∞", label: "constant updates" },
  },
];

const pillars = [
  { icon: Brain, label: "Smart Profiling", desc: "AI learns your learning style" },
  { icon: Eye, label: "Interactive Spaces", desc: "Every surface is a touch screen" },
  { icon: Cpu, label: "Real-World Tools", desc: "Access to advanced computers" },
  { icon: MessageSquare, label: "AI Mentorship", desc: "A smart partner for your ideas" },
  { icon: Wifi, label: "Global Network", desc: "40K students in 12 cities" },
  { icon: Shield, label: "Safe & Ethical AI", desc: "Systems you can completely trust" },
];

// ─── THREE.JS VISUALS ─────────────────────────────────────────────────────────

function useStepScene(id: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const W = el.clientWidth || 480;
    const H = el.clientHeight || 340;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 300);
    camera.position.set(0, 0, 5);

    let mX = 0, mY = 0;
    const onMM = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    el.addEventListener("mousemove", onMM);

    const group = new THREE.Group();
    scene.add(group);
    let frame = 0;
    let animId: number;

    // ── Visuals ───────────────────────────────────────────
    if (id === "neural-net") {
      // Nodes and connections like a brain
      const nodes: THREE.Vector3[] = [];
      for (let i = 0; i < 40; i++) {
        nodes.push(new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 3.5,
          (Math.random() - 0.5) * 1.5,
        ));
      }
      nodes.forEach(pos => {
        const g = new THREE.SphereGeometry(0.06, 8, 8);
        const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.copy(pos);
        group.add(mesh);
      });
      const lm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 });
      nodes.forEach((a, i) => nodes.forEach((b, j) => {
        if (j <= i) return;
        if (a.distanceTo(b) < 2) {
          const g = new THREE.BufferGeometry().setFromPoints([a, b]);
          group.add(new THREE.Line(g, lm));
        }
      }));
      // Pulse rings
      for (let i = 0; i < 3; i++) {
        const rg = new THREE.TorusGeometry(0.8 + i * 0.5, 0.008, 8, 60);
        const rm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 - i * 0.03 });
        const ring = new THREE.Mesh(rg, rm);
        ring.rotation.x = Math.PI / 2 + i * 0.3;
        group.add(ring);
      }
    }

    else if (id === "grid-pulse") {
      // Undulating grid plane
      const res = 28;
      const geo = new THREE.PlaneGeometry(6, 5, res, res);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.12 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2.8;
      group.add(mesh);
      (group as any).__geo = geo;
      (group as any).__res = res;

      // Floating cubes
      for (let i = 0; i < 14; i++) {
        const sg = new THREE.BoxGeometry(0.08, 0.08, 0.08);
        const sm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
        const s = new THREE.Mesh(sg, sm);
        s.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 1.5);
        group.add(s);
      }
    }

    else if (id === "particle-field") {
      // Explosion of particles orbiting a core
      const count = 200;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 0.5 + Math.random() * 2.5;
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
      }
      const pg = new THREE.BufferGeometry();
      pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const pm = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.7 });
      group.add(new THREE.Points(pg, pm));
      // Core
      const cg = new THREE.IcosahedronGeometry(0.35, 1);
      const cm = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.45 });
      group.add(new THREE.Mesh(cg, cm));
    }

    else if (id === "globe") {
      // Wireframe sphere + orbiting dots
      const sg = new THREE.SphereGeometry(1.6, 24, 16);
      const sm = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1 });
      group.add(new THREE.Mesh(sg, sm));
      // Latitude rings
      for (let lat = -60; lat <= 60; lat += 30) {
        const r = Math.cos((lat * Math.PI) / 180) * 1.6;
        const y = Math.sin((lat * Math.PI) / 180) * 1.6;
        const rg = new THREE.TorusGeometry(r, 0.005, 6, 80);
        const rm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
        const ring = new THREE.Mesh(rg, rm);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        group.add(ring);
      }
      // City dots
      for (let i = 0; i < 20; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() * 1.2 - 0.6);
        const dg = new THREE.SphereGeometry(0.04, 6, 6);
        const dm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
        const dot = new THREE.Mesh(dg, dm);
        dot.position.set(
          1.62 * Math.cos(phi) * Math.cos(theta),
          1.62 * Math.sin(phi),
          1.62 * Math.cos(phi) * Math.sin(theta),
        );
        group.add(dot);
      }
    }

    else if (id === "waveform") {
      // Multiple sine waves layered
      for (let w = 0; w < 5; w++) {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 120; i++) {
          const x = (i / 120) * 6 - 3;
          pts.push(new THREE.Vector3(x, 0, 0));
        }
        const wg = new THREE.BufferGeometry().setFromPoints(pts);
        const wm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 - w * 0.025 });
        const line = new THREE.Line(wg, wm);
        line.position.y = (w - 2) * 0.5;
        group.add(line);
        (line as any).__waveIndex = w;
      }
      (group as any).__isWave = true;
    }

    // ── Animate ───────────────────────────────────────────
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      group.rotation.y += (mX * 0.35 - group.rotation.y) * 0.04;
      group.rotation.x += (-mY * 0.2 - group.rotation.x) * 0.04;

      if (id === "neural-net") {
        group.rotation.y += 0.003;
        group.children.forEach((c, i) => {
          if (c instanceof THREE.Mesh) {
            (c.material as THREE.MeshBasicMaterial).opacity =
              0.35 + Math.abs(Math.sin(frame * 0.025 + i * 0.4)) * 0.6;
          }
        });
      }

      if (id === "grid-pulse") {
        const geo = (group as any).__geo as THREE.BufferGeometry;
        const res = (group as any).__res as number;
        if (geo) {
          const pos = geo.attributes.position;
          for (let i = 0; i <= res; i++) for (let j = 0; j <= res; j++) {
            const idx = i * (res + 1) + j;
            pos.setZ(idx, Math.sin(frame * 0.035 + i * 0.3 + j * 0.3) * 0.25);
          }
          pos.needsUpdate = true;
          geo.computeVertexNormals();
        }
        group.rotation.y += 0.0015;
      }

      if (id === "particle-field") {
        group.rotation.y += 0.006;
        group.rotation.x += 0.002;
      }

      if (id === "globe") {
        group.rotation.y += 0.004;
        // Pulse city dots
        group.children.forEach((c, i) => {
          if (c instanceof THREE.Mesh && i > 5) {
            (c.material as THREE.MeshBasicMaterial).opacity =
              0.5 + Math.abs(Math.sin(frame * 0.04 + i * 0.6)) * 0.5;
          }
        });
      }

      if (id === "waveform" && (group as any).__isWave) {
        group.children.forEach((line, wi) => {
          if (!(line instanceof THREE.Line)) return;
          const pos = line.geometry.attributes.position;
          const wIdx = (line as any).__waveIndex ?? wi;
          for (let i = 0; i <= 120; i++) {
            const x = (i / 120) * 6 - 3;
            pos.setY(i, Math.sin(x * 1.8 + frame * 0.05 + wIdx * 0.8) * (0.3 - wIdx * 0.04));
          }
          pos.needsUpdate = true;
        });
        group.rotation.y += 0.002;
      }

      camera.position.x += (mX * 0.3 - camera.position.x) * 0.03;
      camera.position.y += (-mY * 0.2 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = el.clientWidth; const h = el.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("mousemove", onMM);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [id]);

  return ref;
}

// ─── AMBIENT BACKGROUND ────────────────────────────────────────────────────────

function AmbientCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = window.innerWidth;
    let H = c.height = window.innerHeight;
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: 0.5 + Math.random() * 1.2,
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
        ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 110) * 0.05})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    };
    draw();
    const onR = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", onR);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onR); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── HERO 3D SCENE ─────────────────────────────────────────────────────────────

function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const W = window.innerWidth, H = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500);
    camera.position.set(0, 0, 7);

    // Concentric dodecahedra
    for (let i = 0; i < 4; i++) {
      const g = new THREE.DodecahedronGeometry(1.5 + i * 0.9, 0);
      const m = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.04 - i * 0.008 });
      scene.add(new THREE.Mesh(g, m));
    }

    // DNA-like double helix
    const helixGroup = new THREE.Group();
    scene.add(helixGroup);
    const helixPts1: THREE.Vector3[] = [], helixPts2: THREE.Vector3[] = [];
    for (let i = 0; i < 80; i++) {
      const t = (i / 80) * Math.PI * 4;
      helixPts1.push(new THREE.Vector3(Math.cos(t) * 3, (i / 80) * 8 - 4, Math.sin(t) * 3));
      helixPts2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 3, (i / 80) * 8 - 4, Math.sin(t + Math.PI) * 3));
    }
    [helixPts1, helixPts2].forEach(pts => {
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const m = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 });
      helixGroup.add(new THREE.Line(g, m));
    });

    // Star field
    const starPos = new Float32Array(500 * 3);
    for (let i = 0; i < 500 * 3; i++) starPos[i] = (Math.random() - 0.5) * 30;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.35 })));

    let mX = 0, mY = 0;
    const onMM = (e: MouseEvent) => { mX = (e.clientX / W - 0.5) * 2; mY = (e.clientY / H - 0.5) * 2; };
    window.addEventListener("mousemove", onMM);

    let frame = 0, animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate); frame++;
      helixGroup.rotation.y += 0.003;
      scene.children.forEach((c, i) => { if (i < 4 && c instanceof THREE.Mesh) { c.rotation.y += 0.001 + i * 0.0005; c.rotation.x += 0.0003; } });
      camera.position.x += (mX * 0.6 - camera.position.x) * 0.02;
      camera.position.y += (-mY * 0.4 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={ref} className="absolute inset-0" style={{ zIndex: 0 }} />;
}

// ─── STEP CARD ──────────────────────────────────────────────────────────────────

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const sceneRef = useStepScene(step.visual);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 70 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.05 }}
      className="relative border rounded-3xl overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.3) 60%, transparent 95%)" }}
      />

      <div className={`grid md:grid-cols-2 ${isEven ? "" : "md:[&>*:first-child]:order-last"}`}>
        {/* ── Info Panel ── */}
        <div
          className="p-10 md:p-14 flex flex-col justify-between relative"
          style={{ borderRight: isEven ? "1px solid rgba(255,255,255,0.06)" : undefined, borderLeft: !isEven ? "1px solid rgba(255,255,255,0.06)" : undefined }}
        >
          {/* Phase label + number */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
                >
                  <step.icon className="w-4.5 h-4.5" style={{ color: "rgba(255,255,255,0.6)" }} />
                </div>
                <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Phase {step.number}  ·  {step.phase}
                </span>
              </div>
              <span
                className="font-black leading-none"
                style={{ fontSize: "72px", color: "rgba(255,255,255,0.04)", letterSpacing: "-0.05em" }}
              >
                {step.number}
              </span>
            </div>

            <h3
              className="font-black tracking-tight mb-2"
              style={{ fontSize: "clamp(22px,3vw,34px)", letterSpacing: "-0.025em" }}
            >
              {step.title}
            </h3>
            <p className="text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(255,255,255,0.28)" }}>
              {step.subtitle}
            </p>
            <p className="text-sm leading-relaxed font-light" style={{ color: "rgba(255,255,255,0.48)" }}>
              {step.description}
            </p>
          </div>

          {/* Expandable detail */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div
                  className="pt-5 text-sm leading-relaxed font-light"
                  style={{ color: "rgba(255,255,255,0.38)", borderTop: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {step.detail}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {step.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[9px] tracking-widest uppercase rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* Stat */}
            <div className="text-right ml-4 flex-shrink-0">
              <div className="font-black text-white" style={{ fontSize: "22px", letterSpacing: "-0.04em" }}>
                {step.stat.value}
              </div>
              <div className="text-[9px] tracking-wide" style={{ color: "rgba(255,255,255,0.28)" }}>
                {step.stat.label}
              </div>
            </div>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 mt-4 transition-all duration-200 hover:opacity-100"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {open ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            <span className="text-[10px] tracking-widest uppercase">{open ? "Less" : "Deep dive"}</span>
          </button>
        </div>

        {/* ── 3D Scene Panel ── */}
        <div className="relative overflow-hidden" style={{ minHeight: "340px", background: "rgba(0,0,0,0.35)" }}>
          <div ref={sceneRef} style={{ width: "100%", height: "100%", minHeight: "340px" }} />

          {/* Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isEven
                ? "linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 40%)"
                : "linear-gradient(to left, rgba(0,0,0,0.25) 0%, transparent 40%)"
            }}
          />

          {/* Phase badge */}
          <div
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
          >
            <span className="text-[8px] tracking-[0.28em] uppercase" style={{ color: "rgba(255,255,255,0.38)" }}>
              Live 3D
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── PILLAR GRID ───────────────────────────────────────────────────────────────

function PillarGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {pillars.map((p, i) => (
        <motion.div
          key={p.label}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="group border rounded-2xl p-6 cursor-default transition-all duration-300"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)" }}
          whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.2)" } as any}
        >
          <div
            className="w-9 h-9 rounded-xl mb-4 flex items-center justify-center"
            style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
          >
            <p.icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.55)" }} />
          </div>
          <p className="text-sm font-semibold mb-1 tracking-tight">{p.label}</p>
          <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.35)" }}>{p.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── TIMELINE NAV ─────────────────────────────────────────────────────────────

function TimelineNav({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onSelect(i)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-[9px] tracking-widest uppercase transition-all duration-300"
          style={{
            background: active === i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.025)",
            border: `1px solid ${active === i ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
            color: active === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
          }}
        >
          <span style={{ color: active === i ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)" }}>{s.number}</span>
          {s.phase}
        </button>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function HowItWorks() {
  const router = useRouter()

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToStep = useCallback((i: number) => {
    setActiveStep(i);
    stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── Fixed BG layers ── */}
      <AmbientCanvas />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)" }} />

      <div className="relative" style={{ zIndex: 10 }}>

        {/* ═══ HERO ════════════════════════════════════════════════════ */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          <HeroScene />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 65% 65% at 50% 50%, transparent 25%, rgba(0,0,0,0.85) 100%)", zIndex: 1 }} />

          <motion.div style={{ y: heroY, opacity: heroOpacity, zIndex: 2 }} className="relative text-center px-6 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>

              {/* Badge */}
              <div className="inline-flex items-center gap-3 border rounded-full px-5 py-2 mb-10" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>Smart School 2040</span>
              </div>

              <h1 className="font-black tracking-tighter leading-none mb-6" style={{ fontSize: "clamp(56px, 10vw, 128px)", letterSpacing: "-0.04em" }}>
                <span className="block">How It</span>
                <span className="block" style={{ color: "rgba(255,255,255,0.1)", WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>Works.</span>
              </h1>

              <div className="w-12 h-px mx-auto mb-8" style={{ background: "rgba(255,255,255,0.22)" }} />

              <p className="max-w-lg mx-auto text-base leading-relaxed font-light mb-10" style={{ color: "rgba(255,255,255,0.42)", fontSize: "clamp(14px, 1.8vw, 17px)" }}>
                Five phases. One continuous loop. This is learning reimagined from the ground up — not for the classroom of today, but for the minds of tomorrow.
              </p>

              {/* Step count pills */}
              <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
                {steps.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                    style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
                  >
                    <span className="text-[8px] font-black" style={{ color: "rgba(255,255,255,0.3)" }}>{s.number}</span>
                    <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.38)" }}>{s.phase}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-[8px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.22)" }}>Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="w-px h-10"
                  style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══ CONTENT ═════════════════════════════════════════════════ */}
        <div className="mx-auto" style={{ maxWidth: "1320px", padding: "0 clamp(16px,5vw,80px)" }}>

          {/* ── INTRO SECTION ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="py-24 border-b"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-10" style={{ background: "rgba(255,255,255,0.3)" }} />
              <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>The System</span>
            </div>
            <div className="grid md:grid-cols-2 gap-14 items-start">
              <div>
                <h2 className="font-black tracking-tighter mb-4" style={{ fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-0.03em" }}>
                  Not a school.<br />
                  <span style={{ color: "rgba(255,255,255,0.12)", WebkitTextStroke: "1px rgba(255,255,255,0.18)" }}>An intelligence.</span>
                </h2>
              </div>
              <div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Smart School 2040 is a closed loop between student and institution. The school watches, learns, reconfigures, and evolves in response to every interaction — not in aggregate, but individually. No two students experience the same school.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Below is the framework. Five phases that run in sequence and then cycle back — continuously deepening, continuously adapting.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── TIMELINE NAV ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="py-10 border-b mb-6"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <p className="text-[9px] tracking-[0.35em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.25)" }}>Jump to phase</p>
            <TimelineNav active={activeStep} onSelect={scrollToStep} />
          </motion.div>

          {/* ── CONNECTION LINE ── */}
          <div className="relative">
            {/* Vertical spine */}
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 10%, rgba(255,255,255,0.07) 90%, transparent)", zIndex: 1 }}
            />

            {/* Step cards */}
            <div className="flex flex-col gap-5 py-6">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  ref={el => { stepRefs.current[i] = el; }}
                  className="scroll-mt-20"
                >
                  {/* Connector node */}
                  <div className="hidden md:flex items-center justify-center my-3" style={{ zIndex: 2, position: "relative" }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px]"
                      style={{
                        background: "rgba(0,0,0,0.9)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {step.number}
                    </div>
                  </div>
                  <StepCard step={step} index={i} />
                </div>
              ))}
            </div>
          </div>

          {/* ── PILLARS ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="py-24 border-t border-b"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10" style={{ background: "rgba(255,255,255,0.3)" }} />
              <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Six Core Pillars</span>
            </div>
            <h2 className="font-black tracking-tighter mb-12" style={{ fontSize: "clamp(26px,4vw,48px)", letterSpacing: "-0.03em" }}>
              The technology<br />
              <span style={{ color: "rgba(255,255,255,0.12)", WebkitTextStroke: "1px rgba(255,255,255,0.18)" }}>beneath the school.</span>
            </h2>
            <PillarGrid />
          </motion.div>

          {/* ── LOOP CALLOUT ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="py-24 text-center"
          >
            <div
              className="inline-block rounded-3xl px-10 py-12 mb-6 border"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                {["Enroll", "Learn", "Build", "Connect", "Evolve"].map((label, i) => (
                  <span key={label} className="flex items-center gap-2">
                    <span
                      className="text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full"
                      style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)" }}
                    >
                      {label}
                    </span>
                    {i < 4 && <ArrowRight className="w-3 h-3" style={{ color: "rgba(255,255,255,0.18)" }} />}
                  </span>
                ))}
                <ArrowRight className="w-3 h-3" style={{ color: "rgba(255,255,255,0.18)" }} />
                <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>↺ repeat</span>
              </div>
              <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.3)" }}>
                The loop never closes. It deepens.
              </p>
            </div>

            <h2 className="font-black tracking-tighter mb-4" style={{ fontSize: "clamp(32px,5vw,72px)", letterSpacing: "-0.035em" }}>
              This Is How<br />
            </h2>
            <h2 className="font-black tracking-tighter mb-8" style={{ fontSize: "clamp(32px,5vw,72px)", letterSpacing: "-0.035em", color: "rgba(255,255,255,0.1)", WebkitTextStroke: "1px rgba(255,255,255,0.16)" }}>
              The Future Learns.
            </h2>
            <p className="text-sm font-light mb-10 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.32)" }}>
              Every system described here is live. Every lab exists. Every student who walks through the doors of Smart School 2040 becomes part of the most ambitious educational experiment on Earth.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => router.push("/contact")} className="px-12 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.22em] rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-100">
                contact us
              </button>
              <button
                onClick={() => router.push("/facilities")}
                className="px-12 py-4 border text-[10px] font-bold uppercase tracking-[0.22em] rounded-full transition-all duration-300"
                style={{ borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.45)" }}
              >
                View Facilities
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}