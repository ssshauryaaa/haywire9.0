"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home",         href: "/" },
  { label: "About Us",     href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Features",   href: "/features" },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [open,       setOpen]       = useState(false);
  const [mousePos,   setMousePos]   = useState({ x: 0, y: 0 });
  const [isHovered,  setIsHovered]  = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <>
      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileDropdown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
        }
        .nav-root {
          animation: navSlideDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .mobile-dropdown {
          animation: mobileDropdown 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .nav-active-dot {
          animation: glowPulse 2s ease-in-out infinite;
        }
        @media (max-width: 767px) {
          .mobile-menu-btn  { display: flex !important; align-items: center; justify-content: center; }
          .nav-links-wrap   { display: none !important; }
          .nav-cta-wrap     { display: none !important; }
          .nav-divider-line { display: none !important; }
        }
      `}</style>

      {/* ── Wrapper ── */}
      <div
        className="nav-root"
        style={{
          position: "fixed", top: "20px", left: 0, right: 0,
          zIndex: 1000, display: "flex", justifyContent: "center",
          padding: "0 24px", pointerEvents: "none",
        }}
      >
        {/* ── Pill ── */}
        <div
          ref={navRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            pointerEvents: "all",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            padding: "8px 10px 8px 22px",
            borderRadius: "999px",
            overflow: "hidden",
            background: scrolled
              ? "rgba(0,0,0,0.92)"
              : "rgba(0,0,0,0.72)",
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
            border: "1px solid rgba(255,255,255,0.13)",
            boxShadow: scrolled
              ? "0 8px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.14)"
              : "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
            transition: "background 0.4s ease, box-shadow 0.4s ease",
            maxWidth: "860px",
            width: "100%",
          }}
        >
          {/* Cursor-tracked glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "inherit",
            opacity: isHovered ? 1 : 0, transition: "opacity 0.3s ease",
            background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px,
              rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 45%, transparent 70%)`,
          }} />

          {/* Edge shimmer */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "inherit",
            opacity: isHovered ? 1 : 0, transition: "opacity 0.3s ease",
            background: `radial-gradient(160px circle at ${mousePos.x}px ${mousePos.y}px,
              rgba(255,255,255,0.22) 0%, transparent 65%)`,
            mixBlendMode: "overlay",
          }} />

          {/* Top border highlight */}
          <div style={{
            position: "absolute", top: 0, left: "15%", right: "15%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            borderRadius: "1px", pointerEvents: "none",
          }} />

          {/* ── Logo ── */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-orbitron, monospace)",
              fontSize: "1.05rem", fontWeight: 900, textDecoration: "none",
              letterSpacing: "-0.02em", color: "#fff",
              flexShrink: 0, position: "relative", zIndex: 1, lineHeight: 1,
              display: "flex", alignItems: "center", gap: "2px",
            }}
          >
            SS<span style={{ color: "#888" }}>2040</span>
          </Link>

          {/* Divider */}
          <div
            className="nav-divider-line"
            style={{ width: 1, height: 18, background: "rgba(255,255,255,0.18)", flexShrink: 0, marginLeft: "10px" }}
          />

          {/* ── Desktop links ── */}
          <ul
            className="nav-links-wrap"
            style={{
              display: "flex", gap: "2px", listStyle: "none",
              margin: 0, padding: 0, flex: 1, justifyContent: "center",
              position: "relative", zIndex: 1,
            }}
          >
            {links.map((l) => (
              <li key={l.href}>
                <NavLink href={l.href} label={l.label} active={mounted && pathname === l.href} />
              </li>
            ))}
          </ul>

          {/* ── CTA ── */}
          <div className="nav-cta-wrap" style={{ position: "relative", zIndex: 1 }}>
            <CTAButton />
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setOpen(!open)}
            className="mobile-menu-btn"
            style={{
              background: open ? "rgba(255,255,255,0.1)" : "none",
              border: "none", cursor: "pointer",
              padding: "7px", color: "#fff", position: "relative", zIndex: 1,
              display: "none", borderRadius: "50%",
              transition: "background 0.2s ease",
            }}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {open && (
        <div
          className="mobile-dropdown"
          style={{
            position: "fixed", top: "76px", left: "20px", right: "20px",
            zIndex: 999,
            background: "rgba(0,0,0,0.97)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            borderRadius: "22px",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
            padding: "10px",
            display: "flex", flexDirection: "column", gap: "2px",
          }}
        >
          {/* Top highlight */}
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
            borderRadius: "1px",
          }} />

          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--font-syne, sans-serif)",
                fontSize: "0.88rem", fontWeight: 600,
                color: mounted && pathname === l.href ? "#fff" : "#bbb",
                textDecoration: "none",
                padding: "13px 18px",
                borderRadius: "14px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: mounted && pathname === l.href ? "rgba(255,255,255,0.07)" : "transparent",
                transition: "background 0.2s ease, color 0.2s ease",
                animationDelay: `${i * 0.05}s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => {
                e.currentTarget.style.background = mounted && pathname === l.href ? "rgba(255,255,255,0.07)" : "transparent";
                e.currentTarget.style.color = mounted && pathname === l.href ? "#fff" : "#bbb";
              }}
            >
              {l.label}
              {mounted && pathname === l.href && (
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", opacity: 0.7 }} />
              )}
            </Link>
          ))}

          <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "4px 0" }} />

          <Link
            href="/facilities"
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "var(--font-orbitron, monospace)",
              fontSize: "0.68rem", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              textDecoration: "none",
              padding: "14px 18px", borderRadius: "14px",
              background: "#fff", color: "#000", textAlign: "center",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.88)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
          >
            Explore Facilities
          </Link>
        </div>
      )}
    </>
  );
}

// ── NavLink with active state ──────────────────────────────────────────────────
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isActive = active || hovered;

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontFamily: "var(--font-syne, sans-serif)",
        fontSize: "0.73rem", fontWeight: 600,
        letterSpacing: "0.05em", textTransform: "uppercase",
        textDecoration: "none",
        padding: "7px 14px", borderRadius: "999px",
        color: isActive ? "#fff" : "#aaa",
        background: isActive ? "rgba(255,255,255,0.11)" : "transparent",
        transition: "all 0.22s ease",
        whiteSpace: "nowrap", position: "relative",
      }}
    >
      {active && (
        <span
          className="nav-active-dot"
          style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff", flexShrink: 0, opacity: 0.7 }}
        />
      )}
      {label}
    </Link>
  );
}

// ── CTA Button ────────────────────────────────────────────────────────────────
function CTAButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href="/facilities"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontFamily: "var(--font-orbitron, monospace)",
        fontSize: "0.67rem", fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        textDecoration: "none",
        padding: "9px 22px", borderRadius: "999px",
        background: hovered
          ? "linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 100%)"
          : "#000",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: hovered
          ? "0 0 22px rgba(255,255,255,0.22), 0 0 44px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15)"
          : "0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        transition: "all 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        whiteSpace: "nowrap",
      }}
    >
      Explore
      <span style={{ opacity: hovered ? 1 : 0.5, transition: "opacity 0.2s", fontSize: "0.8em" }}>→</span>
    </Link>
  );
}