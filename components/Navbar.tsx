"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Facilities", href: "/features" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
      {/* Outer positioning — centers the pill */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          padding: "0 24px",
          pointerEvents: "none",
        }}
      >
        {/* Floating pill */}
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
            padding: "10px 12px 10px 20px",
            borderRadius: "999px",
            overflow: "hidden",
            background: scrolled
              ? "rgba(255, 255, 255, 0.88)"
              : "rgba(255, 255, 255, 0.68)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(79, 70, 229, 0.18)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(49,46,129,0.14), 0 2px 8px rgba(49,46,129,0.06), inset 0 1px 0 rgba(255,255,255,0.9)"
              : "0 4px 24px rgba(49,46,129,0.09), inset 0 1px 0 rgba(255,255,255,0.8)",
            transition: "background 0.4s ease, box-shadow 0.4s ease",
            maxWidth: "820px",
            width: "100%",
          }}
        >
          {/* ── Cursor-tracked glow (clipped by overflow:hidden on pill) ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: "inherit",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.25s ease",
              background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px,
                rgba(79,70,229,0.14) 0%,
                rgba(244,63,94,0.07) 45%,
                transparent 70%)`,
            }}
          />

          {/* ── Edge shimmer that follows cursor ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: "inherit",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.25s ease",
              background: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px,
                rgba(79,70,229,0.28) 0%,
                transparent 65%)`,
              mixBlendMode: "multiply",
            }}
          />

          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: "1.05rem",
              fontWeight: 900,
              textDecoration: "none",
              letterSpacing: "-0.02em",
              color: "#4F46E5",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
              lineHeight: 1,
            }}
          >
            SS<span style={{ color: "#0F172A" }}>2040</span>
          </Link>

          {/* Divider */}
          <div
            className="nav-divider"
            style={{
              width: 1,
              height: 18,
              background: "rgba(79,70,229,0.15)",
              flexShrink: 0,
              marginLeft: "8px",
            }}
          />

          {/* Desktop nav links */}
          <ul
            className="nav-links"
            style={{
              display: "flex",
              gap: "2px",
              listStyle: "none",
              margin: 0,
              padding: 0,
              flex: 1,
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {links.map((l) => (
              <li key={l.href}>
                <NavLink href={l.href} label={l.label} />
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="nav-cta" style={{ position: "relative", zIndex: 1 }}>
            <CTAButton />
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="mobile-menu-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "#4F46E5",
              position: "relative",
              zIndex: 1,
              display: "none",
              borderRadius: "50%",
              transition: "background 0.2s ease",
            }}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "78px",
            left: "24px",
            right: "24px",
            zIndex: 99,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "20px",
            border: "1px solid rgba(79,70,229,0.12)",
            boxShadow: "0 16px 48px rgba(49,46,129,0.13)",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#0F172A",
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: "12px",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(79,70,229,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ height: 1, background: "rgba(79,70,229,0.08)", margin: "4px 0" }} />
          <Link
            href="/features"
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "13px 16px",
              borderRadius: "12px",
              background: "#4F46E5",
              color: "#fff",
              textAlign: "center",
            }}
          >
            Explore
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
          .nav-links { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-divider { display: none !important; }
        }
      `}</style>
    </>
  );
}

/* ── Individual nav link with pill hover ── */
function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        fontFamily: "var(--font-syne), sans-serif",
        fontSize: "0.76rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        textDecoration: "none",
        padding: "7px 14px",
        borderRadius: "999px",
        color: hovered ? "#4F46E5" : "#64748B",
        background: hovered ? "rgba(79,70,229,0.08)" : "transparent",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Link>
  );
}

/* ── CTA pill — Indigo → Rose gradient on hover ── */
function CTAButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href="/features"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        fontFamily: "var(--font-orbitron), monospace",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        textDecoration: "none",
        padding: "9px 22px",
        borderRadius: "999px",
        background: hovered
          ? "linear-gradient(135deg, #4F46E5 0%, #F43F5E 100%)"
          : "#4F46E5",
        color: "#fff",
        boxShadow: hovered
          ? "0 0 20px rgba(79,70,229,0.5), 0 0 40px rgba(244,63,94,0.18)"
          : "0 2px 10px rgba(79,70,229,0.35)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        transition: "all 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        whiteSpace: "nowrap",
      }}
    >
      Explore
    </Link>
  );
}