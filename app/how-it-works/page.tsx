import type { Metadata } from "next";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SectionHeader, Breadcrumb } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button";
import { CTAButton } from "@/components/ui/cta-button";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { RoadmapTimeline } from "@/components/sections/roadmap-timeline";
import { TrustFlow } from "@/components/sections/trust-flow";
import { Reveal } from "@/components/sections/reveal";

export const metadata: Metadata = pageMetadata({
  title: "How It Works — The Novaflo Process",
  description:
    "Understand, plan, create, publish, improve. A clear five-step social media process plus a deliberate 90-day framework for the first three months.",
  path: "/how-it-works",
});

const breadcrumb = [
  { name: "Home", path: "/" },
  { name: "How It Works", path: "/how-it-works" },
];

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumb)) }}
      />
      <div className="border-b border-white/[0.05] bg-navy-950/30">
        <div className="container-tight pb-16 pt-14">
          <Breadcrumb items={breadcrumb} />
          <SectionHeader
            as="h1"
            eyebrow="How it works"
            title="A clear process, a defined start, a better month every month."
            description="You always know what is happening, what is coming next, and why."
          />
        </div>
      </div>

      <section className="section">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="The process"
              title="Five steps. No mystery."
              description="Every Novaflo engagement follows the same structured process."
            />
          </Reveal>
          <ProcessTimeline />
        </div>
      </section>

      <section className="section border-y border-white/[0.05] bg-navy-950/30">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="The first 90 days"
              title="Foundation. Test. Improve."
              description="The first three months follow a deliberate arc so decisions are made on evidence, not guesses."
            />
          </Reveal>
          <div className="mt-14">
            <RoadmapTimeline />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="Strategy before posting"
              title="Strategy before posting."
              description="The order never changes — content is the output of strategy, not the starting point."
            />
          </Reveal>
          <div className="mt-12">
            <TrustFlow />
          </div>
        </div>
      </section>

      <section className="section border-t border-white/[0.05] bg-navy-950/30">
        <div className="container-tight text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              The first step is a conversation.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              A growth call is a simple discussion about your business — no pressure, no jargon.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <CTAButton label="Book a Growth Call" href="/growth-call" />
              <ButtonLink href="/services" variant="secondary" size="lg">
                Explore Services
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
