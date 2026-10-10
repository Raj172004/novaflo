import type { Metadata } from "next";
import {
  HeartPulse,
  Dumbbell,
  Scissors,
  Building2,
  GraduationCap,
  Briefcase,
  Home,
  Gem,
} from "lucide-react";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SectionHeader, Breadcrumb } from "@/components/ui/section-header";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/sections/reveal";
import { industries } from "@/data/industries";

export const metadata: Metadata = pageMetadata({
  title: "Industries — Social Media for Trust-Driven Local Businesses",
  description:
    "Clinics, gyms, salons, real estate, coaches, professional services, interiors and premium local products — businesses where trust influences the decision.",
  path: "/industries",
});

const breadcrumb = [
  { name: "Home", path: "/" },
  { name: "Industries", path: "/industries" },
];

const icons: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  "heart-pulse": HeartPulse,
  dumbbell: Dumbbell,
  scissors: Scissors,
  "building-2": Building2,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  home: Home,
  gem: Gem,
};

export default function IndustriesPage() {
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
            eyebrow="Industries"
            title="Built for businesses where trust influences the decision."
            description="Novaflo works with local and growing businesses where customers choose based on credibility, confidence and familiarity."
          />
        </div>
      </div>

      <section className="section">
        <div className="container-tight">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, i) => {
              const Icon = icons[industry.icon] ?? Gem;
              return (
                <Reveal key={industry.name} delay={i * 50}>
                  <div className="surface-card surface-card-hover h-full p-6">
                    <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent-blue/25 bg-accent-blue/10 text-accent-cyan">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h2 className="font-display text-lg font-semibold">{industry.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {industry.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
              Novaflo mentions only locations and industries it genuinely serves. Industry
              understanding deepens with every engagement — claims of expertise are made only when
              real evidence exists.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-white/[0.05] bg-navy-950/30">
        <div className="container-tight text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Discuss your business.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Tell us about your business and customers — and what a content system could do for it.
            </p>
            <div className="mt-8">
              <CTAButton label="Discuss Your Business" href="/growth-call" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
