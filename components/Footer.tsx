"use client";
import Link from "next/link";
import { X, Mail, MapPin, Globe, Send, Terminal, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Architecture", href: "/architecture" },
        { label: "Terminals", href: "/terminals" },
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

  return (
    <footer
      style={{
        background: "#000000",
        borderTop: "1px solid #222",
        padding: "4rem 2rem 2rem",
        color: "#888",
        position: "relative",
        zIndex: 10,
        fontFamily: "monospace, sans-serif",
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin3d {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        .hover-link { transition: all 0.3s ease; }
        .hover-link:hover { color: #fff; transform: translateX(4px); }
        .hover-link:hover .arrow-icon { opacity: 1 !important; transform: translate(2px, -2px); }
        
        .social-icon { transition: all 0.3s ease; }
        .social-icon:hover { background: #fff !important; color: #000 !important; transform: translateY(-3px); box-shadow: 0 4px 12px rgba(255,255,255,0.2); }
        
        .input-focus:focus { outline: none; border-color: #fff !important; }
        .btn-hover { transition: all 0.3s ease; }
        .btn-hover:hover { background: #ccc !important; transform: scale(1.02); }

        .cube-face {
          position: absolute; width: 100%; height: 100%;
          border: 1px solid rgba(255,255,255,0.4);
          background: rgba(0,0,0,0.8);
        }
      `}} />

      <div style={{ maxWidth: "75rem", margin: "0 auto" }}>

        {/* Top Section: Brand & Newsletter */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",   // ✅ fixed alignment
          gap: "2rem",
          marginBottom: "3rem",
          paddingBottom: "2rem",
          borderBottom: "1px solid #111"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}>
              <div style={{ perspective: "400px", width: "28px", height: "28px" }}>
                <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", animation: "spin3d 10s infinite linear" }}>
                  <div className="cube-face" style={{ transform: "translateZ(14px)" }}></div>
                  <div className="cube-face" style={{ transform: "rotateY(180deg) translateZ(14px)" }}></div>
                  <div className="cube-face" style={{ transform: "rotateY(90deg) translateZ(14px)" }}></div>
                  <div className="cube-face" style={{ transform: "rotateY(-90deg) translateZ(14px)" }}></div>
                  <div className="cube-face" style={{ transform: "rotateX(90deg) translateZ(14px)" }}></div>
                  <div className="cube-face" style={{ transform: "rotateX(-90deg) translateZ(14px)" }}></div>
                </div>
              </div>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.05em", color: "#fff" }}>
                SYSTEM_2040
              </span>
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "24rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff" }}>Connect</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                placeholder="Enter root email..."
                className="input-focus"
                style={{ flex: 1, background: "#0a0a0a", border: "1px solid #333", color: "#fff", padding: "0.6rem 1rem", fontSize: "0.8rem", borderRadius: "0.25rem", transition: "border-color 0.3s" }}
              />
              <button className="btn-hover" style={{ background: "#fff", color: "#000", border: "none", padding: "0 1rem", borderRadius: "0.25rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main grid (unchanged) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "3rem",
            marginBottom: "4rem",
            alignItems: "start",
          }}
        >
          <FooterLinkCol section={footerLinks[0]} />
          <FooterLinkCol section={footerLinks[1]} />
          <FooterLinkCol section={footerLinks[2]} />

          <div
            style={{
              background: "#050505",
              border: "1px solid #222",
              borderRadius: "0.5rem",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              boxShadow: "inset 0 0 20px rgba(255,255,255,0.02)"
            }}
          >
            <h4 style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#fff" }}>
              Node Coordinates
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <MapPin size={16} style={{ color: "#fff", flexShrink: 0 }} />
                <span>Sector 7G,<br />Grid Alpha 94025</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Terminal size={16} style={{ color: "#fff", flexShrink: 0 }} />
                <span>CMD: ssh root@2040</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Mail size={16} style={{ color: "#fff", flexShrink: 0 }} />
                <span>ping@system2040.io</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar (unchanged) */}
        <div
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid #111",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <p style={{ fontSize: "0.75rem" }}>
              © {currentYear} <span style={{ color: "#fff", fontWeight: 600 }}>SYSTEM_2040</span>. END OF FILE.
            </p>
            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <Link href="#" className="hover-link" style={{ color: "#666", textDecoration: "none" }}>Privacy</Link>
              <Link href="#" className="hover-link" style={{ color: "#666", textDecoration: "none" }}>Terms</Link>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <SocialIcon icon={<X size={16} />} href="#" />
            <SocialIcon icon={<CustomGithubIcon />} href="#" />
            <SocialIcon icon={<CustomLinkedinIcon />} href="#" />
            <SocialIcon icon={<Globe size={16} />} href="#" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkCol({ section }: { section: { title: string; links: { label: string; href: string }[] } }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <h4 style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#fff" }}>
        {section.title}
      </h4>
      <ul style={{ display: "flex", flexDirection: "column", gap: "0.8rem", listStyle: "none", padding: 0, margin: 0 }}>
        {section.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="hover-link"
              style={{ fontSize: "0.85rem", color: "#888", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
            >
              {link.label}
              <ArrowUpRight className="arrow-icon" size={12} style={{ opacity: 0, transition: "all 0.3s ease" }} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="social-icon"
      style={{
        padding: "0.5rem",
        borderRadius: "0.25rem",
        background: "#0a0a0a",
        border: "1px solid #333",
        color: "#888",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
      }}
    >
      {icon}
    </Link>
  );
}

function CustomGithubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
    </svg>
  );
}

function CustomLinkedinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
}