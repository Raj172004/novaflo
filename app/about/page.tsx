import type { Metadata } from "next";
import { Target, Eye, Compass, ShieldCheck, Gem, Award } from "lucide-react";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SectionHeader, Breadcrumb } from "@/components/ui/section-header";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/sections/reveal";

export const metadata: Metadata = pageMetadata({
  title: "About Novaflo — A Social Media Growth Partner",
  description:
    "Novaflo is a social media growth agency helping ambitious business owners build a professional online presence, earn customer trust and generate more enquiries.",
  path: "/about",
});

const breadcrumb = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

const values = [
  { icon: ShieldCheck, name: "Trust", text: "Relationships are built on reliability — in content and in communication." },
  { icon: Eye, name: "Transparency", text: "Clear plans, clear reporting, clear reasons behind every decision." },
  { icon: Gem, name: "Quality", text: "Premium work that reflects the standards of the businesses we represent." },
  { icon: Award, name: "Expertise", text: "Strategy first. Craft always. Learning every month." },
];

export default function AboutPage() {
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
            eyebrow="About Novaflo"
            title="A growth partner, not a posting service."
            description="Novaflo is a social media growth agency that helps ambitious business owners build a professional digital presence, earn customer trust, and generate more enquiries through strategic content."
          />
        </div>
      </div>

      <section className="section">
        <div className="container-tight">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Our purpose",
                text: "Help business owners achieve better reach and a stronger online presence through social media.",
              },
              {
                icon: Compass,
                title: "Our mission",
                text: "Help businesses grow through strategic social media marketing, quality content, and clear reporting.",
              },
              {
                icon: Eye,
                title: "Our vision",
                text: "Become a trusted long-term growth partner for ambitious business owners.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="surface-card h-full p-7">
                  <item.icon className="h-6 w-6 text-accent-cyan" aria-hidden />
                  <h2 className="mt-4 font-display text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-slate-400">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-y border-white/[0.05] bg-navy-950/30">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="Core values"
              title="What Novaflo stands for."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.name} delay={i * 60}>
                <div className="surface-card surface-card-hover h-full p-6 text-center">
                  <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-accent-blue/25 bg-accent-blue/10 text-accent-cyan">
                    <v.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{v.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-tight max-w-3xl">
          <Reveal>
            <div className="surface-card p-8 sm:p-10">
              <h2 className="font-display text-2xl font-semibold">Our approach</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-400">
                <p>
                  Content is not created simply to fill an Instagram feed. Every content piece
                  should have a purpose: build trust, answer a customer question, show proof,
                  explain an offer, educate, build authority, or encourage an enquiry.
                </p>
                <p>
                  That is why every Novaflo engagement begins with understanding the business —
                  before a single post is planned. Strategy comes first. Content follows. Reporting
                  closes the loop and improves the next month.
                </p>
                <p className="text-slate-300">
                  Novaflo never guarantees followers, viral videos, sales, bookings, leads or
                  specific ROI. Instead, Novaflo commits to a structured system: consistent premium
                  content, clear enquiry pathways, and transparent monthly improvement.
                </p>
              </div>
              <div className="mt-8">
                <CTAButton label="Book a Growth Call" href="/growth-call" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
