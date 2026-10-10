import { Reveal } from "./reveal";

/**
 * Strategy-before-posting flow:
 * BUSINESS → AUDIENCE → STRATEGY → CONTENT → TRUST → ENQUIRY → LEARNING
 */
export function TrustFlow() {
  const steps = [
    "Business",
    "Audience",
    "Strategy",
    "Content",
    "Trust",
    "Enquiry",
    "Learning",
  ];

  return (
    <Reveal>
      <div className="surface-card overflow-hidden">
        <div className="bg-grid mask-fade-b px-6 py-8 sm:px-10">
          <ol className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-3">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-1.5">
                <span
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold sm:text-[15px] ${
                    i === steps.length - 1
                      ? "bg-accent-cyan/10 text-accent-cyan"
                      : i >= 4
                        ? "bg-white/[0.05] text-slate-200"
                        : "border border-accent-blue/25 bg-accent-blue/[0.07] text-slate-100"
                  }`}
                >
                  {step}
                </span>
                {i < steps.length - 1 ? (
                  <svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-slate-600"
                  >
                    <path
                      d="M1 5h11m0 0L8.8 1.8M12 5 8.8 8.2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
        <div className="border-t border-white/[0.06] px-6 py-5 sm:px-10">
          <p className="text-center text-[15px] leading-relaxed text-slate-400">
            Novaflo starts with the <span className="text-slate-200">business</span>, the{" "}
            <span className="text-slate-200">customer</span>, the{" "}
            <span className="text-slate-200">offer</span>, the existing online presence, the questions
            customers already ask, and the action the business wants —{" "}
            <span className="text-slate-200">then</span> content is created.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
