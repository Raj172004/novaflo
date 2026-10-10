import { Reveal } from "./reveal";
import { roadmap } from "@/data/process";

/** 90-day framework: horizontal timeline on desktop, vertical on mobile. */
export function RoadmapTimeline() {
  return (
    <div>
      {/* Desktop horizontal */}
      <div className="relative hidden gap-6 md:grid md:grid-cols-3">
        <span
          aria-hidden="true"
          className="absolute left-[10%] right-[10%] top-7 h-px bg-gradient-to-r from-accent-blue/60 via-accent-cyan/50 to-accent-violet/60"
        />
        {roadmap.map((month, i) => (
          <Reveal key={month.month} delay={i * 120} className="relative">
            <div className="flex flex-col items-center text-center">
              <span
                aria-hidden="true"
                className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-cyan/40 bg-navy-800 shadow-glow-cyan"
              >
                <span className="font-display text-lg font-bold text-white">{i + 1}</span>
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent-cyan">
                {month.month} · {month.label}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold">{month.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {month.items.map((item) => (
                  <li
                    key={item}
                    className="surface-card px-4 py-2.5 text-sm text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Mobile vertical */}
      <ol className="relative space-y-8 md:hidden">
        <span
          aria-hidden="true"
          className="absolute left-[27px] top-3 h-[calc(100%-24px)] w-px bg-gradient-to-b from-accent-blue/50 via-accent-cyan/40 to-accent-violet/50"
        />
        {roadmap.map((month, i) => (
          <li key={month.month} className="relative pl-16">
            <Reveal delay={i * 80}>
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-cyan/40 bg-navy-800 shadow-glow-cyan"
              >
                <span className="font-display text-lg font-bold text-white">{i + 1}</span>
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-cyan">
                {month.month} · {month.label}
              </p>
              <h3 className="mt-1.5 font-display text-xl font-semibold">{month.title}</h3>
              <ul className="mt-3 space-y-2">
                {month.items.map((item) => (
                  <li
                    key={item}
                    className="surface-card px-4 py-2.5 text-sm text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
