/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import * as THREE from "three";
import {
  Hexagon,
  Cog,
  Globe,
  Microscope,
  TrendingUp,
  Award,
  Users,
  Zap,
  Cpu,
  Brain,
  Rocket,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";

import { useRouter } from "next/navigation";


const stats = [
  {
    num: 20,
    suffix: "40",
    label: "Est. Year",
    icon: Award,
    detail: "Founded as a fully digital-native institution",
  },
  {
    num: 12,
    suffix: "K+",
    label: "Students",
    icon: Users,
    detail: "From 72 countries",
  },
  {
    num: 300,
    suffix: "+",
    label: "Faculty & AI",
    icon: Zap,
    detail: "Human + synthetic educators",
  },
  {
    num: 98,
    suffix: "%",
    label: "Grad Success",
    icon: TrendingUp,
    detail: "Placement or venture within 6 months",
  },
];

const pillars = [
  {
    num: "01",
    title: "AI-Based Personalized Learning",
    icon: Hexagon,
    desc: "AI systems create personalized learning plans based on each student's pace and goals.",
    longDesc:
      "Learning is no longer the same for everyone. Our AI systems design personalized learning paths for each student. They adjust the difficulty level in real time, provide the right study materials, and offer continuous support. This helps every student understand concepts clearly and progress at their own pace.",
  },
  {
    num: "02",
    title: "Robotics and Practical Learning",
    icon: Cog,
    desc: "Students gain hands-on experience by building and working with robotic systems.",
    longDesc:
      "Students do more than just study theory, they apply it in real situations. They work with robots and automated systems to solve problems and build projects. Basic robotics is part of the curriculum, helping students connect classroom learning with real-world applications.",
  },
  {
    num: "03",
    title: "Global Connected Classrooms",
    icon: Globe,
    desc: "Students learn and collaborate with others around the world in real time.",
    longDesc:
      "Distance is no longer a barrier. Students can interact with classmates from different countries through advanced communication technologies. They can work on projects together, take part in discussions, and learn from global perspectives, making education more connected and diverse.",
  },
  {
    num: "04",
    title: "Innovation and Research Focus",
    icon: Microscope,
    desc: "Students focus on creating real projects instead of only memorizing theory.",
    longDesc:
      "The focus is on creating and applying knowledge. Instead of only writing exams, students work on projects, research, or even start their own ideas. The school supports them in turning their work into real outcomes such as prototypes, research papers, or startups.",
  },
];

const milestones = [
  {
    year: "2038",
    title: "Foundation Established",
    desc: "The school’s vision and structure are officially approved by a global group of education and technology experts.",
  },
  {
    year: "2040",
    title: "First Student Batch",
    desc: "The school welcomes its first 500 students from 12 countries into a modern, technology-driven learning environment.",
  },
  {
    year: "2042",
    title: "AI Teaching Integration",
    desc: "Advanced AI systems are introduced as teaching assistants, supporting students with personalized guidance and instruction.",
  },
  {
    year: "2045",
    title: "Virtual Campus Launch",
    desc: "A fully interactive virtual campus is introduced, allowing students to learn through VR and AR from anywhere.",
  },
  {
    year: "2048",
    title: "Quantum Learning Program",
    desc: "The school partners with technology leaders to provide students access to advanced quantum computing systems.",
  },
];

const testimonials = [
  {
    text: "The AI system quickly identified my learning gaps and helped me improve even before I realized my mistakes. It felt like having a personal mentor available at all times.",
    author: "Priya M., Class of '38",
    role: "Lead AI Architect, DeepMind",
  },
  {
    text: "I built my first drone prototype in the lab, and it later grew into a funded startup. This school goes beyond teaching theory—it helps turn ideas into real projects.",
    author: "Kai L., Class of '39",
    role: "Founder & CEO, AerialSense",
  },
  {
    text: "Learning with students from different countries in real time changed my perspective. It helped me better understand global issues and think beyond borders.",
    author: "Sofia R., Class of '39",
    role: "UN Youth Ambassador for Tech Policy",
  },
];

const techStack = [
  { name: "Quantum Computing Systems", icon: Cpu },
  { name: "Brain-Computer Interfaces", icon: Brain },
  { name: "3D Holographic Learning Environments", icon: Rocket },
  { name: "Autonomous Robotics Systems", icon: Sparkles },
];


function AnimatedCounter({
  target,
  suffix,
  active,
}: {
  target: number;
  suffix: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, active]);
  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}


function NeuralGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const W = mountRef.current.clientWidth;
    const H = mountRef.current.clientHeight;

    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    camera.position.set(0, 0, 4.5);

    
    const globeGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    
    const dotCount = 900;
    const dotPositions: number[] = [];
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(1 - 2 * Math.random());
      const theta = Math.random() * Math.PI * 2;
      const r = 1.6;
      dotPositions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(dotPositions, 3),
    );
    const dotMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.012,
      transparent: true,
      opacity: 0.55,
    });
    scene.add(new THREE.Points(dotGeo, dotMat));

    
    const nodeGroup = new THREE.Group();
    const nodeCount = 28;
    const nodes: {
      mesh: THREE.Mesh;
      angle: number;
      radius: number;
      speed: number;
      yOffset: number;
    }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const size = 0.022 + Math.random() * 0.04;
      const geo = new THREE.SphereGeometry(size, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6 + Math.random() * 0.4,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1.3;
      const yOff = (Math.random() - 0.5) * 2.5;
      const speed =
        (0.003 + Math.random() * 0.007) * (Math.random() > 0.5 ? 1 : -1);
      mesh.position.set(
        Math.cos(angle) * radius,
        yOff,
        Math.sin(angle) * radius,
      );
      nodeGroup.add(mesh);
      nodes.push({ mesh, angle, radius, speed, yOffset: yOff });
    }
    scene.add(nodeGroup);

    const linesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.07,
    });
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    function rebuildLines() {
      linesGroup.clear();
      const positions = nodes.map((n) => n.mesh.position.clone());
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          if (positions[i].distanceTo(positions[j]) < 1.1) {
            const geo = new THREE.BufferGeometry().setFromPoints([
              positions[i],
              positions[j],
            ]);
            linesGroup.add(new THREE.Line(geo, linesMat));
          }
        }
      }
    }
    rebuildLines();

    // ── Inner pulsing core
    const coreGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // ── Outer glow ring (torus)
    const ringGeo = new THREE.TorusGeometry(1.65, 0.005, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.003, 8, 120),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
      }),
    );
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // ── Mouse interaction
    let mouseX = 0,
      mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mountRef.current.addEventListener("mousemove", onMouseMove);

    // ── Animation loop
    let frame = 0;
    let rebuildTimer = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;
      rebuildTimer++;

      // Rotate globe
      globe.rotation.y += 0.0008;
      globe.rotation.x += 0.0002;

      // Orbit nodes
      nodes.forEach((n) => {
        n.angle += n.speed;
        n.mesh.position.x = Math.cos(n.angle) * n.radius;
        n.mesh.position.z = Math.sin(n.angle) * n.radius;
        n.mesh.position.y =
          n.yOffset + Math.sin(frame * 0.012 + n.angle) * 0.15;
      });

      // Rebuild lines every 40 frames
      if (rebuildTimer > 40) {
        rebuildLines();
        rebuildTimer = 0;
      }

      // Pulse core
      const pulse = 0.85 + Math.sin(frame * 0.04) * 0.15;
      core.scale.setScalar(pulse);
      coreMat.opacity = 0.7 + Math.sin(frame * 0.04) * 0.3;

      // Rings spin
      ring.rotation.z += 0.002;
      ring2.rotation.z += 0.003;
      ring2.rotation.x += 0.001;

      // Camera follow mouse gently
      camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      mountRef.current?.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full"
      style={{
        height: "520px",
        cursor: "grab",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    />
  );
}

function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Floating particles
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.4,
      life: Math.random(),
    }));

    let animId: number;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      // Subtle gradient orbs
      const grad1 = ctx.createRadialGradient(
        W * 0.15,
        H * 0.2,
        0,
        W * 0.15,
        H * 0.2,
        W * 0.35,
      );
      grad1.addColorStop(0, "rgba(255,255,255,0.025)");
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, W, H);

      const grad2 = ctx.createRadialGradient(
        W * 0.85,
        H * 0.8,
        0,
        W * 0.85,
        H * 0.8,
        W * 0.3,
      );
      grad2.addColorStop(0, "rgba(255,255,255,0.02)");
      grad2.addColorStop(1, "transparent");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, W, H);

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.003;
        if (p.y < -10 || p.life > 1) {
          p.x = Math.random() * W;
          p.y = H + 10;
          p.life = 0;
        }
        const alpha = p.opacity * Math.sin(p.life * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
    };
    draw();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}


function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDir] = useState(0);
  const next = () => {
    setDir(1);
    setIndex((i) => (i + 1) % testimonials.length);
  };
  const prev = () => {
    setDir(-1);
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -80 }),
  };

  return (
    <div
      className="relative border border-white/10 rounded-3xl p-10 md:p-16 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      {/* Decorative huge quote */}
      <span
        className="absolute top-0 left-6 text-white/[0.03] font-black select-none pointer-events-none"
        style={{
          fontSize: "220px",
          lineHeight: 1,
          fontFamily: "Georgia, serif",
        }}
      >
        &quot;
      </span>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <Quote className="w-6 h-6 text-white/20 mx-auto mb-8" />
          <p className="text-xl md:text-2xl leading-relaxed text-white/65 italic font-light mb-8">
            "{testimonials[index].text}"
          </p>
          <p className="text-sm font-semibold text-white/85 tracking-wide">
            {testimonials[index].author}
          </p>
          <p className="text-xs text-white/35 mt-1 tracking-widest uppercase">
            {testimonials[index].role}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center transition-all duration-200 hover:bg-white/5"
        >
          <ChevronLeft className="w-4 h-4 text-white/60" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDir(i > index ? 1 : -1);
                setIndex(i);
              }}
              className="transition-all duration-300 rounded-full bg-white/30"
              style={{
                width: i === index ? "24px" : "6px",
                height: "6px",
                opacity: i === index ? 1 : 0.3,
              }}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-9 h-9 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center transition-all duration-200 hover:bg-white/5"
        >
          <ChevronRight className="w-4 h-4 text-white/60" />
        </button>
      </div>
    </div>
  );
}


export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [countersActive, setCountersActive] = useState(false);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  useEffect(() => {
    if (statsInView) setCountersActive(true);
  }, [statsInView]);


  const fadeUp = {
    hidden: { opacity: 0, y: 48 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.88 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const, 
      },
    },
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const router = useRouter();
  return (
    <div
      ref={pageRef}
      className="relative min-h-screen bg-black text-white overflow-x-hidden"
    >
      
      <BackgroundCanvas />


      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
        }}
      />

      
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      
      <div className="relative" style={{ zIndex: 10 }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: "1280px",
            paddingLeft: "clamp(20px, 5vw, 80px)",
            paddingRight: "clamp(20px, 5vw, 80px)",
          }}
        >
          
          <motion.section
            style={{ y: heroY, opacity: heroOpacity }}
            className="pt-32 pb-24 text-center"
          >
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              
              <div
                className="inline-flex items-center gap-3 border border-white/12 rounded-full px-5 py-2 mb-10 backdrop-blur-md"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[9px] tracking-[0.35em] uppercase text-white/50">
                  The Future of Education — Est. 2040
                </span>
              </div>

              
              <h1
                className="font-black tracking-tighter leading-none mb-8"
                style={{
                  fontSize: "clamp(72px, 12vw, 160px)",
                  letterSpacing: "-0.04em",
                }}
              >
                <span className="text-white block">Smart</span>
                <span className="text-white block">School</span>
                <span
                  className="block"
                  style={{
                    color: "rgba(255,255,255,0.1)",
                    WebkitTextStroke: "1px rgba(255,255,255,0.15)",
                  }}
                >
                  2040.
                </span>
              </h1>

              
              <div
                className="w-20 h-px mb-8"
                style={{ background: "rgba(255,255,255,0.2)" }}
              />

              <p
                className="max-w-lg text-base leading-relaxed font-light mb-12"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                A fully immersive, AI-driven campus where every student develops as a creator, critical thinker, and leader—supported by advanced technologies designed to enhance learning.
              </p>

              
              <div className="flex gap-4 flex-wrap justify-center">
                <button
                  onClick={() => router.push("/features")}
                  className="px-10 py-3.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300"
                  style={{ letterSpacing: "0.2em" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.transform = "scale(1)";
                  }}
                >
                  Explore Features →
                </button>
                <button
                  onClick={() => router.push("/facilities")}
                  className="px-10 py-3.5 border border-white/20 text-white/55 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:border-white/45 hover:text-white"
                >
                  Our Facilities
                </button>
              </div>
            </motion.div>
          </motion.section>

          
      

          
          <motion.div
            ref={statsRef}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.3)" }}
                className="group relative border border-white/8 rounded-2xl p-8 text-center cursor-default overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  transition: "all 0.35s ease",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
                  }}
                />

                <stat.icon
                  className="w-7 h-7 mx-auto mb-4 transition-colors duration-300"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                />

                <div
                  className="font-black leading-none mb-2"
                  style={{
                    fontSize: "clamp(28px, 4vw, 44px)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  <AnimatedCounter
                    target={stat.num}
                    suffix={stat.suffix}
                    active={countersActive}
                  />
                </div>

                <div
                  className="text-[9px] tracking-[0.25em] uppercase mb-1"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {stat.label}
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  {stat.detail}
                </div>
              </motion.div>
            ))}
          </motion.div>

          
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-32"
          >
            <div className="flex items-center gap-4 mb-8">
              <span
                className="h-px w-10"
                style={{ background: "rgba(255,255,255,0.35)" }}
              />
              <span
                className="text-[9px] tracking-[0.35em] uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Our Mission
              </span>
            </div>
            <p
              className="font-light leading-tight mb-10"
              style={{
                fontSize: "clamp(24px, 4vw, 44px)",
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "-0.01em",
                maxWidth: "800px",
              }}
            >
              Smart School 2040 runs on a{" "}
              <span className="text-white font-semibold">
                hybrid intelligence model
              </span>{" "}
              — human teachers collaborate with AI tutors to deliver
              personalised, project-based lessons that prepare students for a
              world not yet imagined.
            </p>
          </motion.div>

          
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-32"
          >
            <div className="flex items-center gap-4 mb-4">
              <span
                className="h-px w-10"
                style={{ background: "rgba(255,255,255,0.35)" }}
              />
              <span
                className="text-[9px] tracking-[0.35em] uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Core Pillars
              </span>
            </div>
            <h2
              className="font-black tracking-tighter mb-3"
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                letterSpacing: "-0.03em",
              }}
            >
              Four Engines of
            </h2>
            <h2
              className="font-black tracking-tighter mb-16"
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.15)",
                WebkitTextStroke: "1px rgba(255,255,255,0.2)",
              }}
            >
              the Future.
            </h2>

            {/* 2×2 grid with shared borders */}
            <div className="border border-white/8 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {pillars.map((p, idx) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    viewport={{ once: true }}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    className="group relative p-10 md:p-12 cursor-default"
                    style={{
                      borderRight:
                        idx % 2 === 0
                          ? "1px solid rgba(255,255,255,0.07)"
                          : "none",
                      borderBottom:
                        idx < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    
                    <span
                      className="absolute top-6 right-8 font-black pointer-events-none"
                      style={{
                        fontSize: "80px",
                        color: "rgba(255,255,255,0.04)",
                        lineHeight: 1,
                      }}
                    >
                      {p.num}
                    </span>

                    
                    <div
                      className="w-12 h-12 rounded-xl border flex items-center justify-center mb-7 transition-all duration-300 group-hover:border-white/35"
                      style={{
                        borderColor: "rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      <p.icon
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      />
                    </div>

                    <h3
                      className="text-sm font-bold uppercase tracking-widest mb-3 transition-colors duration-300 group-hover:text-white"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed font-light transition-colors duration-300 group-hover:text-white/55"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {p.longDesc}
                    </p>

                    
                    <div
                      className="absolute bottom-0 left-0 h-px w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-32"
          >
            <div className="text-center mb-16">
              <span
                className="text-[9px] tracking-[0.35em] uppercase block mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Our Journey
              </span>
              <h2
                className="font-black tracking-tighter"
                style={{
                  fontSize: "clamp(36px, 6vw, 72px)",
                  letterSpacing: "-0.03em",
                }}
              >
                Milestones to 2040
              </h2>
            </div>

            
            <div className="relative">
              
              <div
                className="absolute hidden md:block top-0 bottom-0"
                style={{
                  left: "50%",
                  width: "1px",
                  background:
                    "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)",
                  transform: "translateX(-50%)",
                }}
              />

              <div className="space-y-10">
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-col`}
                  >
                    {/* Card */}
                    <div className="md:w-[calc(50%-32px)] w-full">
                      <motion.div
                        whileHover={{
                          borderColor: "rgba(255,255,255,0.3)",
                          y: -4,
                        }}
                        className="border border-white/8 rounded-2xl p-8 cursor-default"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <div
                          className="font-black mb-1"
                          style={{
                            fontSize: "clamp(32px, 5vw, 52px)",
                            color: "rgba(255,255,255,0.12)",
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {m.year}
                        </div>
                        <div className="text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">
                          {m.title}
                        </div>
                        <div
                          className="text-xs font-light leading-relaxed"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {m.desc}
                        </div>
                      </motion.div>
                    </div>

                    {/* Dot */}
                    <div
                      className="hidden md:flex flex-none items-center justify-center"
                      style={{ width: "64px" }}
                    >
                      <div
                        className="w-3 h-3 rounded-full bg-white"
                        style={{
                          boxShadow:
                            "0 0 0 4px rgba(0,0,0,1), 0 0 0 5px rgba(255,255,255,0.25), 0 0 20px rgba(255,255,255,0.3)",
                        }}
                      />
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block md:w-[calc(50%-32px)]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ════ TECH STACK ════════════════════════════════════ */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-32"
          >
            <div className="text-center mb-16">
              <span
                className="text-[9px] tracking-[0.35em] uppercase block mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Tech at Core
              </span>
              <h2
                className="font-black tracking-tighter"
                style={{
                  fontSize: "clamp(36px, 6vw, 72px)",
                  letterSpacing: "-0.03em",
                }}
              >
                Powered by Next‑Gen Tools
              </h2>
            </div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {techStack.map((tech) => (
                <motion.div
                  key={tech.name}
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.04,
                    borderColor: "rgba(255,255,255,0.25)",
                    y: -6,
                  }}
                  className="group text-center p-10 rounded-2xl border border-white/8 cursor-default relative overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.01)",
                    transition: "all 0.35s ease",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.06), transparent 70%)",
                    }}
                  />
                  <tech.icon
                    className="w-10 h-10 mx-auto mb-4 transition-colors duration-300 group-hover:text-white"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  />
                  <p
                    className="text-[10px] font-bold tracking-[0.18em] uppercase transition-colors duration-300 group-hover:text-white/80"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {tech.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-32"
          >
            <div className="text-center mb-16">
              <span
                className="text-[9px] tracking-[0.35em] uppercase block mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Voices
              </span>
              <h2
                className="font-black tracking-tighter"
                style={{
                  fontSize: "clamp(36px, 6vw, 72px)",
                  letterSpacing: "-0.03em",
                }}
              >
                What Students Say
              </h2>
            </div>
            <TestimonialCarousel />
          </motion.section>

          {/* ════ FINAL CTA ═════════════════════════════════════ */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center pb-32 border-t border-white/8 pt-20"
          >
            <h2
              className="font-black tracking-tighter mb-4"
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                letterSpacing: "-0.03em",
              }}
            >
              Ready to Step Into
            </h2>
            <h2
              className="font-black tracking-tighter mb-6"
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.15)",
                WebkitTextStroke: "1px rgba(255,255,255,0.2)",
              }}
            >
              the Future?
            </h2>
            <p
              className="text-sm font-light mb-10"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Applications open for Class of 2040.
            </p>
            <button
              onClick={() => router.push("/contact")}
              className="px-14 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.25em] rounded-full border-none transition-all duration-300"
              onMouseEnter={(e) => {
                const el = e.target as HTMLElement;
                el.style.transform = "scale(1.06)";
                el.style.background = "rgba(255,255,255,0.88)";
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLElement;
                el.style.transform = "scale(1)";
                el.style.background = "#fff";
              }}
            >
              Contact us
            </button>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
