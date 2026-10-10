import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarOff,
  FileQuestion,
  Clock,
  Eye,
  FileText,
  Compass,
  Calendar,
  Clapperboard,
  UserRound,
  MessagesSquare,
  LineChart,
  ShieldCheck,
  Sparkles,
  Users,
  Handshake,
  FileBarChart,
  TrendingUp,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button";
import { CTAButton } from "@/components/ui/cta-button";
import { ServiceCard } from "@/components/ui/service-card";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { HeroVisual } from "@/components/visuals/hero-visual";
import { Reveal } from "@/components/sections/reveal";
import { TrustFlow } from "@/components/sections/trust-flow";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { RoadmapTimeline } from "@/components/sections/roadmap-timeline";
import { services } from "@/data/services";
import { faqs } from "@/data/faqs";
import { industries } from "@/data/industries";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = pageMetadata({
  title: "Novaflo — Social Media Growth Agency in Anantapur",
  description:
    "Novaflo creates premium social media content, founder-led branding, and transparent reporting to help ambitious businesses build a stronger online presence and generate more genuine enquiries.",
  path: "/",
});

const problems = [
  {
    icon: CalendarOff,
    title: "Inconsistent Instagram presence",
    text: "Weeks of silence between posts makes even an established business look inactive.",
  },
  {
    icon: FileQuestion,
    title: "Generic content",
    text: "Posts that could belong to any business — and don't reflect the quality of yours.",
  },
  {
    icon: Clock,
    title: "No time to do it properly",
    text: "Planning, filming, editing, posting — a second job on top of running a business.",
  },
  {
    icon: Eye,
    title: "Views without enquiries",
    text: "Likes and views that never turn into a DM, a WhatsApp message or a booking.",
  },
  {
    icon: FileText,
    title: "Confusing agency reports",
    text: "Charts and jargon that don't explain what actually happened or what changes next.",
  },
];

const whyNovaflo = [
  {
    icon: Compass,
    title: "Strategy Before Posting",
    text: "Content begins with the business, audience, and desired customer action.",
  },
  {
    icon: Sparkles,
    title: "Premium Brand Presence",
    text: "Content that makes the business look credible, consistent, and professional.",
  },
  {
    icon: Users,
    title: "Founder Trust",
    text: "Where appropriate, founder-led content helps customers connect with the people behind the business.",
  },
  {
    icon: Handshake,
    title: "Clear Collaboration",
    text: "Planned calendars, approval opportunities, and a defined production process.",
  },
  {
    icon: FileBarChart,
    title: "Transparent Reporting",
    text: "Reports explain the meaning behind the numbers and what happens next.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement",
    text: "Each month informs the next content plan.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── 1–2. NAVBAR + HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-tight relative grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
          <div>
            <Reveal>
              <p className="eyebrow">
                Social media growth partner — Anantapur &amp; nearby
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Make your business the{" "}
                <span className="text-gradient">trusted name</span> customers remember.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
                Novaflo creates premium social media content, founder-led branding, and transparent
                reporting to help ambitious businesses build a stronger online presence and generate
                more genuine enquiries.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <CTAButton label="Book a Growth Call" href="/growth-call" />
                <ButtonLink href="/how-it-works" variant="secondary" size="lg">
                  See How It Works
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-7 text-sm text-slate-500">
                Strategy before posting. Content with a purpose. Reporting you can actually use.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      {/* ── 3. TRUST / POSITIONING STATEMENT ───────────────── */}
      <section className="border-y border-white/[0.05] bg-navy-950/40">
        <div className="container-tight py-14 text-center">
          <Reveal>
            <p className="mx-auto max-w-3xl text-xl font-medium leading-relaxed text-slate-300 sm:text-2xl">
              Novaflo is a <span className="text-white">strategic social media growth partner</span> —
              not a service that simply publishes posts. Every piece of content exists to{" "}
              <span className="text-gradient">build trust</span>, answer customer questions, show
              proof, and create a clear path to enquiry.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 4. PROBLEM ─────────────────────────────────────── */}
      <section className="section">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="The problem"
              title="Your business deserves more than random posts."
              description="Most businesses don't need more content. They need content that reflects the quality of the business — planned, published and measured with intent."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="surface-card surface-card-hover h-full p-6">
                  <p.icon className="h-6 w-6 text-accent-cyan" aria-hidden />
                  <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-400">{p.text}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={350}>
              <div className="flex h-full flex-col justify-center rounded-2xl border border-accent-blue/25 bg-brand-gradient-soft p-6">
                <p className="font-display text-lg font-semibold text-white">
                  Sound familiar?
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-300">
                  These are solvable problems — with a system, not more hustle.
                </p>
                <Link
                  href="/how-it-works"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cyan hover:underline"
                >
                  See the system →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 5. SOLUTION ────────────────────────────────────── */}
      <section className="section border-t border-white/[0.05] bg-navy-950/30">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="The solution"
              title="A complete social media growth system."
              description="Six connected parts that turn social media from an obligation into a structured growth channel."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WHY NOVAFLO ─────────────────────────────────── */}
      <section className="section">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="Why Novaflo"
              title="Built on trust, transparency and quality."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyNovaflo.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="surface-card surface-card-hover h-full p-6">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent-blue/25 bg-accent-blue/10 text-accent-cyan">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-400">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. SERVICES preview ────────────────────────────── */}
      <section className="section border-y border-white/[0.05] bg-navy-950/30">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="Services"
              title="Social media built around your business."
              description="Six services that work as one system — strategy feeds content, content feeds enquiry pathways, reporting feeds next month's strategy."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-10 text-center">
              <ButtonLink href="/services" variant="secondary" size="lg">
                Explore all services
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 8. HOW IT WORKS ────────────────────────────────── */}
      <section className="section">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="How it works"
              title="Understand. Plan. Create. Publish. Improve."
              description="A clear five-step process — so you always know what is happening and what comes next."
            />
          </Reveal>
          <ProcessTimeline />
          <Reveal>
            <div className="mt-10 text-center">
              <CTAButton label="Start with a Growth Call" href="/growth-call" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 9. 90-DAY FRAMEWORK ────────────────────────────── */}
      <section className="section border-y border-white/[0.05] bg-navy-950/30">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="The first 90 days"
              title="A framework, not guesswork."
              description="The first three months follow a deliberate arc: build the foundation, test deliberately, then improve what proves itself."
            />
          </Reveal>
          <div className="mt-14">
            <RoadmapTimeline />
          </div>
        </div>
      </section>

      {/* ── 10. STRATEGY BEFORE POSTING + DASHBOARD TEASER ── */}
      <section className="section">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="Strategy before posting"
              title="Content with a clear purpose."
              description="Content is not created to fill an Instagram feed. Every piece has a job."
            />
          </Reveal>
          <div className="mt-12">
            <TrustFlow />
          </div>
        </div>
      </section>

      {/* ── 11. INDUSTRIES ─────────────────────────────────── */}
      <section className="section border-y border-white/[0.05] bg-navy-950/30">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="Industries"
              title="Built for businesses where trust influences the decision."
              description="Novaflo works best with businesses where customers choose based on credibility and confidence."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, i) => (
              <Reveal key={industry.name} delay={i * 50}>
                <div className="surface-card surface-card-hover h-full p-5">
                  <h3 className="font-display text-[15px] font-semibold text-white">
                    {industry.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {industry.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <ButtonLink href="/industries" variant="secondary">
                See industries in detail
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 12. CASE STUDY PLACEHOLDER (honest empty state) ── */}
      <section className="section">
        <div className="container-tight">
          <Reveal>
            <SectionHeader
              eyebrow="Results"
              title="Results built with transparency."
              description="Novaflo only publishes real numbers from real work. Until approved client stories exist, this space stays honestly empty."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="surface-card mx-auto mt-12 max-w-2xl p-8 text-center sm:p-10">
              <ShieldCheck className="mx-auto h-10 w-10 text-accent-cyan" aria-hidden />
              <h3 className="mt-5 font-display text-2xl font-semibold">
                Real work. Real numbers. Real lessons.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-slate-400">
                Case studies will appear here as approved work becomes available — with client
                context, the strategy used, content delivered, measured results and lessons learned.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 13. BUSINESS OWNER SECTION ─────────────────────── */}
      <section className="section border-y border-white/[0.05] bg-navy-950/30">
        <div className="container-tight grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="eyebrow">For business owners</p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Your business is already working hard. Your online presence should too.
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-400">
                Built for busy owners who want a dependable partner handling the strategy, the
                content and the reporting — while they run the business.
              </p>
              <div className="mt-7 flex flex-col gap-3.5 sm:flex-row">
                <CTAButton label="Book a Growth Call" href="/growth-call" />
                <ButtonLink href="/business-owners" variant="secondary" size="lg">
                  Why owners choose Novaflo
                </ButtonLink>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ul className="space-y-3.5">
              {[
                "A clear content plan — approved before the month begins",
                "A professional presence that matches your standards",
                "Confidence in what is posted, and why",
                "Less day-to-day content pressure",
                "Simple reporting in plain language",
                "A clearer customer enquiry pathway",
              ].map((item) => (
                <li key={item} className="surface-card flex items-start gap-3 p-4">
                  <svg
                    className="mt-1 h-4 w-4 shrink-0 text-accent-cyan"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="m3 8.5 3.2 3L13 4.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[15px] text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── 14. FAQ PREVIEW ────────────────────────────────── */}
      <section className="section">
        <div className="container-tight max-w-3xl">
          <Reveal>
            <SectionHeader
              eyebrow="FAQs"
              title="Questions business owners actually ask."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10">
              <FAQAccordion items={faqs.slice(0, 5)} />
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-8 text-center">
              <ButtonLink href="/faqs" variant="ghost">
                View all FAQs →
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 15. FINAL CTA ──────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/[0.05]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_0%,rgba(77,141,255,0.12),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="container-tight py-24 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Ready to make your online presence work harder for your business?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Let&apos;s talk about your business — and what a structured content system could look
              like.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <CTAButton label="Book Your Growth Call" href="/growth-call" />
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Talk to Novaflo
              </ButtonLink>
            </div>
          </Reveal>
          {siteConfig.whatsapp ? null : (
            <Reveal delay={240}>
              <p className="mt-6 text-sm text-slate-500">
                Not sure where to start?{" "}
                <Link href="/services/social-media-strategy" className="text-accent-cyan hover:underline">
                  Request a social media audit
                </Link>
              </p>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
