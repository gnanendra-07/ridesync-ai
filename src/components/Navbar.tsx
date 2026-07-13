"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Map, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#app-preview", label: "App Preview" },
  { href: "#why-ridesync", label: "Why Us" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-gray-200/60 shadow-sm shadow-black/5"
          : "bg-[#F7F8FA]/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-[64px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="RideSync AI home">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B00] flex items-center justify-center shadow-md shadow-[#FF6B00]/30 group-hover:scale-105 transition-transform duration-200">
              <Map className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-[1.1rem] tracking-tight text-[#16324F]">
              RideSync <span className="text-[#FF6B00]">AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-[#16324F]/60 hover:text-[#FF6B00] transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#16324F]/60 hover:text-[#16324F] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              id="nav-cta"
              className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-[#FF6B00]/25 hover:shadow-[#FF6B00]/40 transition-all duration-200 hover:-translate-y-px"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#16324F]/60 hover:text-[#16324F] hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-72 border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-xl px-5 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 text-sm font-semibold text-[#16324F]/70 hover:text-[#FF6B00] border-b border-gray-100 last:border-0 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <button className="mt-3 w-full bg-[#FF6B00] text-white py-3 rounded-full text-sm font-bold">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
