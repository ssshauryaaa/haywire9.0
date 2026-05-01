import type { Metadata } from "next";
import { Orbitron, Syne, Inter } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SS2040",
  description: "A futuristic smart school powered by AI, robotics, virtual reality, and digital innovation.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${syne.variable} ${inter.variable}`}>
      {/* 1. Add flex flex-col and min-h-screen here */}
      <body className="antialiased font-inter flex flex-col min-h-screen">
        <Navbar />
        {/* 2. Wrap children in a main tag with flex-grow to push footer down */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
