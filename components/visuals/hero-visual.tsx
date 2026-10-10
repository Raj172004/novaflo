"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Premium hero visual: floating phone with an Instagram-style reel preview,
 * staggered dashboard cards, subtle growth line.
 * Everything is clearly labelled DEMO — no fake metrics, logos or claims.
 */

function useRevealed() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

export function HeroVisual() {
  const { ref, on } = useRevealed();
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[480px]" aria-hidden="true">
      {/* ambient glow */}
      <div className="absolute -inset-10 rounded-full bg-brand-gradient-soft blur-3xl" />

      {/* growth line */}
      <svg
        className={`absolute -left-8 top-10 hidden w-64 text-accent-cyan/40 md:block ${on ? "animate-grow-line origin-left" : "opacity-0"}`}
        viewBox="0 0 200 100"
        fill="none"
        style={{ animationDelay: "600ms" }}
      >
        <path d="M4 96 C 60 88, 90 60, 120 44 S 176 18, 196 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="196" cy="10" r="3.5" fill="currentColor" />
      </svg>

      {/* phone */}
      <div className={on ? "animate-float relative" : "relative opacity-0"} style={{ animationDelay: "200ms" }}>
        <div className="mx-auto w-[250px] rounded-[2.6rem] border border-white/15 bg-navy-950 p-2.5 shadow-card sm:w-[280px]">
          <div className="overflow-hidden rounded-[2rem] bg-navy-900">
            {/* status bar */}
            <div className="flex items-center justify-between px-5 pt-3 text-[10px] text-slate-400">
              <span>9:41</span>
              <span className="flex gap-1">
                <span className="h-1.5 w-4 rounded-full bg-slate-600" />
                <span className="h-1.5 w-2 rounded-full bg-slate-500" />
              </span>
            </div>
            {/* reel preview */}
            <div className="relative mx-3 mt-3 aspect-[9/14] overflow-hidden rounded-2xl bg-gradient-to-br from-navy-700 via-navy-800 to-navy-850">
              <div className="absolute inset-0 bg-[radial-gradient(140px_100px_at_70%_20%,rgba(42,212,232,0.14),transparent)]" />
              {/* play button */}
              <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M6 3.5v11l9-5.5-9-5.5Z" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
              {/* demo label */}
              <span className="absolute left-2 top-2 rounded-md bg-navy-950/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-cyan">
                Demo
              </span>
              {/* side actions */}
              <div className="absolute bottom-4 right-2 flex flex-col items-center gap-3 text-white/60">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20l1-4.9a8.4 8.4 0 1 1 17-3.6Z" /></svg>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" /></svg>
              </div>
              {/* demo handle with official mark */}
              <div className="absolute bottom-9 left-3 right-10 flex items-center gap-1.5">
                <Image
                  src="/brand/novaflo-mark.png"
                  alt=""
                  width={96}
                  height={72}
                  className="h-4 w-auto"
                />
                <span className="text-[9px] font-semibold text-white/85">yourbusiness</span>
              </div>
              {/* caption */}
              <div className="absolute bottom-3 left-3 right-10">
                <div className="h-2 w-3/4 rounded-full bg-white/25" />
                <div className="mt-1.5 h-2 w-1/2 rounded-full bg-white/15" />
              </div>
            </div>
            {/* bottom nav */}
            <div className="flex items-center justify-around px-6 py-3 text-slate-500">
              {[
                "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5Z",
                "M21 11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Zm-2.1-6L4.4 19.9",
                "M4 6h16M4 12h16M4 18h10",
              ].map((d, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d={d} strokeLinecap="round" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* floating dashboard cards */}
      <DemoCard
        className="-right-4 top-16 sm:-right-10"
        label="Content calendar"
        show={on}
        delay={350}
      >
        <div className="space-y-1.5">
          {[75, 55, 85].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
              <span className="h-2 rounded-full bg-white/20" style={{ width: `${w * 0.6}px` }} />
            </div>
          ))}
        </div>
      </DemoCard>

      <DemoCard
        className="-left-2 bottom-24 sm:-left-10"
        label="Monthly report"
        show={on}
        delay={550}
      >
        <svg width="86" height="30" viewBox="0 0 86 30" fill="none">
          <path
            d="M2 26 C 14 24, 20 18, 30 16 S 52 14, 62 9 76 5, 84 3"
            stroke="#2AD4E8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <div className="mt-1.5 h-1.5 w-16 rounded-full bg-white/15" />
      </DemoCard>

      <DemoCard
        className="-right-2 bottom-6 sm:-right-6"
        label="Enquiry flow"
        show={on}
        delay={750}
      >
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] text-slate-200">Reel</span>
          <span className="text-slate-500">→</span>
          <span className="rounded-md bg-accent-cyan/15 px-2 py-1 text-[10px] text-accent-cyan">DM</span>
          <span className="text-slate-500">→</span>
          <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] text-slate-200">Enquiry</span>
        </div>
      </DemoCard>
    </div>
  );
}

function DemoCard({
  className,
  label,
  show,
  delay,
  children,
}: {
  className: string;
  label: string;
  show: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute z-10 rounded-xl border border-white/10 bg-navy-850/90 p-3 shadow-card backdrop-blur transition-all duration-700 ${className} ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {children}
    </div>
  );
}
