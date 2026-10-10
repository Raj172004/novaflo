import type { Metadata } from "next";
import { CalendarCheck, BadgeCheck, Clock3, FileBarChart, Route, MessageSquareText } from "lucide-react";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SectionHeader, Breadcrumb } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/sections/reveal";

export const metadata: Metadata = pageMetadata({
  title: "For Business Owners — Social Media Without the Daily Pressure",
  description:
    "A clear content plan, a professional presence, simple reporting and a clearer enquiry pathway — for busy owners who want a dependable partner.",
  path: "/business-owners",
});

const breadcrumb = [
  { name: "Home", path: "/" },
  { name: "For Business Owners", path: "/business-owners" },
];

const benefits = [
  { icon: CalendarCheck, title: "A clear content plan", text: "Know what will be created and published before the month begins — approved by you." },
  { icon: BadgeCheck, title: "Professional presence", text: "An online presence that matches the actual standard of your business." },
  { icon: MessageSquareText, title: "Confidence in every post", text: "Every piece has a purpose you understand — no posting for the sake of it." },
  { icon: Clock3, title: "Less daily pressure", text: "No more deciding what to post, filming after dinner, or editing at midnight." },
  { icon: FileBarChart, title: "Simple reporting", text: "Plain-language monthly reporting on what happened and what changes next." },
  { icon: Route, title: "A clearer enquiry pathway", text: "Customers know exactly what to do next — DM, WhatsApp or booking." },
];

export default function BusinessOwnersPage() {
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
            <p className="eyebrow">For business owners</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Your business is already working hard. Your online presence should too.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              Built for busy owners who want a dependable partner handling strategy, content and
              reporting — while they run the business.
            </p>
            <div className="mt-8">
              <CTAButton label="Book a Growth Call" href="/growth-call" />
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="What changes"
              title="What working with Novaflo gives you."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 60}>
                <div className="surface-card surface-card-hover h-full p-6">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent-blue/25 bg-accent-blue/10 text-accent-cyan">
                    <b.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h2 className="font-display text-lg font-semibold">{b.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-400">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-y border-white/[0.05] bg-navy-950/30">
        <div className="container-tight max-w-3xl">
          <Reveal>
            <div className="surface-card p-8 sm:p-10">
              <h2 className="font-display text-2xl font-semibold">A typical month with Novaflo</h2>
              <ol className="mt-6 space-y-4">
                {[
                  "You review and approve the coming month's content calendar.",
                  "Filming happens in one focused session, planned around your schedule.",
                  "Content is edited, scheduled and published through the month.",
                  "You receive a plain-language report: what happened, what it means, what changes.",
                  "The next month's plan is built on that evidence.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-cyan/40 bg-accent-cyan/10 text-xs font-bold text-accent-cyan">
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed text-slate-300">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-slate-500">
                You keep full ownership of your account, content and leads — always.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-tight text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ready when you are.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              The first step is a conversation about your business — not a sales script.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <CTAButton label="Book a Growth Call" href="/growth-call" />
              <ButtonLink href="/faqs" variant="secondary" size="lg">
                Read the FAQs
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
