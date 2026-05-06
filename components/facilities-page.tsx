/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useEffect, useRef, useState, useCallback,
} from "react";
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, animate, AnimatePresence,
} from "framer-motion";
import * as THREE from "three";
import {
  Atom, Brain, Eye, Cpu, Radio, Microscope, Shield, Rocket,
  ArrowUpRight, ArrowDown, X, Crosshair,
} from "lucide-react";

// ─── FACILITIES DATA ──────────────────────────────────────────────────────────

const FACILITIES = [
  {
    id: "quantum",
    index: 0,
    code: "QCL-01",
    name: "Quantum\nComputing Lab",
    short: "Quantum",
    tagline: "Advanced computing at the limits of science",
    body: "This lab provides students with access to advanced quantum computing systems. Students work on real programs and participate in research projects without delays or restrictions.",
    numbers: [{ v: "127", u: "qubits" }, { v: "99.9%", u: "accuracy" }, { v: "24/7", u: "access" }],
    icon: Atom,
    accent: "rgba(255,255,255,0.9)",
    scene: "quantum",
  },
  {
    id: "neural",
    index: 1,
    code: "NIS-02",
    name: "Neural Interface\nStudio",
    short: "Neural",
    tagline: "Connecting the human mind and technology",
    body: "Equipped with advanced brain-sensing devices and feedback systems, this lab allows students to design and test connections between the human brain and computers.",
    numbers: [{ v: "256", u: "sensors" }, { v: "Low", u: "latency" }, { v: "AI", u: "calibration" }],
    icon: Brain,
    accent: "rgba(255,255,255,0.9)",
    scene: "neural",
  },
  {
    id: "holo",
    index: 2,
    code: "HAR-03",
    name: "Holographic\nArena",
    short: "Holographic",
    tagline: "Experience learning in three dimensions",
    body: "A large 360-degree immersive space that displays realistic, full-scale holograms. Students can explore complex ideas visually without the need for headsets.",
    numbers: [{ v: "40m", u: "space" }, { v: "32K", u: "resolution" }, { v: "120fps", u: "display" }],
    icon: Eye,
    accent: "rgba(255,255,255,0.9)",
    scene: "holo",
  },
  {
    id: "robotics",
    index: 3,
    code: "RBY-04",
    name: "Robotics\nBay",
    short: "Robotics",
    tagline: "Design and build real machines",
    body: "A fully equipped robotics workspace where students build, test, and deploy working systems. Practical projects begin from the first term.",
    numbers: [{ v: "20+", u: "robotic arms" }, { v: "Term 1", u: "projects" }, { v: "AI", u: "assistance" }],
    icon: Cpu,
    accent: "rgba(255,255,255,0.9)",
    scene: "robotics",
  },
  {
    id: "space",
    index: 4,
    code: "DSO-05",
    name: "Deep Space\nObservatory",
    short: "Space",
    tagline: "Explore the universe",
    body: "This facility includes advanced telescopes and live satellite data systems. Students can observe space and contribute to global research programs.",
    numbers: [{ v: "2m", u: "mirror" }, { v: "Live", u: "satellite data" }, { v: "Global", u: "collaboration" }],
    icon: Radio,
    accent: "rgba(255,255,255,0.9)",
    scene: "space",
  },
  {
    id: "bio",
    index: 5,
    code: "BSL-06",
    name: "BioSynth\nLab",
    short: "BioSynth",
    tagline: "Innovation in life sciences",
    body: "A certified biotechnology lab where students work with modern biological tools under strict safety systems guided by AI.",
    numbers: [{ v: "Certified", u: "lab" }, { v: "Gene", u: "tools" }, { v: "AI", u: "safety" }],
    icon: Microscope,
    accent: "rgba(255,255,255,0.9)",
    scene: "bio",
  },
  {
    id: "cyber",
    index: 6,
    code: "CGA-07",
    name: "CyberGrid\nArena",
    short: "CyberGrid",
    tagline: "Learn to secure digital systems",
    body: "A protected environment for cybersecurity training where students practice defending systems against real-world threats and simulations.",
    numbers: [{ v: "Secure", u: "network" }, { v: "Live", u: "simulations" }, { v: "Global", u: "ranking" }],
    icon: Shield,
    accent: "rgba(255,255,255,0.9)",
    scene: "cyber",
  },
  {
    id: "zerog",
    index: 7,
    code: "ZGD-08",
    name: "Zero-G\nDesign Studio",
    short: "Zero-G",
    tagline: "Design for space environments",
    body: "A specialized environment that simulates low-gravity conditions. Students design and test systems for use in space and related applications.",
    numbers: [{ v: "Zero-G", u: "simulation" }, { v: "Space", u: "projects" }, { v: "Advanced", u: "tools" }],
    icon: Rocket,
    accent: "rgba(255,255,255,0.9)",
    scene: "zerog",
  },
];

// ─── THREE SCENES (one per facility) ─────────────────────────────────────────

function buildScene(id: string, scene: THREE.Scene, group: THREE.Group) {
  const add = (obj: THREE.Object3D) => group.add(obj);

  if (id === "quantum") {
    // Spinning lattice of tetrahedra
    for (let i = 0; i < 24; i++) {
      const g = new THREE.TetrahedronGeometry(0.12 + Math.random() * 0.1, 0);
      const m = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.5 });
      const mesh = new THREE.Mesh(g, m);
      const theta = (i / 24) * Math.PI * 2;
      const phi = Math.acos(2 * (i / 24) - 1);
      const r = 1.2 + Math.random() * 0.8;
      mesh.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      add(mesh);
    }
    // Orbital ring
    for (let i = 0; i < 3; i++) {
      const rg = new THREE.TorusGeometry(1.6 + i * 0.5, 0.007, 6, 100);
      const rm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 - i * 0.04 });
      const ring = new THREE.Mesh(rg, rm);
      ring.rotation.x = (i * Math.PI) / 4;
      ring.rotation.y = (i * Math.PI) / 6;
      add(ring);
    }
    // Core octahedron
    const cg = new THREE.OctahedronGeometry(0.3, 0);
    const cm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    add(new THREE.Mesh(cg, cm));
  }

  else if (id === "neural") {
    // Dense node web
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < 55; i++) {
      const v = new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2);
      nodes.push(v);
      const sg = new THREE.SphereGeometry(0.04, 5, 5);
      const sm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
      const s = new THREE.Mesh(sg, sm); s.position.copy(v); add(s);
    }
    const lm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 });
    nodes.forEach((a, i) => nodes.forEach((b, j) => {
      if (j <= i || a.distanceTo(b) > 1.4) return;
      const g = new THREE.BufferGeometry().setFromPoints([a, b]);
      add(new THREE.Line(g, lm));
    }));
  }

  else if (id === "holo") {
    // Nested spinning polyhedra
    [[2.0, 0], [1.4, 1], [0.9, 2]].forEach(([r, d]) => {
      const g = new THREE.IcosahedronGeometry(r, d);
      const m = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.07 + d * 0.04 });
      add(new THREE.Mesh(g, m));
    });
    // Horizontal scan lines
    for (let y = -1.5; y <= 1.5; y += 0.15) {
      const pts = [new THREE.Vector3(-2.5, y, 0), new THREE.Vector3(2.5, y, 0)];
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const m = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 });
      add(new THREE.Line(g, m));
    }
  }

  else if (id === "robotics") {
    // Articulated arm segments
    const arm = new THREE.Group();
    const joints: THREE.Mesh[] = [];
    let y = -1.5;
    for (let i = 0; i < 6; i++) {
      const h = 0.4 + Math.random() * 0.3;
      const cg = new THREE.CylinderGeometry(0.06, 0.09, h, 8);
      const cm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 });
      const seg = new THREE.Mesh(cg, cm);
      seg.position.set(Math.sin(i * 0.6) * 0.4, y + h / 2, 0);
      arm.add(seg);
      const jg = new THREE.SphereGeometry(0.1, 8, 8);
      const jm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
      const j = new THREE.Mesh(jg, jm);
      j.position.set(Math.sin(i * 0.6) * 0.4, y, 0);
      arm.add(j);
      joints.push(j);
      y += h;
    }
    (arm as any).__joints = joints;
    group.add(arm);
    (group as any).__arm = arm;
    return; // early return, group already added
  }

  else if (id === "space") {
    // Stars
    const sp = new Float32Array(400 * 3);
    for (let i = 0; i < 400 * 3; i++) sp[i] = (Math.random() - 0.5) * 16;
    const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.55 })));
    // Planet wireframe
    add(new THREE.Mesh(new THREE.SphereGeometry(1.1, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.08 })));
    // Saturn ring
    const rg = new THREE.TorusGeometry(1.8, 0.04, 4, 90);
    const rm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(rg, rm); ring.rotation.x = Math.PI / 3.5;
    add(ring);
  }

  else if (id === "bio") {
    // Double helix
    const pts1: THREE.Vector3[] = [], pts2: THREE.Vector3[] = [];
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * Math.PI * 2 * 2.5;
      const y = (i / 100) * 4 - 2;
      pts1.push(new THREE.Vector3(Math.cos(t) * 0.7, y, Math.sin(t) * 0.7));
      pts2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 0.7, y, Math.sin(t + Math.PI) * 0.7));
    }
    [pts1, pts2].forEach(pts => {
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 })));
    });
    for (let i = 0; i < 100; i += 7) {
      const g = new THREE.BufferGeometry().setFromPoints([pts1[i], pts2[i]]);
      add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));
      [pts1[i], pts2[i]].forEach(p => {
        const sm = new THREE.Mesh(new THREE.SphereGeometry(0.04, 5, 5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        sm.position.copy(p); add(sm);
      });
    }
  }

  else if (id === "cyber") {
    // Hex grid
    for (let i = -4; i <= 4; i++) for (let j = -3; j <= 3; j++) {
      const g = new THREE.RingGeometry(0.22, 0.25, 6);
      const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 + Math.random() * 0.18, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(i * 0.56 + (j % 2) * 0.28, j * 0.50, (Math.random() - 0.5) * 0.4);
      add(mesh);
    }
    // Binary rain columns (vertical lines)
    for (let x = -2.5; x <= 2.5; x += 0.6) {
      const pts = [new THREE.Vector3(x, -2, 0), new THREE.Vector3(x, 2, 0)];
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const m = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 });
      add(new THREE.Line(g, m));
    }
  }

  else if (id === "zerog") {
    // Floating debris parts
    const parts: THREE.Mesh[] = [];
    const geos = () => [
      new THREE.BoxGeometry(0.15 + Math.random() * 0.2, 0.15 + Math.random() * 0.2, 0.05),
      new THREE.CylinderGeometry(0.06, 0.06, 0.35, 6),
      new THREE.OctahedronGeometry(0.12),
      new THREE.TetrahedronGeometry(0.14, 0),
    ];
    for (let i = 0; i < 26; i++) {
      const gList = geos();
      const g = gList[Math.floor(Math.random() * gList.length)];
      const m = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: Math.random() > 0.4, transparent: true, opacity: 0.35 + Math.random() * 0.45 });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      add(mesh);
      parts.push(mesh);
    }
    (group as any).__parts = parts;
  }
}

function animateScene(id: string, group: THREE.Group, frame: number, mX: number, mY: number) {
  if (id === "quantum") {
    group.rotation.y += 0.004;
    group.children.forEach((c, i) => {
      if (c instanceof THREE.Mesh) c.rotation.x += 0.008 + i * 0.001;
    });
  }
  if (id === "neural") {
    group.rotation.y += 0.003;
    group.children.forEach((c, i) => {
      if (c instanceof THREE.Mesh) {
        (c.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.abs(Math.sin(frame * 0.03 + i * 0.35)) * 0.5;
      }
    });
  }
  if (id === "holo") {
    group.children[0] && (group.children[0].rotation.y += 0.007);
    group.children[1] && (group.children[1].rotation.y -= 0.01, group.children[1].rotation.x += 0.005);
    group.children[2] && (group.children[2].rotation.z += 0.006);
  }
  if (id === "robotics") {
    const arm = (group as any).__arm as THREE.Group;
    if (arm) {
      arm.rotation.y += 0.005;
      const joints = (arm as any).__joints as THREE.Mesh[];
      joints?.forEach((j, i) => { j.scale.setScalar(0.9 + Math.abs(Math.sin(frame * 0.04 + i)) * 0.3); });
    }
  }
  if (id === "space") {
    group.rotation.y += 0.003;
    group.children.forEach((c, i) => { if (i > 0) c.rotation.y += 0.006; });
  }
  if (id === "bio") { group.rotation.y += 0.007; }
  if (id === "cyber") {
    group.children.forEach((c, i) => {
      if (c instanceof THREE.Mesh) {
        (c.material as THREE.MeshBasicMaterial).opacity = 0.05 + Math.abs(Math.sin(frame * 0.04 + i * 0.35)) * 0.22;
      }
    });
  }
  if (id === "zerog") {
    const parts = (group as any).__parts as THREE.Mesh[];
    parts?.forEach((p, i) => {
      p.position.y += Math.sin(frame * 0.012 + i) * 0.003;
      p.position.x += Math.cos(frame * 0.01 + i * 0.7) * 0.002;
      p.rotation.x += 0.007 + i * 0.001;
      p.rotation.y += 0.005 + i * 0.0008;
    });
  }
}

// ─── FACILITY 3D CANVAS ───────────────────────────────────────────────────────

function FacilityCanvas({ facilityId, active }: { facilityId: string; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mXRef = useRef(0), mYRef = useRef(0);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const W = el.clientWidth || 600, H = el.clientHeight || 600;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 300);
    camera.position.set(0, 0, 5);
    sceneRef.current = scene;
    cameraRef.current = camera;

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    buildScene(facilityId, scene, group);

    const onMM = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mXRef.current = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mYRef.current = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    el.addEventListener("mousemove", onMM);

    const loop = () => {
      animRef.current = requestAnimationFrame(loop);
      frameRef.current++;
      const mX = mXRef.current, mY = mYRef.current;
      group.rotation.y += (mX * 0.3 - group.rotation.y) * 0.05;
      group.rotation.x += (-mY * 0.2 - group.rotation.x) * 0.05;
      animateScene(facilityId, group, frameRef.current, mX, mY);
      camera.position.x += (mX * 0.25 - camera.position.x) * 0.04;
      camera.position.y += (-mY * 0.15 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("mousemove", onMM);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [facilityId]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

// ─── TICKER ───────────────────────────────────────────────────────────────────

function Ticker() {
  const items = FACILITIES.map(f => f.code + "  ·  " + f.short).join("   —   ");
  return (
    <div className="overflow-hidden whitespace-nowrap" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="inline-block py-2"
        style={{ fontSize: "9px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)" }}
      >
        {`${items}   —   ${items}   —   `}
      </motion.div>
    </div>
  );
}

// ─── CURSOR CROSSHAIR ─────────────────────────────────────────────────────────

function CrosshairCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 180, damping: 22 });
  const sy = useSpring(y, { stiffness: 180, damping: 22 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", opacity: visible ? 1 : 0 }}
      className="fixed pointer-events-none z-50 hidden md:block"
      transition={{ opacity: { duration: 0.2 } }}
    >
      {/* Outer ring */}
      <div
        className="absolute rounded-full"
        style={{ width: 32, height: 32, top: -16, left: -16, border: "1px solid rgba(255,255,255,0.25)" }}
      />
      {/* Cross hairs */}
      <div style={{ position: "absolute", width: 10, height: 1, background: "rgba(255,255,255,0.5)", top: -0.5, left: -5 }} />
      <div style={{ position: "absolute", width: 10, height: 1, background: "rgba(255,255,255,0.5)", top: -0.5, right: -5 }} />
      <div style={{ position: "absolute", height: 10, width: 1, background: "rgba(255,255,255,0.5)", left: -0.5, top: -5 }} />
      <div style={{ position: "absolute", height: 10, width: 1, background: "rgba(255,255,255,0.5)", left: -0.5, bottom: -5 }} />
      {/* Center dot */}
      <div style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: "white", top: -1.5, left: -1.5 }} />
    </motion.div>
  );
}

// ─── SIDEBAR NAV ──────────────────────────────────────────────────────────────

function SidebarNav({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <nav
      className="fixed top-0 right-0 h-screen flex flex-col justify-center z-40 hidden lg:flex"
      style={{ paddingRight: "28px", gap: "6px" }}
    >
      {FACILITIES.map((f, i) => (
        <button
          key={f.id}
          onClick={() => onSelect(i)}
          className="flex items-center gap-2 group"
          style={{ background: "none", border: "none", cursor: "crosshair" }}
        >
          <span
            className="transition-all duration-300"
            style={{
              fontSize: "8px",
              letterSpacing: "0.2em",
              color: active === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)",
              fontWeight: active === i ? 600 : 400,
            }}
          >
            {f.code}
          </span>
          <div
            className="transition-all duration-300 rounded-full"
            style={{
              width: active === i ? 20 : 4,
              height: active === i ? 2 : 2,
              background: active === i ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.18)",
            }}
          />
        </button>
      ))}
    </nav>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ height: "2px", background: "rgba(255,255,255,0.06)" }}
    >
      <motion.div
        style={{ width: `${progress * 100}%`, height: "100%", background: "rgba(255,255,255,0.55)" }}
        transition={{ type: "spring", stiffness: 60, damping: 14 }}
      />
    </div>
  );
}

// ─── NOISE TEXTURE OVERLAY ────────────────────────────────────────────────────

function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.028,
        mixBlendMode: "overlay",
      }}
    />
  );
}

// ─── FACILITY PANEL (full-screen) ─────────────────────────────────────────────

function FacilityPanel({
  facility, active, direction,
}: {
  facility: typeof FACILITIES[0];
  active: boolean;
  direction: number;
}) {
  const Icon = facility.icon;
  const lines = facility.name.split("\n");

  const panelVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 60 : -60,
      scale: 0.97,
    }),
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },  // ✅
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -60 : 60,
      scale: 0.97,
      transition: { duration: 0.5, ease: [0.4, 0, 1, 1] as const },        // ✅
    }),
  };

  const textStagger = {
    center: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  };

  const textItem = {
    enter: { opacity: 0, y: 28, skewY: 1.5 },
    center: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      key={facility.id}
      custom={direction}
      variants={panelVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0 grid"
      style={{ gridTemplateColumns: "1fr 1fr", cursor: "crosshair" }}
    >
      {/* ── LEFT: TYPOGRAPHY HALF ── */}
      <div
        className="relative flex flex-col justify-between p-10 md:p-16 overflow-hidden"
        style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Diagonal decorative line */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 55%)",
          }}
        />

        {/* Top bar */}
        <motion.div variants={textStagger} initial="enter" animate="center" exit="exit" className="flex items-center justify-between">
          <motion.div variants={textItem} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.6)" }} />
            </div>
            <span className="text-[8px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
              {facility.code}
            </span>
          </motion.div>
          <motion.div variants={textItem}>
            <span className="text-[8px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.18)" }}>
              {String(facility.index + 1).padStart(2, "0")} / {String(FACILITIES.length).padStart(2, "0")}
            </span>
          </motion.div>
        </motion.div>

        {/* Main name — giant diagonal-clipped type */}
        <motion.div variants={textStagger} initial="enter" animate="center" exit="exit" className="flex-1 flex flex-col justify-center py-8">
          {lines.map((line, li) => (
            <div key={li} className="overflow-hidden">
              <motion.h2
                variants={textItem}
                className="font-black tracking-tighter leading-none block"
                style={{
                  fontSize: "clamp(38px, 6.5vw, 88px)",
                  letterSpacing: "-0.04em",
                  color: li === 0 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.12)",
                  WebkitTextStroke: li === 1 ? "1px rgba(255,255,255,0.22)" : undefined,
                  marginBottom: li === 0 ? "0.05em" : 0,
                }}
              >
                {line}
              </motion.h2>
            </div>
          ))}

          {/* Tagline */}
          <motion.p
            variants={textItem}
            className="mt-5 text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            — {facility.tagline}
          </motion.p>
        </motion.div>

        {/* Body text */}
        <motion.div variants={textStagger} initial="enter" animate="center" exit="exit" className="space-y-6">
          <motion.p
            variants={textItem}
            className="text-sm leading-relaxed font-light max-w-sm"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {facility.body}
          </motion.p>

          {/* Spec numbers — horizontal strip */}
          <motion.div variants={textItem} className="flex gap-6 pt-2">
            {facility.numbers.map(n => (
              <div key={n.u}>
                <div
                  className="font-black"
                  style={{ fontSize: "clamp(18px,2vw,28px)", letterSpacing: "-0.04em", lineHeight: 1 }}
                >
                  {n.v}
                </div>
                <div className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
                  {n.u}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div variants={textItem} className="flex items-center gap-4 pt-1">
            <button
              className="flex items-center gap-2 group"
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", cursor: "crosshair" }}
            >
              <span className="text-[9px] tracking-widest uppercase transition-colors group-hover:text-white">Explore lab</span>
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.15)" }} />
            <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
              24/7 access
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* ── RIGHT: 3D CANVAS HALF ── */}
      <div className="relative overflow-hidden" style={{ background: "rgba(0,0,0,0.2)" }}>
        {/* Full-bleed 3D */}
        <div style={{ position: "absolute", inset: 0 }}>
          <FacilityCanvas facilityId={facility.scene} active={active} />
        </div>

        {/* Vignette edges */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to left, transparent 50%, rgba(0,0,0,0.2) 100%)" }} />

        {/* Corner code label */}
        <div
          className="absolute bottom-6 left-6 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
        >
          <span className="text-[8px] tracking-[0.28em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
            Interactive 3D · drag to rotate
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── GRID OVERVIEW MODAL ──────────────────────────────────────────────────────

function GridOverview({
  onSelect, onClose,
}: {
  onSelect: (i: number) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 overflow-auto"
      style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(16px)" }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-60 flex items-center gap-2"
        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "crosshair" }}
      >
        <X className="w-4 h-4" />
        <span className="text-[9px] tracking-widest uppercase">Close</span>
      </button>

      <div className="p-12 pt-20">
        <p className="text-[8px] tracking-[0.4em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>All Facilities</p>
        <h2 className="font-black tracking-tighter mb-12" style={{ fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-0.035em" }}>
          8 Labs. Infinite Potential.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FACILITIES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.button
                key={f.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => { onSelect(i); onClose(); }}
                className="text-left group p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  cursor: "crosshair",
                }}
                whileHover={{ borderColor: "rgba(255,255,255,0.22)", backgroundColor: "rgba(255,255,255,0.05)" } as any}
              >
                <div className="flex items-start justify-between mb-6">
                  <Icon className="w-5 h-5" style={{ color: "rgba(255,255,255,0.55)" }} />
                  <span className="text-[8px] tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>{f.code}</span>
                </div>
                <div className="font-black tracking-tight" style={{ fontSize: "clamp(15px,1.6vw,20px)", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
                  {f.name.replace("\n", " ")}
                </div>
                <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>{f.tagline}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN EXPERIENCE ──────────────────────────────────────────────────────────

export default function FacilitiesExperience() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const lastScroll = useRef(0);
  const throttle = useRef(false);

  const goTo = useCallback((i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(Math.max(0, Math.min(FACILITIES.length - 1, i)));
  }, [current]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Wheel navigation
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (throttle.current) return;
      throttle.current = true;
      setTimeout(() => { throttle.current = false; }, 800);
      if (e.deltaY > 0) next(); else prev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setShowGrid(false);
      if (e.key === "g") setShowGrid(v => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch
  const touchStart = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStart.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 40) { if (delta > 0) next(); else prev(); }
  };

  const progress = (current) / (FACILITIES.length - 1);

  return (
    <div
      className="relative bg-black text-white overflow-hidden"
      style={{ height: "100vh", cursor: "crosshair" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <CrosshairCursor />
      <NoiseOverlay />

      {/* Fixed BG grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)" }} />

      {/* Ticker */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Ticker />
      </div>

      {/* Sidebar nav */}
      <SidebarNav active={current} onSelect={goTo} />

      {/* Progress bar */}
      <ProgressBar progress={progress} />

      {/* Main panel area */}
      <div className="relative" style={{ height: "100vh", zIndex: 10 }}>
        {/* Ticker spacer */}
        <div style={{ height: "30px" }} />

        {/* Full-screen panel stack */}
        <div className="relative" style={{ height: "calc(100vh - 30px)" }}>
          <AnimatePresence custom={direction} mode="wait">
            <FacilityPanel
              key={FACILITIES[current].id}
              facility={FACILITIES[current]}
              active
              direction={direction}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom UI bar */}
      <div
        className="fixed bottom-4 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-14"
        style={{ pointerEvents: "none" }}
      >
        {/* Prev / Next */}
        <div className="flex items-center gap-3" style={{ pointerEvents: "auto" }}>
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-4 py-2 rounded-full text-[9px] tracking-widest uppercase transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: current === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
              cursor: current === 0 ? "default" : "crosshair",
            }}
          >
            ← Prev
          </button>
          <button
            onClick={next}
            disabled={current === FACILITIES.length - 1}
            className="px-4 py-2 rounded-full text-[9px] tracking-widest uppercase transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: current === FACILITIES.length - 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
              cursor: current === FACILITIES.length - 1 ? "default" : "crosshair",
            }}
          >
            Next →
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {FACILITIES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? 20 : 5,
                height: 5,
                borderRadius: 3,
                background: i === current ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.18)",
                transition: "all 0.3s ease",
                border: "none",
                cursor: "crosshair",
                pointerEvents: "auto",
              }}
            />
          ))}
        </div>

        {/* Grid toggle */}
        <button
          onClick={() => setShowGrid(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-[9px] tracking-widest uppercase transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
            pointerEvents: "auto",
            cursor: "crosshair",
          }}
        >
          <Crosshair className="w-3 h-3" />
          All Labs
        </button>
      </div>

      {/* Grid Overview modal */}
      <AnimatePresence>
        {showGrid && (
          <GridOverview onSelect={goTo} onClose={() => setShowGrid(false)} />
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="fixed bottom-16 left-8 md:left-14 z-40 hidden md:flex items-center gap-2"
        style={{ pointerEvents: "none" }}
      >
        <ArrowDown className="w-3 h-3" style={{ color: "rgba(255,255,255,0.15)" }} />
        <span className="text-[8px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>
          Scroll or ↑↓ to navigate
        </span>
      </motion.div>
    </div>
  );
}