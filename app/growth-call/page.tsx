import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/section-header";
import { GrowthCallForm } from "@/components/forms/lead-forms";
import { Reveal } from "@/components/sections/reveal";

export const metadata: Metadata = pageMetadata({
  title: "Book a Growth Call",
  description:
    "Book a growth call with Novaflo. A simple conversation about your business, your customers and what a structured social media system could look like.",
  path: "/growth-call",
});

const breadcrumb = [
  { name: "Home", path: "/" },
  { name: "Book a Growth Call", path: "/growth-call" },
];

const expectations = [
  "A conversation about your business, customers and current presence",
  "What a structured content system would look like for you",
  "Honest answers — including whether Novaflo is the right fit",
  "No pressure and no obligation",
];

export default function GrowthCallPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumb)) }}
      />
      <div className="border-b border-white/[0.05] bg-navy-950/30">
        <div className="container-tight pb-16 pt-14">
          <Breadcrumb items={breadcrumb} />
          <div className="max-w-3xl">
            <p className="eyebrow">Growth call</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Let&apos;s talk about your business.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              Tell Novaflo a little about your business below. It takes two minutes and makes the
              first conversation genuinely useful.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container-tight grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <GrowthCallForm />
          </Reveal>
          <Reveal delay={120}>
            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="surface-card p-6">
                <h2 className="font-display text-lg font-semibold">What happens on the call</h2>
                <ul className="mt-4 space-y-3">
                  {expectations.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent-cyan" aria-hidden style={{ width: 18, height: 18 }} />
                      <span className="text-sm leading-relaxed text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-accent-blue/20 bg-brand-gradient-soft p-6">
                <h3 className="font-display text-base font-semibold">Not ready for a call?</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Start with a social media audit request instead — or simply send an enquiry.
                </p>
                <div className="mt-4 flex flex-col gap-2 text-sm font-semibold">
                  <a href="/services/social-media-strategy" className="text-accent-cyan hover:underline">
                    Request a Social Media Audit →
                  </a>
                  <a href="/contact" className="text-accent-cyan hover:underline">
                    Send an Enquiry →
                  </a>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
