/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import * as THREE from "three";

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@300;400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #000; }
    input, textarea {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 10px;
      padding: 12px 16px;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 300;
      width: 100%;
      outline: none;
      transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
      resize: none;
      -webkit-appearance: none;
    }
    input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18); }
    input:focus, textarea:focus {
      border-color: rgba(255,255,255,0.30);
      background: rgba(255,255,255,0.07);
      box-shadow: 0 0 0 3px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08);
    }
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 100px #000 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes twinkle { 0%,100%{opacity:.08;} 50%{opacity:.75;} }
    @keyframes pulse-ring { 0%{transform:scale(1);opacity:.55;} 100%{transform:scale(2.6);opacity:0;} }
  `}</style>
);

// ─── Starfield ────────────────────────────────────────────────────────────────
// FIX: Stars are generated inside useEffect (client-only) to prevent the
// SSR/client Math.random() mismatch that caused the React hydration error.
function Starfield() {
  const [stars, setStars] = useState<
    Array<{ id: number; x: number; y: number; s: number; d: number; delay: number }>
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 110 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 1.3 + 0.2,
        d: Math.random() * 4 + 2.5,
        delay: Math.random() * 7,
      }))
    );
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            borderRadius: "50%",
            background: "#fff",
            animation: `twinkle ${s.d}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Lamp Bot ─────────────────────────────────────────────────────────────────
function LampBot() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRotRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.clientWidth, H = el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, W / H, 0.1, 100);
    camera.position.set(0, 0.2, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    // ── Lights ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambient);

    const rim = new THREE.DirectionalLight(0xffffff, 0.55);
    rim.position.set(-3, 5, -4);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0xffffff, 0.3);
    fill.position.set(2, 2, 3);
    scene.add(fill);

    // ── SPOTLIGHT — pivot lives in world space, synced to lens each frame ──
    const spotPivot = new THREE.Object3D();
    scene.add(spotPivot);

    const spot = new THREE.SpotLight(0xffffff, 320, 40, Math.PI / 8, 0.25, 1.0);
    spot.castShadow = true;
    spot.shadow.mapSize.set(2048, 2048);
    spot.shadow.camera.near = 0.1;
    spot.shadow.camera.far = 40;
    spot.shadow.bias = -0.001;
    spotPivot.add(spot);

    // Target sits 12 units forward along pivot's local +Z
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0, 12);
    spotPivot.add(spotTarget);
    spot.target = spotTarget;

    // ── Materials ──
    const white  = new THREE.MeshStandardMaterial({ color: 0xd0d2d8, metalness: 0.88, roughness: 0.16 });
    const dark   = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, metalness: 0.97, roughness: 0.06 });
    const mid    = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.9,  roughness: 0.22 });
    const glow   = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.8, roughness: 0, metalness: 0 });
    const dimGl  = new THREE.MeshStandardMaterial({ color: 0x999999, emissive: 0xffffff, emissiveIntensity: 0.22, roughness: 0.3, metalness: 0.5 });
    const visorM = new THREE.MeshStandardMaterial({ color: 0x040404, metalness: 1.0, roughness: 0.0 });
    const lensM  = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 4.0,
      roughness: 0, metalness: 0, transparent: true, opacity: 0.88, side: THREE.DoubleSide,
    });

    // ── Robot root ──
    const root = new THREE.Group();
    root.scale.setScalar(0.42);
    scene.add(root);

    // BASE
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.65, 0.16, 32), dark);
    base.position.y = -2.5;
    base.castShadow = true;
    root.add(base);

    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.535, 0.022, 8, 40), dimGl);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -2.42;
    root.add(baseRing);

    // STEM
    const stemMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 1.6, 16), mid);
    stemMesh.position.y = -1.62;
    stemMesh.castShadow = true;
    root.add(stemMesh);

    for (const y of [-0.88, -1.46]) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.02, 8, 24), dark);
      r.rotation.x = Math.PI / 2;
      r.position.y = y;
      root.add(r);
    }

    // BALL JOINT
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.155, 20, 20), dark);
    ball.position.y = -0.78;
    root.add(ball);

    // HEAD GROUP
    const headGroup = new THREE.Group();
    headGroup.position.y = -0.08;
    root.add(headGroup);

    // ── LENS PIVOT — anchor for world-space spotlight sync ──
    // Exactly where the lens ring sits in headGroup local space
    const lensPivot = new THREE.Object3D();
    lensPivot.position.set(0, 0.32, 0.53);
    headGroup.add(lensPivot);

    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.92, 0.86), white);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    for (const y of [0.462, -0.462]) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.034, 0.88), dark);
      s.position.y = y;
      headGroup.add(s);
    }
    for (const x of [-0.768, 0.768]) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.92, 0.88), dark);
      s.position.x = x;
      headGroup.add(s);
    }

    // VISOR
    const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.36, 0.065), visorM);
    visorMesh.position.set(0, 0.02, 0.465);
    headGroup.add(visorMesh);

    for (const y of [0.21, -0.158]) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.01, 0.065), dimGl);
      line.position.set(0, y, 0.465);
      headGroup.add(line);
    }

    // EYES
    const eyeGeo = new THREE.SphereGeometry(0.076, 22, 22);
    const lEye = new THREE.Mesh(eyeGeo, glow);
    lEye.position.set(-0.28, 0.02, 0.508);
    headGroup.add(lEye);
    const rEye = new THREE.Mesh(eyeGeo, glow);
    rEye.position.set(0.28, 0.02, 0.508);
    headGroup.add(rEye);

    const elL = new THREE.PointLight(0xffffff, 0.6, 0.7);
    elL.position.set(-0.28, 0.02, 0.7);
    headGroup.add(elL);
    const elR = new THREE.PointLight(0xffffff, 0.6, 0.7);
    elR.position.set(0.28, 0.02, 0.7);
    headGroup.add(elR);

    // LAMP LENS
    const lensBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.33, 0.26, 32, 1, true), lensM);
    lensBody.rotation.x = -Math.PI / 2;
    lensBody.position.set(0, 0.32, 0.4);
    headGroup.add(lensBody);

    const lensCap = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), lensM);
    lensCap.position.set(0, 0.32, 0.27);
    headGroup.add(lensCap);

    const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.02, 10, 40), dimGl);
    lensRing.rotation.x = Math.PI / 2;
    lensRing.position.set(0, 0.32, 0.53);
    headGroup.add(lensRing);

    const lensPointLight = new THREE.PointLight(0xffffff, 1.0, 1.2);
    lensPointLight.position.set(0, 0.32, 0.68);
    headGroup.add(lensPointLight);

    // ANTENNA
    const antStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.3, 8), mid);
    antStem.position.set(0.25, 0.66, 0.05);
    headGroup.add(antStem);
    const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 14, 14), glow);
    antTip.position.set(0.25, 0.83, 0.05);
    headGroup.add(antTip);

    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.034, 12), dark);
    port.rotation.z = Math.PI / 2;
    port.position.set(0.778, 0.06, 0.05);
    headGroup.add(port);

    // ── Floor — raised to y=-2.2 so the beam can reach it ──
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.95, metalness: 0.0 }),
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -2.2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // ── Mouse tracking ──
    const onMouse = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseRef.current = {
        x:  ((e.clientX - r.left) / r.width)  * 2 - 1,
        y: -((e.clientY - r.top)  / r.height) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", onMouse);

    // ── Reusable math objects — allocated ONCE outside animate() to avoid GC ──
    const _worldPos   = new THREE.Vector3();
    const _worldQuat  = new THREE.Quaternion();
    const _worldScale = new THREE.Vector3();

    // SPOTLIGHT FIX:
    // lensPivot's local +Z points forward out of the lens aperture.
    // The SpotLight shines toward spotTarget at local (0,0,12).
    // Without correction, copying the raw world quaternion makes the beam
    // shoot in the wrong direction as the robot rotates with the mouse.
    // This -90° X rotation converts Three's Y-up SpotLight convention
    // to our Z-forward lens convention so the beam always fires out the front.
    const _lensOffsetQuat = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));

    let t = 0, blinkT = 0, blinking = false;

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.016;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      currentRotRef.current.y += (mx * 0.36 - currentRotRef.current.y) * 0.055;
      currentRotRef.current.x += (-my * 0.18 - currentRotRef.current.x) * 0.055;

      root.rotation.y = currentRotRef.current.y;
      root.rotation.x = currentRotRef.current.x;
      root.position.y = Math.sin(t * 1.05) * 0.06;

      // Must update world matrices before reading lensPivot.matrixWorld
      root.updateMatrixWorld(true);

      // Decompose lens pivot's world transform
      lensPivot.matrixWorld.decompose(_worldPos, _worldQuat, _worldScale);

      // Place spotlight at the lens position
      spotPivot.position.copy(_worldPos);

      // Apply axis correction so beam fires forward out of the lens
      spotPivot.quaternion.copy(_worldQuat).multiply(_lensOffsetQuat);

      spotPivot.updateMatrixWorld(true);

      // Blink
      blinkT += 0.016;
      if (!blinking && blinkT > 3.5 + Math.random() * 2.5) {
        blinking = true;
        blinkT = 0;
        lEye.scale.y = 0.04;
        rEye.scale.y = 0.04;
        setTimeout(() => {
          lEye.scale.y = 1;
          rEye.scale.y = 1;
          blinking = false;
        }, 95);
      }

      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", minHeight: "100vh" }} />;
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  label, name, type = "text", value, onChange, placeholder, required, rows,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string; required?: boolean; rows?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.26)" }}>
        {label}
      </label>
      {rows ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} />
      )}
    </div>
  );
}

// ─── Glass Submit Button ──────────────────────────────────────────────────────
function GlassButton({ loading }: { loading: boolean }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        position: "relative", width: "100%", padding: "14px 0", borderRadius: 100,
        border: "none", cursor: loading ? "not-allowed" : "pointer", overflow: "hidden",
        background: "transparent", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
        fontWeight: 500, letterSpacing: "0.03em",
        color: hover ? "#fff" : "rgba(255,255,255,0.8)",
        transition: "color 0.3s cubic-bezier(0.22, 1, 0.36, 1), transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: active ? "scale(0.97) translateY(1px)" : hover ? "scale(1.02) translateY(-2px)" : "scale(1) translateY(0)",
        outline: "none",
      }}
    >
      <span style={{ position: "absolute", inset: 0, borderRadius: "inherit", backdropFilter: "blur(30px) saturate(1.8)", WebkitBackdropFilter: "blur(30px) saturate(1.8)", background: hover ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.06)", transition: "background 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }} />
      <span style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "50%", borderRadius: "0 0 60% 60%", background: `linear-gradient(180deg, rgba(255,255,255,${hover ? 0.26 : 0.16}) 0%, transparent 100%)`, pointerEvents: "none", transition: "all 0.22s ease" }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "inherit", border: `1px solid rgba(255,255,255,${hover ? 0.3 : 0.13})`, transition: "border-color 0.22s ease", pointerEvents: "none" }} />
      <span style={{ position: "absolute", inset: 1, borderRadius: "inherit", border: "1px solid rgba(255,255,255,0.06)", pointerEvents: "none" }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "inherit", opacity: hover ? 1 : 0, transition: "opacity 0.4s ease", boxShadow: hover ? "0 10px 30px rgba(255,255,255,0.08), 0 0 20px rgba(255,255,255,0.06)" : "none", pointerEvents: "none" }} />
      <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {loading ? (
          <>
            <span style={{ width: 12, height: 12, border: "1.5px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.75s linear infinite" }} />
            Transmitting…
          </>
        ) : (
          <>
            Send Message
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: hover ? "translateX(5px)" : "translateX(0)", transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}>
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </span>
    </button>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp 0.8s ease both" }}>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 16 }}>
        01 — Contact
      </p>
      <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.9rem, 2.8vw, 2.6rem)", fontWeight: 300, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.08, marginBottom: 8 }}>
        Join us<br />
        <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.32)" }}>SS2040</em>
      </h2>
      <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.6, color: "rgba(255,255,255,0.26)", marginBottom: 32 }}>
        Drop a message — we respond within 24 hours.
      </p>

      {sent ? (
        <div style={{ padding: "28px 24px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
          <div style={{ fontSize: 20, color: "#fff", marginBottom: 10 }}>✓</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontWeight: 300 }}>Message received. We'll be in touch.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Name"  name="name"  value={form.name}  onChange={onChange} placeholder="Alex Rivera" required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} placeholder="alex@co.io" required />
          </div>
          <Field label="Subject" name="subject" value={form.subject} onChange={onChange} placeholder="What's on your mind?" required />
          <Field label="Message" name="message" value={form.message} onChange={onChange} placeholder="Tell us about your vision…" required rows={4} />
          <div style={{ marginTop: 4 }}>
            <GlassButton loading={sending} />
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
      <GlobalStyles />
      <main style={{ position: "relative", display: "flex", minHeight: "100vh", width: "100%", overflow: "hidden", background: "#000", fontFamily: "'DM Sans', sans-serif" }}>
        <Starfield />

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.72) 100%)" }} />

        <div style={{ position: "absolute", left: "50%", top: "8%", bottom: "8%", width: 1, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.06) 75%, transparent)", pointerEvents: "none", zIndex: 1 }} />

        {/* LEFT — Robot */}
        <div style={{ width: "50%", position: "relative", zIndex: 1 }}>
          <LampBot />
          <div style={{ position: "absolute", bottom: "9%", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", whiteSpace: "nowrap" }}>
            <span style={{ position: "relative", width: 6, height: 6, display: "inline-block" }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#fff", animation: "pulse-ring 1.7s ease-out infinite" }} />
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#fff" }} />
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)" }}>
              Get in touch
            </span>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div style={{ width: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", position: "relative", zIndex: 2 }}>
          <ContactForm />
        </div>
      </main>
    </>
  );
}