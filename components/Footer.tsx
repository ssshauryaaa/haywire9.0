"use client";
import Link from "next/link";
import { X, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Facilities", href: "/features" },
      ],
    },
    {
      title: "Ecosystem",
      links: [
        { label: "AI Labs", href: "#" },
        { label: "VR Classrooms", href: "#" },
        { label: "Robotics Hub", href: "#" },
        { label: "Wellness", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Admissions", href: "#" },
        { label: "Faculty Portal", href: "#" },
        { label: "Parent Dashboard", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "rgba(15, 18, 32, 0.5)",
        borderTop: "1px solid rgba(168, 85, 247, 0.2)",
        boxShadow: "0 -10px 40px -15px rgba(184,41,234,0.1)",
        backdropFilter: "blur(12px)",
        padding: "6rem 5rem 3rem",
        color: "#9ca3af",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        {/* Main grid — pure CSS, no Tailwind */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "4rem",
            marginBottom: "5rem",
            alignItems: "start",
          }}
        >
          {/* Brand Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  background: "#7c3aed",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  color: "white",
                  fontStyle: "italic",
                  fontSize: "0.85rem",
                }}
              >
                SS
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.05em", color: "white" }}>
                2040<span style={{ color: "#7c3aed" }}>.</span>
              </span>
            </Link>
            <p style={{ fontSize: "0.875rem", lineHeight: "1.75", maxWidth: "22rem" }}>
              Redefining the architecture of education through neural networks and immersive learning. Join the frontier of the next century.
            </p>
            <div style={{ display: "flex", gap: "1.25rem" }}>
              <SocialIcon icon={<X size={18} />} href="#" />
            </div>
          </div>

          {/* Links — Platform */}
          <FooterLinkCol section={footerLinks[0]} />

          {/* Links — Ecosystem */}
          <FooterLinkCol section={footerLinks[1]} />

          {/* Links — Support */}
          <FooterLinkCol section={footerLinks[2]} />

          {/* Contact Card */}
          <div
            style={{
              background: "rgba(88, 28, 135, 0.1)",
              border: "1px solid rgba(168, 85, 247, 0.1)",
              borderRadius: "1rem",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <h4
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(168, 85, 247, 0.8)",
              }}
            >
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <MapPin size={18} style={{ color: "#a855f7", flexShrink: 0 }} />
                <span>101 Innovation Way,<br />Silicon Valley, CA 94025</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Phone size={18} style={{ color: "#a855f7", flexShrink: 0 }} />
                <span>+1 (555) 000-2040</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Mail size={18} style={{ color: "#a855f7", flexShrink: 0 }} />
                <span>hello@ss2040.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: "2.5rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <p style={{ fontSize: "0.75rem" }}>
            © {currentYear}{" "}
            <span style={{ color: "white", fontWeight: 500 }}>Smart School 2040</span>. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "2rem", fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
            <Link href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Terms of Service</Link>
            <Link href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkCol({ section }: { section: { title: string; links: { label: string; href: string }[] } }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h4
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "rgba(168, 85, 247, 0.8)",
        }}
      >
        {section.title}
      </h4>
      <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", listStyle: "none", padding: 0, margin: 0 }}>
        {section.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              style={{ fontSize: "0.9rem", color: "#9ca3af", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              {link.label}
              <ArrowUpRight size={12} style={{ opacity: 0 }} />
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
      style={{
        padding: "0.625rem",
        borderRadius: "0.75rem",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#9ca3af",
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