"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import {
  Cpu, Brain, Zap, Globe, Shield, Rocket, Microscope,
  Waves, Eye, Layers, Network, Atom, Fingerprint, Radio,
  ChevronDown, ArrowRight, Play, Pause,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const facilities = [
  {
    id: "quantum-lab",
    number: "01",
    name: "Quantum Computing Lab",
    tagline: "Compute at the edge of physics",
    icon: Atom,
    desc: "The only school on Earth with its own IBM Quantum processor. Students run real quantum algorithms — not simulations. The 127-qubit system enables research otherwise limited to national laboratories.",
    specs: ["127-qubit processor", "0.001ms gate time", "99.9% fidelity", "24/7 access"],
    visual: "quantum",
  },
  {
    id: "neural-studio",
    number: "02",
    name: "Neural Interface Studio",
    tagline: "Where mind meets machine",
    icon: Brain,
    desc: "High-density EEG rigs, haptic exoskeletons, and BCI development kits. Students design and test direct neural input systems in a fully equipped neurotechnology suite.",
    specs: ["256-channel EEG", "Sub-ms latency", "Full haptic suit", "AI calibration"],
    visual: "neural",
  },
  {
    id: "holo-arena",
    number: "03",
    name: "Holographic Arena",
    tagline: "Reality is a canvas",
    icon: Eye,
    desc: "A 360° volumetric display chamber spanning 40 metres. Projects photorealistic holograms at 1:1 scale — from molecular structures to architectural walkthroughs. No headsets required.",
    specs: ["40m diameter", "32K resolution", "120fps refresh", "360° surround"],
    visual: "holo",
  },
  {
    id: "robotics-bay",
    number: "04",
    name: "Robotics Bay",
    tagline: "Build what doesn't exist yet",
    icon: Cpu,
    desc: "An industrial-scale robotics fabrication bay housing 20+ robotic arms, drone test corridors, and a live swarm simulation environment. Students ship real hardware in semester one.",
    specs: ["20+ robotic arms", "Drone corridor", "Swarm sandbox", "CNC + 3D forge"],
    visual: "robotics",
  },
  {
    id: "deep-space",
    number: "05",
    name: "Deep Space Observatory",
    tagline: "Eyes on the universe",
    icon: Radio,
    desc: "A rooftop telescope array paired with real-time satellite feeds and a radio telescope dish. Students contribute data to live astrophysics research programs worldwide.",
    specs: ["2m primary mirror", "SAT uplink", "Radio dish", "Live data pipeline"],
    visual: "space",
  },
  {
    id: "biosynth",
    number: "06",
    name: "BioSynth Lab",
    tagline: "Engineer life itself",
    icon: Microscope,
    desc: "A BSL-2 certified synthetic biology laboratory with CRISPR editing stations, protein folding workstations, and live culture chambers. Guided by AI safety protocols at every step.",
    specs: ["BSL-2 certified", "CRISPR editing", "AI biosafety", "Live cultures"],
    visual: "bio",
  },
  {
    id: "cyber-grid",
    number: "07",
    name: "CyberGrid Arena",
    tagline: "Red team. Blue team. Real stakes.",
    icon: Shield,
    desc: "An isolated cyber range with live attack-defense simulations. Students face real-world threat scenarios — infrastructure attacks, zero-days, and adversarial AI — in a contained environment.",
    specs: ["Air-gapped network", "Live red teams", "AI adversaries", "CTF leaderboard"],
    visual: "cyber",
  },
  {
    id: "zero-g",
    number: "08",
    name: "Zero-G Design Studio",
    tagline: "Design for the void",
    icon: Rocket,
    desc: "A microgravity simulation suite with parabolic flight training modules and satellite hardware testbeds. Students design systems for orbital and lunar deployment.",
    specs: ["Microgravity sim", "Parabolic module", "CubeSat testbed", "ESA partnership"],
    visual: "zero-g",
  },
];

const stats = [
  { value: "40+",  label: "World-Class Labs",       desc: "Across 8 disciplines" },
  { value: "2K+",  label: "Patents Filed",          desc: "By students since 2040" },
  { value: "24/7", label: "Open Access",            desc: "No booking required" },
  { value: "∞",    label: "Compute Quota",          desc: "Unlimited cloud credits" },
];

// ─── THREE.JS SCENES ─────────────────────────────────────────────────────────

function useThreeScene(id: string) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.clientWidth || 400;
    const H = el.clientHeight || 300;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500);
    camera.position.set(0, 0, 4);

    // Mouse tracking
    let mX = 0, mY = 0;
    const onMM = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mX = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      mY = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    };
    el.addEventListener("mousemove", onMM);

    let animId: number;
    let frame = 0;
    const group = new THREE.Group();
    scene.add(group);

    // ── Scene variants ──────────────────────────────────
    if (id === "quantum") {
      // Quantum: spinning lattice of nodes
      const nodePositions: [number,number,number][] = [];
      for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) for (let z = -2; z <= 2; z++) {
        if (Math.abs(x)+Math.abs(y)+Math.abs(z) <= 4) nodePositions.push([x,y,z]);
      }
      nodePositions.forEach(([x,y,z]) => {
        const g = new THREE.SphereGeometry(0.055, 6, 6);
        const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
        const mesh = new THREE.Mesh(g, m); mesh.position.set(x*0.7, y*0.7, z*0.7);
        group.add(mesh);
      });
      // Connecting lines
      const lm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
      nodePositions.forEach(([x1,y1,z1], i) => nodePositions.forEach(([x2,y2,z2], j) => {
        if (j <= i) return;
        const d = Math.hypot(x1-x2,y1-y2,z1-z2);
        if (d < 1.1) {
          const g = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x1*0.7,y1*0.7,z1*0.7),
            new THREE.Vector3(x2*0.7,y2*0.7,z2*0.7),
          ]);
          group.add(new THREE.Line(g, lm));
        }
      }));
    }

    else if (id === "neural") {
      // Neural: flowing wave mesh
      const res = 24;
      const geo = new THREE.PlaneGeometry(5, 5, res, res);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.18 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 3;
      group.add(mesh);
      // Floating neurons
      for (let i = 0; i < 30; i++) {
        const sg = new THREE.SphereGeometry(0.04 + Math.random()*0.06, 6, 6);
        const sm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
        const s = new THREE.Mesh(sg, sm);
        s.position.set((Math.random()-0.5)*4,(Math.random()-0.5)*3,(Math.random()-0.5)*2);
        group.add(s);
      }
      // Store wave ref
      (group as any).__waveGeo = geo;
      (group as any).__waveRes = res;
    }

    else if (id === "holo") {
      // Holo: rotating rings
      for (let i = 0; i < 6; i++) {
        const r = 0.6 + i * 0.35;
        const g = new THREE.TorusGeometry(r, 0.006, 8, 80);
        const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 - i*0.015 });
        const mesh = new THREE.Mesh(g, m);
        mesh.rotation.x = (i * Math.PI) / 5;
        mesh.rotation.y = (i * Math.PI) / 7;
        group.add(mesh);
      }
      // Center glow
      const cg = new THREE.SphereGeometry(0.12, 12, 12);
      const cm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      group.add(new THREE.Mesh(cg, cm));
    }

    else if (id === "robotics") {
      // Robotics: mechanical arm segments
      for (let i = 0; i < 5; i++) {
        const h = 0.5 + Math.random() * 0.7;
        const g = new THREE.CylinderGeometry(0.05, 0.08, h, 8);
        const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set((i-2)*0.7, (Math.random()-0.5)*1.5, Math.random()*0.5);
        mesh.rotation.z = (Math.random()-0.5)*0.8;
        group.add(mesh);
        // Joint sphere
        const js = new THREE.SphereGeometry(0.1, 8, 8);
        const jm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
        const jmesh = new THREE.Mesh(js, jm);
        jmesh.position.copy(mesh.position);
        group.add(jmesh);
      }
      // Ground grid
      const gg = new THREE.GridHelper(6, 12, 0x333333, 0x1a1a1a);
      gg.position.y = -1.8;
      gg.material = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.4 });
      group.add(gg);
    }

    else if (id === "space") {
      // Space: star field + rotating rings
      const starCount = 300;
      const pos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) pos[i] = (Math.random()-0.5)*18;
      const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const sm = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.6 });
      group.add(new THREE.Points(sg, sm));
      // Planet
      const pg = new THREE.SphereGeometry(0.8, 24, 24);
      const pm = new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true });
      group.add(new THREE.Mesh(pg, pm));
      // Ring
      const rg = new THREE.TorusGeometry(1.3, 0.03, 6, 80);
      const rm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
      const ring = new THREE.Mesh(rg, rm); ring.rotation.x = Math.PI/3;
      group.add(ring);
    }

    else if (id === "bio") {
      // Bio: double helix DNA
      const turns = 3; const pts = 120;
      const strand1: THREE.Vector3[] = [], strand2: THREE.Vector3[] = [];
      for (let i = 0; i < pts; i++) {
        const t = (i / pts) * turns * Math.PI * 2;
        const y = (i / pts) * 4 - 2;
        strand1.push(new THREE.Vector3(Math.cos(t)*0.6, y, Math.sin(t)*0.6));
        strand2.push(new THREE.Vector3(Math.cos(t+Math.PI)*0.6, y, Math.sin(t+Math.PI)*0.6));
      }
      [strand1, strand2].forEach(pts => {
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        const m = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
        group.add(new THREE.Line(g, m));
      });
      // Rungs
      for (let i = 0; i < pts; i += 6) {
        const rg = new THREE.BufferGeometry().setFromPoints([strand1[i], strand2[i]]);
        const rm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
        group.add(new THREE.Line(rg, rm));
        const sg = new THREE.SphereGeometry(0.035, 5, 5);
        const sm = new THREE.MeshBasicMaterial({ color: 0xffffff });
        [strand1[i], strand2[i]].forEach(p => {
          const m = new THREE.Mesh(sg, sm); m.position.copy(p); group.add(m);
        });
      }
    }

    else if (id === "cyber") {
      // Cyber: hex grid
      for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
        const g = new THREE.RingGeometry(0.25, 0.28, 6);
        const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 + Math.random()*0.15, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(i*0.62 + (j%2)*0.31, j*0.54, (Math.random()-0.5)*0.3);
        group.add(mesh);
      }
      // Scanning line
      const sg = new THREE.PlaneGeometry(5, 0.03);
      const sm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
      const scanLine = new THREE.Mesh(sg, sm);
      group.add(scanLine);
      (group as any).__scanLine = scanLine;
    }

    else if (id === "zero-g") {
      // Zero-G: floating debris / satellite parts
      const parts: THREE.Mesh[] = [];
      for (let i = 0; i < 22; i++) {
        const geos = [
          new THREE.BoxGeometry(0.12+Math.random()*0.18, 0.12+Math.random()*0.18, 0.04),
          new THREE.CylinderGeometry(0.06, 0.06, 0.3, 6),
          new THREE.OctahedronGeometry(0.1),
        ];
        const geo = geos[Math.floor(Math.random()*geos.length)];
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: Math.random()>0.5, transparent: true, opacity: 0.4+Math.random()*0.4 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random()-0.5)*5,(Math.random()-0.5)*4,(Math.random()-0.5)*2);
        mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);
        group.add(mesh);
        parts.push(mesh);
      }
      (group as any).__parts = parts;
    }

    // ── Animate ──────────────────────────────────────────
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      // Mouse-tracked rotation
      group.rotation.y += (mX * 0.4 - group.rotation.y) * 0.05;
      group.rotation.x += (-mY * 0.2 - group.rotation.x) * 0.05;

      if (id === "quantum") {
        group.rotation.y += 0.003;
        group.children.forEach((c, i) => {
          if (c instanceof THREE.Mesh) {
            const m = c.material as THREE.MeshBasicMaterial;
            m.opacity = 0.4 + Math.abs(Math.sin(frame * 0.02 + i * 0.3)) * 0.5;
          }
        });
      }

      if (id === "neural") {
        const geo = (group as any).__waveGeo as THREE.BufferGeometry;
        const res = (group as any).__waveRes as number;
        if (geo) {
          const pos = geo.attributes.position;
          for (let i = 0; i <= res; i++) for (let j = 0; j <= res; j++) {
            const idx = i * (res+1) + j;
            pos.setZ(idx, Math.sin(frame*0.04 + i*0.4 + j*0.4) * 0.18);
          }
          pos.needsUpdate = true;
          geo.computeVertexNormals();
        }
        group.rotation.y += 0.003;
      }

      if (id === "holo") {
        group.children.forEach((c, i) => {
          c.rotation.y += 0.008 - i * 0.001;
          c.rotation.x += 0.004 + i * 0.0005;
        });
      }

      if (id === "robotics") {
        group.children.forEach((c, i) => {
          if (c instanceof THREE.Mesh) c.rotation.z = Math.sin(frame*0.02 + i*0.5) * 0.3;
        });
      }

      if (id === "space") {
        group.rotation.y += 0.002;
        group.children.forEach((c, i) => { if (i > 0) c.rotation.y += 0.005; });
      }

      if (id === "bio") { group.rotation.y += 0.006; }

      if (id === "cyber") {
        const sl = (group as any).__scanLine as THREE.Mesh;
        if (sl) sl.position.y = Math.sin(frame * 0.03) * 2;
        group.children.forEach((c, i) => {
          if (c instanceof THREE.Mesh && c !== sl) {
            (c.material as THREE.MeshBasicMaterial).opacity =
              0.08 + Math.abs(Math.sin(frame * 0.05 + i * 0.4)) * 0.2;
          }
        });
      }

      if (id === "zero-g") {
        const parts = (group as any).__parts as THREE.Mesh[];
        parts?.forEach((p, i) => {
          p.position.y += Math.sin(frame*0.015 + i) * 0.003;
          p.position.x += Math.cos(frame*0.012 + i*0.7) * 0.002;
          p.rotation.x += 0.008 + i * 0.001;
          p.rotation.y += 0.005 + i * 0.0008;
        });
      }

      camera.position.x += (mX * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (-mY * 0.3 - camera.position.y) * 0.03;
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

  return mountRef;
}

// ─── FACILITY CARD ────────────────────────────────────────────────────────────

function FacilityCard({ f, index }: { f: typeof facilities[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref        = useRef<HTMLDivElement>(null);
  const inView     = useInView(ref, { once: true, margin: "-80px" });
  const mountRef   = useThreeScene(f.visual);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.1 }}
      className="group relative border border-white/8 rounded-3xl overflow-hidden cursor-pointer"
      style={{ background: "rgba(255,255,255,0.015)" }}
      onClick={() => setExpanded(!expanded)}
      whileHover={{ borderColor: "rgba(255,255,255,0.22)" }}
    >
      {/* Hover gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)" }}
      />

      {/* Top scan line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }}
      />

      <div className="grid md:grid-cols-2 gap-0">
        {/* ── Left: Info ── */}
        <div className="p-10 md:p-12 flex flex-col justify-between" style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:border-white/30"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
                >
                  <f.icon className="w-5 h-5" style={{ color: "rgba(255,255,255,0.65)" }} />
                </div>
                <span
                  className="font-black"
                  style={{ fontSize: "52px", color: "rgba(255,255,255,0.05)", lineHeight: 1, letterSpacing: "-0.04em" }}
                >
                  {f.number}
                </span>
              </div>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="mt-1"
              >
                <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
              </motion.div>
            </div>

            <h3 className="font-black tracking-tight mb-1" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", letterSpacing: "-0.02em" }}>
              {f.name}
            </h3>
            <p className="text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
              {f.tagline}
            </p>
            <p className="text-sm leading-relaxed font-light" style={{ color: "rgba(255,255,255,0.45)" }}>
              {f.desc}
            </p>
          </div>

          {/* Specs */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-6 border-t border-white/8">
                  <p className="text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Specifications
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {f.specs.map((spec) => (
                      <div
                        key={spec}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <span className="w-1 h-1 rounded-full bg-white opacity-50 flex-shrink-0" />
                        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="flex items-center gap-2 mt-8">
            <span className="text-xs font-semibold transition-colors duration-200 group-hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>
              {expanded ? "Collapse" : "View specs"}
            </span>
            <ArrowRight className="w-3 h-3 transition-all duration-200 group-hover:translate-x-1" style={{ color: "rgba(255,255,255,0.4)" }} />
          </div>
        </div>

        {/* ── Right: 3D Scene ── */}
        <div
          className="relative overflow-hidden"
          style={{ minHeight: "320px", background: "rgba(0,0,0,0.3)" }}
        >
          <div ref={mountRef} style={{ width: "100%", height: "100%", minHeight: "320px" }} />
          {/* Overlay gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 50%)" }}
          />
          {/* Label */}
          <div
            className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
          >
            <span className="text-[8px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
              Interactive 3D
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── BACKGROUND SCENE ─────────────────────────────────────────────────────────

function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Large wire sphere
    const sg = new THREE.SphereGeometry(4, 28, 28);
    const sm = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.03 });
    const sphere = new THREE.Mesh(sg, sm);
    scene.add(sphere);

    // Icosahedron
    const ig = new THREE.IcosahedronGeometry(2.5, 1);
    const im = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.05 });
    const ico = new THREE.Mesh(ig, im);
    scene.add(ico);

    // Ring system
    for (let i = 0; i < 3; i++) {
      const rg = new THREE.TorusGeometry(2.8 + i * 0.8, 0.005, 6, 120);
      const rm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 - i * 0.02 });
      const ring = new THREE.Mesh(rg, rm);
      ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
      scene.add(ring);
    }

    // Particles
    const pCount = 600;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random()-0.5) * 24;
    const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pm = new THREE.PointsMaterial({ color: 0xffffff, size: 0.035, transparent: true, opacity: 0.4 });
    scene.add(new THREE.Points(pg, pm));

    let mX = 0, mY = 0;
    const onMM = (e: MouseEvent) => { mX = (e.clientX/W - 0.5)*2; mY = (e.clientY/H - 0.5)*2; };
    window.addEventListener("mousemove", onMM);

    let frame = 0, animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate); frame++;
      sphere.rotation.y += 0.001; sphere.rotation.x += 0.0003;
      ico.rotation.y -= 0.002; ico.rotation.x += 0.001;
      scene.children.forEach((c, i) => { if (c instanceof THREE.Mesh && i > 1 && i < 5) { c.rotation.z += 0.001 + i*0.0003; } });
      camera.position.x += (mX*0.8 - camera.position.x) * 0.02;
      camera.position.y += (-mY*0.5 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = window.innerWidth; const h = window.innerHeight;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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

  return <div ref={mountRef} className="absolute inset-0" style={{ zIndex: 0 }} />;
}

// ─── PARTICLE BACKGROUND ──────────────────────────────────────────────────────

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = window.innerWidth;
    let H = c.height = window.innerHeight;
    const pts = Array.from({length: 60}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3,
      r: 0.5 + Math.random()*1,
    }));
    let id: number;
    const draw = () => {
      id = requestAnimationFrame(draw);
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x=W; if (p.x>W) p.x=0;
        if (p.y<0) p.y=H; if (p.y>H) p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fill();
      });
      // Connect nearby
      for (let i = 0; i < pts.length; i++) for (let j = i+1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${(1-d/120)*0.06})`; ctx.lineWidth=0.5; ctx.stroke();
        }
      }
    };
    draw();
    const onR = () => { W=c.width=window.innerWidth; H=c.height=window.innerHeight; };
    window.addEventListener("resize",onR);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize",onR); };
  },[]);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{zIndex:0}} />;
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function FacilitiesPage() {
  const { scrollY }   = useScroll();
  const heroY         = useTransform(scrollY, [0, 700], [0, -120]);
  const heroOpacity   = useTransform(scrollY, [0, 600], [1, 0]);
  const statsRef      = useRef<HTMLDivElement>(null);
  const statsInView   = useInView(statsRef, { once: true, margin: "-80px" });

  const fadeUp = {
    hidden:  { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  };

  const stagger = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── Fixed BG ── */}
      <ParticleCanvas />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />

      <div className="relative" style={{ zIndex: 10 }}>

        {/* ════ HERO ══════════════════════════════════════════ */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <HeroScene />

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.8) 100%)", zIndex: 1 }} />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity, zIndex: 2 }}
            className="relative text-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-3 border border-white/12 rounded-full px-5 py-2 mb-10" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                  World-Class Infrastructure
                </span>
              </div>

              <h1 className="font-black tracking-tighter leading-none mb-8" style={{ fontSize: "clamp(60px, 11vw, 140px)", letterSpacing: "-0.04em" }}>
                <span className="block text-white">Our</span>
                <span className="block" style={{ color: "rgba(255,255,255,0.12)", WebkitTextStroke: "1px rgba(255,255,255,0.18)" }}>Facilities.</span>
              </h1>

              <div className="w-16 h-px mx-auto mb-8" style={{ background: "rgba(255,255,255,0.2)" }} />

              <p className="max-w-xl mx-auto text-base leading-relaxed font-light mb-12" style={{ color: "rgba(255,255,255,0.45)" }}>
                Eight next-generation laboratories built for students who refuse to wait for the future. Quantum processors. Neural interfaces. Holographic chambers. All real. All open.
              </p>

              <div className="flex gap-4 justify-center flex-wrap">
                <button className="px-10 py-3.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-100">
                  Tour Facilities →
                </button>
                <button className="px-10 py-3.5 border border-white/20 text-white/55 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:border-white/45 hover:text-white">
                  Apply Now
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            style={{ zIndex: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[8px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>Scroll</span>
              <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
            </motion.div>
          </motion.div>
        </section>

        <div className="mx-auto" style={{ maxWidth: "1280px", padding: "0 clamp(20px,5vw,80px)" }}>

          {/* ════ STATS ═════════════════════════════════════ */}
          <motion.div
            ref={statsRef}
            variants={stagger}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 py-24 border-b border-white/8 mb-24"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-center border border-white/7 rounded-2xl py-10 px-6 group cursor-default"
                style={{ background: "rgba(255,255,255,0.02)", transition: "border-color 0.3s, transform 0.3s" }}
                whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.22)" } as any}
              >
                <div className="font-black mb-2" style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.04em" }}>
                  {s.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>{s.desc}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* ════ INTRO ═════════════════════════════════════ */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-24"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-10" style={{ background: "rgba(255,255,255,0.35)" }} />
              <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>Infrastructure</span>
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-end">
              <div>
                <h2 className="font-black tracking-tighter mb-4" style={{ fontSize: "clamp(32px,5vw,60px)", letterSpacing: "-0.03em" }}>
                  Built for the<br />
                  <span style={{ color: "rgba(255,255,255,0.15)", WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>Impossible.</span>
                </h2>
              </div>
              <p className="text-base leading-relaxed font-light" style={{ color: "rgba(255,255,255,0.45)" }}>
                Every lab at Smart School 2040 was designed with a single principle: if you can imagine it, you should be able to build it here. Click any facility below to explore its specifications and interact with a live 3D preview.
              </p>
            </div>
          </motion.div>

          {/* ════ FACILITY CARDS ════════════════════════════ */}
          <div className="flex flex-col gap-6 mb-32">
            {facilities.map((f, i) => (
              <FacilityCard key={f.id} f={f} index={i} />
            ))}
          </div>

          {/* ════ BOTTOM CTA ════════════════════════════════ */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center pb-32 pt-10 border-t border-white/8"
          >
            <p className="text-[9px] tracking-[0.35em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
              Ready to explore?
            </p>
            <h2 className="font-black tracking-tighter mb-4" style={{ fontSize: "clamp(32px,5vw,64px)", letterSpacing: "-0.03em" }}>
              Your Lab Awaits.
            </h2>
            <h2 className="font-black tracking-tighter mb-10" style={{ fontSize: "clamp(32px,5vw,64px)", letterSpacing: "-0.03em", color: "rgba(255,255,255,0.12)", WebkitTextStroke: "1px rgba(255,255,255,0.18)" }}>
              Day One.
            </h2>
            <p className="text-sm font-light mb-10 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
              Every student has 24/7 unrestricted access from the moment they enroll. No waiting lists. No gatekeeping.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                className="px-14 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.25em] rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-100"
              >
                Apply for 2049 Cohort
              </button>
              <button className="px-14 py-4 border border-white/18 text-white/45 text-[10px] font-bold uppercase tracking-[0.25em] rounded-full transition-all duration-300 hover:border-white/4 hover:text-white">
                Virtual Tour
              </button>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}