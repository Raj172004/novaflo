import { Reveal } from "./reveal";
import { processSteps } from "@/data/process";

/** Interactive five-step process timeline (UNDERSTAND → PLAN → CREATE → PUBLISH → IMPROVE). */
export function ProcessTimeline() {
  return (
    <ol className="relative mx-auto mt-14 max-w-3xl">
      <span
        aria-hidden="true"
        className="absolute left-[19px] top-2 h-[calc(100%-16px)] w-px bg-gradient-to-b from-accent-blue/50 via-accent-cyan/30 to-transparent sm:left-1/2"
      />
      {processSteps.map((step, i) => (
        <li key={step.id} className="relative pb-12 last:pb-0">
          <Reveal delay={i * 60}>
            <div
              className={`flex flex-col gap-4 sm:flex-row sm:items-start ${
                i % 2 === 1 ? "sm:flex-row-reverse" : ""
              }`}
            >
              {/* node */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-accent-blue/40 bg-navy-800 text-[13px] font-bold text-accent-cyan shadow-glow-cyan sm:relative sm:left-auto sm:top-auto sm:mx-6 sm:shrink-0"
              >
                {step.step}
              </span>
              <div className="surface-card surface-card-hover ml-14 flex-1 p-6 sm:ml-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-cyan">
                  Step {step.step} — {step.name}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-400">{step.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {step.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[13px] text-slate-300"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              {/* spacer for alternating layout */}
              <div className="hidden flex-1 sm:block" aria-hidden="true" />
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
