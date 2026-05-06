/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import * as THREE from "three";
import { useRouter } from "next/navigation";

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────

// function CustomCursor() {
//   const x = useMotionValue(-100),
//     y = useMotionValue(-100);
//   const sx = useSpring(x, { stiffness: 220, damping: 24 });
//   const sy = useSpring(y, { stiffness: 220, damping: 24 });
//   const [big, setBig] = useState(false);
//   useEffect(() => {
//     const mv = (e: MouseEvent) => {
//       x.set(e.clientX);
//       y.set(e.clientY);
//     };
//     const ov = (e: MouseEvent) => {
//       if ((e.target as Element)?.closest("button,a,[data-cursor]"))
//         setBig(true);
//     };
//     const ou = (e: MouseEvent) => {
//       if ((e.target as Element)?.closest("button,a,[data-cursor]"))
//         setBig(false);
//     };
//     window.addEventListener("mousemove", mv);
//     window.addEventListener("mouseover", ov);
//     window.addEventListener("mouseout", ou);
//     return () => {
//       window.removeEventListener("mousemove", mv);
//       window.removeEventListener("mouseover", ov);
//       window.removeEventListener("mouseout", ou);
//     };
//   }, [x, y]);
//   return (
//     <motion.div
//       style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
//       className="fixed pointer-events-none z-[999] hidden md:block mix-blend-difference"
//     >
//       <motion.div
//         animate={{ scale: big ? 3 : 1 }}
//         transition={{ duration: 0.22 }}
//         style={{
//           width: 10,
//           height: 10,
//           borderRadius: "50%",
//           background: "white",
//         }}
//       />
//     </motion.div>
//   );
// }

// ─── NOISE OVERLAY ────────────────────────────────────────────────────────────

function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.032,
        mixBlendMode: "overlay",
      }}
    />
  );
}

// ─── MOUSE GLOW ───────────────────────────────────────────────────────────────

function MouseGlow() {
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 18 });
  const sy = useSpring(y, { stiffness: 60, damping: 18 });
  useEffect(() => {
    const mv = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, [x, y]);
  return (
    <motion.div className="pointer-events-none fixed inset-0 z-0">
      <motion.div
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.045) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

// ─── SECTION 1: MARQUEE ───────────────────────────────────────────────────────

function MarqueeStatement() {
  const words = [
    "Imagine ·",
    "Learn ·",
    "Build ·",
    "Break ·",
    "Invent ·",
    "Repeat ·",
  ];
  return (
    <section
      className="overflow-hidden border-b"
      style={{ borderColor: "rgba(255,255,255,0.07)", padding: "60px 0" }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex items-center whitespace-nowrap"
      >
        {[...words, ...words].map((w, i) => (
          <span
            key={i}
            className="font-black tracking-tighter flex-shrink-0"
            style={{
              fontSize: "clamp(52px, 8vw, 100px)",
              letterSpacing: "-0.04em",
              paddingRight: "0.5em",
              color:
                i % 2 === 0
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.07)",
              WebkitTextStroke:
                i % 2 !== 0 ? "1px rgba(255,255,255,0.18)" : undefined,
            }}
          >
            {w}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

// ─── SECTION 2: DAY IN THE LIFE (horizontal drag scroll cards) ────────────────

const days = [
  {
    time: "08:00",
    label: "Morning",
    title: "Your smart AI tutor prepares you for the day.",
    sub: "It noticed what you struggled with yesterday and completely updated your lessons overnight to help you learn better today.",
  },
  {
    time: "09:30",
    label: "Lab",
    title: "You run a program on a real quantum computer.",
    sub: "This is not a practice test. It is a real, advanced machine, and you are working on it live with your classmates in Seoul.",
  },
  {
    time: "11:00",
    label: "Studio",
    title: "A massive 3D hologram of a human heart fills the room.",
    sub: "You can reach out and rotate it with your hands to study it closely. The AI explains the parts to you, and you don't even need a VR headset.",
  },
  {
    time: "13:00",
    label: "Workshop",
    title: "You build your very first robotic part in Week 3.",
    sub: "With the help of your smart AI partner and our advanced tools, you create real, working hardware even if you have never built anything before.",
  },
  {
    time: "15:30",
    label: "Research",
    title: "Your science project gets chosen for a real science journal.",
    sub: "The biology experiment you ran in the lab last month created something entirely new, and the school helps you share it with the world.",
  },
  {
    time: "19:00",
    label: "Night",
    title: "You stop a live cyber attack in the digital arena.",
    sub: "You are competing safely against six other schools. When you fix the problem, your score instantly pops up on the global leaderboard.",
  },
];

function DayInTheLifeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeftStart.current = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  return (
    <section ref={ref} style={{ padding: "120px 0" }}>
      <div style={{ padding: "0 clamp(20px,5vw,80px)", marginBottom: "60px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "1px",
                background: "rgba(255,255,255,0.4)",
              }}
            />
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              A Day at Smart School
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(32px,5vw,64px)",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            Not a school day.
            <br />
            <span
              style={{
                color: "rgba(255,255,255,0.12)",
                WebkitTextStroke: "1px rgba(255,255,255,0.2)",
              }}
            >
              A research sprint.
            </span>
          </h2>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        style={{
          overflowX: "auto",
          paddingBottom: "20px",
          scrollbarWidth: "none",
          cursor: "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            padding: "0 clamp(20px,5vw,80px)",
            width: "max-content",
          }}
        >
          {days.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.08,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              data-cursor
              style={{
                width: "280px",
                flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "32px 28px",
                background: "rgba(255,255,255,0.018)",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 0.3s, transform 0.3s",
              }}
              whileHover={
                { borderColor: "rgba(255,255,255,0.22)", y: -6 } as any
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "28px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {d.time}
                </span>
                <span
                  style={{
                    fontSize: "8px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.22)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "3px 8px",
                    borderRadius: "999px",
                  }}
                >
                  {d.label}
                </span>
              </div>
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.04)",
                  lineHeight: 1,
                  position: "absolute",
                  bottom: "8px",
                  right: "16px",
                  letterSpacing: "-0.05em",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1.35,
                  marginBottom: "14px",
                  letterSpacing: "-0.01em",
                }}
              >
                {d.title}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.38)",
                  lineHeight: 1.75,
                  fontWeight: 300,
                }}
              >
                {d.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: "8px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.16)",
          marginTop: "24px",
        }}
      >
        ← drag to explore →
      </p>
    </section>
  );
}

// ─── SECTION 3: THEN vs NOW comparison ───────────────────────────────────────

const comparisons = [
  {
    old: "Learning from an outdated textbook.",
    now: "A smart curriculum that updates itself every single day.",
  },
  {
    old: "Raising your hand and waiting for help.",
    now: "A personal AI tutor ready to answer you instantly.",
  },
  {
    old: "Waiting weeks to book a basic lab.",
    now: "Instant, 24/7 access to the world's most advanced computers.",
  },
  {
    old: "Waiting until graduation to use your skills.",
    now: "Building real products and filing patents in your very first term.",
  },
];

function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="border-t border-b"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "120px clamp(20px,5vw,80px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 48px 1fr",
            paddingBottom: "24px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "0",
          }}
        >
          <span
            style={{
              fontSize: "8px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            Education in 2024
          </span>
          <div />
          <span
            style={{
              fontSize: "8px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Smart School 2040
          </span>
        </div>
        {comparisons.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: i * 0.12, duration: 0.8 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 48px 1fr",
              alignItems: "center",
              padding: "36px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p
              style={{
                fontSize: "clamp(13px,1.4vw,17px)",
                color: "rgba(255,255,255,0.22)",
                fontWeight: 300,
                lineHeight: 1.5,
                textDecoration: "line-through",
                textDecorationColor: "rgba(255,255,255,0.1)",
              }}
            >
              {c.old}
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ delay: i * 0.12 + 0.2, duration: 0.5 }}
                style={{
                  width: "1px",
                  height: "40px",
                  background: "rgba(255,255,255,0.15)",
                  transformOrigin: "top",
                }}
              />
            </div>
            <p
              style={{
                fontSize: "clamp(13px,1.4vw,17px)",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {c.now}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION 4: GLOBE ────────────────────────────────────────────────────────

function WorldCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth || 600,
      H = el.clientHeight || 480;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    camera.position.set(0, 0, 5);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(2, 40, 40),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.04,
      }),
    );
    scene.add(globe);

    const dotCount = 1200,
      dotPos = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(1 - 2 * Math.random()),
        theta = Math.random() * Math.PI * 2,
        r = 2.015;
      dotPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dotPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dotPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(dotPos, 3),
    );
    scene.add(
      new THREE.Points(
        dotGeo,
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.013,
          transparent: true,
          opacity: 0.45,
        }),
      ),
    );

    const pingGroup = new THREE.Group();
    for (let i = 0; i < 22; i++) {
      const phi = Math.acos(1 - 2 * Math.random()),
        theta = Math.random() * Math.PI * 2,
        r = 2.04;
      const pos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.03, 0.055, 12),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
        }),
      );
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      pingGroup.add(ring);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      );
      dot.position.copy(pos);
      pingGroup.add(dot);
    }
    scene.add(pingGroup);
    scene.add(
      new THREE.Mesh(
        new THREE.TorusGeometry(2.1, 0.004, 6, 140),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.16,
        }),
      ),
    );

    let mX = 0,
      mY = 0,
      frame = 0,
      animId: number;
    const onMM = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    el.addEventListener("mousemove", onMM);
    const loop = () => {
      animId = requestAnimationFrame(loop);
      frame++;
      globe.rotation.y += 0.0012;
      pingGroup.rotation.y += 0.0012;
      pingGroup.children.forEach((c, i) => {
        if (c instanceof THREE.Mesh && c.geometry.type === "RingGeometry") {
          const s = 1 + 0.4 * Math.abs(Math.sin(frame * 0.03 + i * 0.8));
          c.scale.setScalar(s);
          (c.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - (s - 1));
        }
      });
      camera.position.x += (mX * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (-mY * 0.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    loop();
    const onR = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onR);
    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize", onR);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

function GlobalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const globeY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const locations = [
    "Tokyo",
    "Lagos",
    "São Paulo",
    "Mumbai",
    "Oslo",
    "Seoul",
    "Cairo",
    "Vancouver",
  ];

  return (
    <section ref={ref} style={{ padding: "120px 0" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(20px,5vw,80px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "1px",
                background: "rgba(255,255,255,0.4)",
              }}
            />
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              72 Countries · Live Now
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(28px,4vw,54px)",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            The classroom has no walls. The campus has no country.
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.85,
              fontWeight: 300,
              marginBottom: "40px",
              maxWidth: "400px",
            }}
          >
            Right now, 12,000 students across 72 countries are in the same lab,
            running the same simulation, on the same machine.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {locations.map((loc, i) => (
              <motion.div
                key={loc}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                style={{
                  padding: "5px 14px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "999px",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.48)",
                  letterSpacing: "0.08em",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.6)",
                    display: "inline-block",
                  }}
                />
                {loc}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ y: globeY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              position: "relative",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              overflow: "hidden",
              background: "rgba(0,0,0,0.3)",
              height: "480px",
            }}
          >
            <WorldCanvas />
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                padding: "6px 14px",
                background: "rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "999px",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  fontSize: "7px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Live · 12,000 Active
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SECTION 5: PRINCIPLES ────────────────────────────────────────────────────

const principles = [
  {
    n: "I",
    title: "Curiosity is the Only Requirement.",
    body: "You do not need to be an expert to use an advanced computer on your first day. We care about where you are going, not where you started.",
  },
  {
    n: "II",
    title: "Build Real Things from Day One.",
    body: "Every project you do here is a real, working model. We don't just write reports. You will create things that move, think, and actually work in the real world.",
  },
  {
    n: "III",
    title: "Learn From Every Mistake.",
    body: "Our smart AI looks at your mistakes and failed experiments, then changes your lessons to help you understand better. Here, every error is just helpful data.",
  },
  {
    n: "IV",
    title: "The Future Will Not Wait.",
    body: "Our students invent new tools, publish real research, and start companies before they even finish school. The world is moving fast, and so are we.",
  },
];

function PrinciplesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="border-t"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "120px clamp(20px,5vw,80px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "80px" }}
        >
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            How We Think
          </span>
        </motion.div>
        {principles.map((p, i) => (
          <motion.div
            key={p.n}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: i * 0.13,
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 1fr",
              gap: "40px",
              padding: "48px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              alignItems: "start",
            }}
          >
            <span
              style={{
                fontSize: "clamp(24px,2.5vw,38px)",
                fontWeight: 900,
                color: "rgba(255,255,255,0.07)",
                letterSpacing: "-0.04em",
                fontStyle: "italic",
              }}
            >
              {p.n}
            </span>
            <h3
              style={{
                fontSize: "clamp(17px,2vw,26px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {p.title}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.85,
                fontWeight: 300,
              }}
            >
              {p.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION 6: LIVE SIGNAL FEED ─────────────────────────────────────────────

function SignalStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 2200);
    return () => clearInterval(t);
  }, []);

  const signals = [
    { label: "Student patent filed", value: "Just now", live: true },
    {
      label: "Quantum circuits run today",
      value: `${(tick * 3 + 47).toLocaleString()}`,
      live: false,
    },
    {
      label: "AI tutor sessions active",
      value: `${(tick % 12) + 2841}`,
      live: true,
    },
    {
      label: "Holographic hours this week",
      value: `${(tick * 7 + 1204).toLocaleString()}`,
      live: false,
    },
    { label: "Countries online", value: "72", live: false },
    {
      label: "Papers under peer review",
      value: `${(tick % 3) + 94}`,
      live: true,
    },
  ];

  return (
    <section
      ref={ref}
      style={{
        background: "rgba(255,255,255,0.012)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "60px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(20px,5vw,80px)",
        }}
      >
        <div
          style={{
            marginBottom: "36px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "white",
              animation: "livepulse 1.4s infinite",
            }}
          />
          <span
            style={{
              fontSize: "8px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            Live Signal Feed
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          {signals.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.09, duration: 0.6 }}
              style={{
                background: "#0A0A0A",
                padding: "28px 24px",
                position: "relative",
              }}
            >
              {s.live && (
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "white",
                    opacity: 0.7,
                    animation: "livepulse 1.4s infinite",
                  }}
                />
              )}
              <div
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.22)",
                  marginBottom: "12px",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: "clamp(18px,2vw,28px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {s.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`@keyframes livepulse{0%,100%{opacity:1}50%{opacity:0.18}}`}</style>
    </section>
  );
}

// ─── SECTION 7: CTA ───────────────────────────────────────────────────────────

function CTASection() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.93, 1]);

  return (
    <section
      ref={ref}
      style={{
        padding: "160px clamp(20px,5vw,80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        style={{ scale, textAlign: "center", maxWidth: "800px" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        <div
          style={{
            fontSize: "8px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            marginBottom: "40px",
          }}
        >
          Class of 2049 · Applications Open
        </div>
        <div style={{ overflow: "hidden", marginBottom: "6px" }}>
          <motion.h2
            initial={{ y: 80 }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              fontSize: "clamp(52px,10vw,128px)",
              fontWeight: 900,
              letterSpacing: "-0.045em",
              lineHeight: 0.92,
              margin: 0,
            }}
          >
            The future
          </motion.h2>
        </div>
        <div style={{ overflow: "hidden", marginBottom: "48px" }}>
          <motion.h2
            initial={{ y: 80 }}
            animate={inView ? { y: 0 } : {}}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.22,
            }}
            style={{
              fontSize: "clamp(52px,10vw,128px)",
              fontWeight: 900,
              letterSpacing: "-0.045em",
              lineHeight: 0.92,
              color: "rgba(255,255,255,0.1)",
              WebkitTextStroke: "1px rgba(255,255,255,0.2)",
              margin: 0,
            }}
          >
            is enrolling.
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.33)",
            fontWeight: 300,
            lineHeight: 1.85,
            maxWidth: "380px",
            margin: "0 auto 56px",
          }}
        >
          No prerequisites. No gatekeeping. Just curiosity and a willingness to
          build things that haven&apos;t been built before.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.6 }}
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            data-cursor
            onClick={() => router.push("/about")}
            style={{
              padding: "16px 48px",
              background: "white",
              color: "black",
              border: "none",
              borderRadius: "999px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: "none",
              transition: "transform 0.25s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.06)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            About the Program
          </button>
          <button
            data-cursor
            onClick={() => router.push("/features")}
            style={{
              padding: "16px 48px",
              background: "transparent",
              color: "rgba(255,255,255,0.42)",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "999px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: "none",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
              e.currentTarget.style.color = "rgba(255,255,255,0.42)";
            }}
          >
            Explore Features
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── SPLINE LOADER ────────────────────────────────────────────────────────────

function LoadingText() {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const t = setInterval(
      () => setDots((d) => (d.length >= 3 ? "" : d + ".")),
      420,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span
        style={{
          fontSize: "9px",
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          fontWeight: 600,
          minWidth: "160px",
          textAlign: "center",
        }}
      >
        Loading 3D Model{dots}
      </span>
      <span
        style={{
          fontSize: "7px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)",
        }}
      >
        Smart School 2040
      </span>
    </div>
  );
}

function SplineEmbed() {
  const [loaded, setLoaded] = useState(false);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    // Wait until page is idle before mounting the iframe
    const useIdle = typeof requestIdleCallback !== 'undefined';
    const id = useIdle
      ? requestIdleCallback(() => setShouldMount(true), { timeout: 2000 })
      : setTimeout(() => setShouldMount(true), 1000);
    return () => {
      if (useIdle) {
        cancelIdleCallback(id as number);
      } else {
        clearTimeout(id as number);
      }
    };
  }, []);

  useEffect(() => {
    if (!shouldMount) return;
    const timer = setTimeout(() => setLoaded(true), 4000);
    return () => clearTimeout(timer);
  }, [shouldMount]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "480px" }}>
      {/* Loader */}
      <motion.div
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", pointerEvents: loaded ? "none" : "auto", background: "#0A0A0A" }}
      >
        <div style={{ position: "relative", width: "48px", height: "48px" }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", borderTopColor: "rgba(255,255,255,0.7)" }} />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: "8px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", borderBottomColor: "rgba(255,255,255,0.35)" }} />
        </div>
        <LoadingText />
      </motion.div>

      {/* Only render iframe after page is idle */}
      {shouldMount && (
        <iframe
          src="https://my.spline.design/hanastarterfile-WE78OsCR6rUGkiUggYdsOkoW-jD9/"
          frameBorder="0"
          allow="autoplay; fullscreen; vr"
          onLoad={() => setLoaded(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block", opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease" }}
          title="Smart School 2040"
        />
      )}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });
  useEffect(() => {
    const mv = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, [x, y]);

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
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.6,
        }}
      />
      {/* Radial vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse at center, transparent 20%, #0A0A0A 90%)",
        }}
      />
      {/* Mouse glow */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <motion.div
          style={{
            x: sx,
            y: sy,
            translateX: "-50%",
            translateY: "-50%",
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Spline embed with loader */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "0",
          width: "80%",
          height: "80%",
          zIndex: 10,
          pointerEvents: "auto",
          transform: "translate(-1%, 12%)",
        }}
      >
        <SplineEmbed />
      </div>

      {/* Text overlay — right side */}
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
              border: "0.5px solid rgba(255,255,255,0.15)",
              padding: "0.3rem 0.9rem",
              borderRadius: "999px",
            }}
          >
            Est. 2040
          </span>
        </motion.div>
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
            letterSpacing: "-0.03em",
          }}
        >
          2040
        </motion.h1>
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
          Imagine a school where technology transforms every classroom into an
          interactive, intelligent, and immersive learning space.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          style={{ marginTop: "2.5rem" }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontSize: "8px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.22)",
              }}
            >
              Scroll
            </span>
            <div
              style={{
                width: "1px",
                height: "36px",
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div
      className="relative min-h-screen text-white overflow-x-hidden"
      style={{ background: "#0A0A0A" }}
    >
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* <CustomCursor /> */}
      <NoiseOverlay />
      <MouseGlow />

      {/* Persistent bg grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <div className="relative" style={{ zIndex: 10 }}>
        <HeroSection />
        <MarqueeStatement />
        <DayInTheLifeSection />
        <ComparisonSection />
        <GlobalSection />
        <PrinciplesSection />
        <SignalStrip />
        <CTASection />
      </div>
    </div>
  );
}