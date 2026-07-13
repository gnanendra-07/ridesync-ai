"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Navigation, Cloud } from "lucide-react";
import Image from "next/image";

const STATS = [
  { value: "50K+", label: "Riders" },
  { value: "120+", label: "Routes" },
  { value: "AI", label: "Powered" },
  { value: "Live", label: "Weather" },
];

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative bg-[#F7F8FA] overflow-hidden min-h-[calc(100vh-64px)] flex items-center"
    >
      {/* Subtle dot-grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(22,50,79,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Orange accent bar */}
      <div className="absolute top-0 left-0 w-28 h-[3px] bg-[#FF6B00]" aria-hidden="true" />

      {/* Warm radial glow */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(255,107,0,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-0 flex flex-col lg:flex-row items-center gap-12 lg:gap-0 min-h-[calc(100vh-64px)]">

        {/* LEFT */}
        <div className="lg:w-[48%] flex flex-col justify-center lg:py-20">

          <div className="inline-flex items-center gap-2.5 mb-7 self-start">
            <span className="block w-7 h-[2px] bg-[#FF6B00] rounded-full" />
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#FF6B00]">
              AI-Powered · Adventure Ready
            </span>
          </div>

          <h1 className="text-[2.4rem] sm:text-5xl lg:text-[3.25rem] font-black leading-[1.05] tracking-tight text-[#16324F] mb-5">
            Plan Smarter.
            <br />
            <span className="text-[#FF6B00]">Ride Farther.</span>
            <br />
            Capture Every
            <br />
            Journey.
          </h1>

          <p className="text-base md:text-[1.05rem] text-gray-500 leading-relaxed max-w-[420px] mb-9">
            The AI travel companion built for serious adventure riders.
            Precision routing, hyper-local weather, live telemetry and group
            tracking — all in one premium app.
          </p>

          {/* CTA Buttons — now use Link */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              href="/login"
              id="hero-start-journey"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold rounded-full shadow-lg shadow-[#FF6B00]/30 hover:shadow-[#FF6B00]/50 transition-all duration-200 hover:-translate-y-0.5 text-sm tracking-wide group"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <button
              id="hero-watch-demo"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 border border-[#16324F]/15 hover:border-[#FF6B00]/50 bg-white/80 backdrop-blur-sm text-[#16324F] font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 text-sm tracking-wide group shadow-sm"
            >
              <span className="w-6 h-6 rounded-full bg-[#16324F]/6 group-hover:bg-[#FF6B00]/10 flex items-center justify-center transition-colors duration-200">
                <Play className="w-3 h-3 ml-0.5 fill-current" />
              </span>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-7 sm:gap-10">
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="flex flex-col">
                  <span className="text-[1.6rem] font-black text-[#16324F] leading-none tracking-tight">
                    {s.value}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1 font-semibold tracking-wide uppercase">
                    {s.label}
                  </span>
                </div>
                {i < STATS.length - 1 && (
                  <span className="w-px h-8 bg-gray-200 flex-shrink-0" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:w-[52%] relative flex items-center justify-center lg:justify-end w-full">

          <div className="relative w-full max-w-[620px] lg:max-w-none lg:w-full aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-64px)] rounded-3xl overflow-hidden shadow-2xl shadow-[#16324F]/20">
            <Image
              src="/hero_rider_ghat.png"
              alt="BMW R1250 GS Trophy Edition rider on a scenic mountain ghat road"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover object-center"
              quality={90}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(13,27,46,0.55) 0%, transparent 45%)" }}
              aria-hidden="true"
            />
          </div>

          {/* Floating card: Route Ready */}
          <div
            className="absolute top-6 left-2 lg:-left-8 bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl px-4 py-3 shadow-xl shadow-black/10 flex items-center gap-3 min-w-[170px]"
            aria-label="AI Route Ready notification"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/12 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">AI Route Ready</p>
              <p className="text-sm font-black text-[#16324F]">Spiti · 480 km</p>
              <p className="text-[10px] text-[#FF6B00] font-semibold mt-0.5">Optimised for curves</p>
            </div>
          </div>

          {/* Floating card: Live Weather */}
          <div
            className="absolute bottom-8 left-2 lg:-left-8 bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl px-4 py-3 shadow-xl shadow-black/10 flex items-center gap-3 min-w-[160px]"
            aria-label="Live weather card"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Cloud className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Live Weather</p>
              <p className="text-sm font-black text-[#16324F]">18°C · Clear</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Rain chance: 8%</p>
            </div>
          </div>

        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.08), transparent)" }}
        aria-hidden="true"
      />
    </section>
  );
};

export default HeroSection;
