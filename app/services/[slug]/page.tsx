import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { pageMetadata, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/section-header";
import { ServiceCard } from "@/components/ui/service-card";
import { ButtonLink } from "@/components/ui/button";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/sections/reveal";
import { services, getService } from "@/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: `${service.name} — Novaflo Services`,
    description: service.description,
    path: service.path,
  });
}

const ctas: Record<string, { label: string; href: string }> = {
  "social-media-strategy": { label: "Request a Social Media Audit", href: "/contact" },
  default: { label: "Book a Growth Call", href: "/growth-call" },
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const breadcrumb = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: service.path },
  ];
  const cta = ctas[service.slug] ?? ctas.default;
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd(breadcrumb),
            serviceJsonLd({ name: service.name, description: service.description, path: service.path }),
          ]),
        }}
      />

      <div className="border-b border-white/[0.05] bg-navy-950/30">
        <div className="container-tight pb-16 pt-14">
          <Breadcrumb items={breadcrumb} />
          <div className="max-w-3xl">
            <p className="eyebrow">{service.name}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {service.short}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">{service.description}</p>
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <CTAButton label={cta.label} href={cta.href} />
              <ButtonLink href="/how-it-works" variant="secondary" size="lg">
                See How It Works
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container-tight grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl font-semibold">What&apos;s included</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li key={item} className="surface-card flex items-start gap-3 p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-cyan/15 text-accent-cyan">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    <span className="text-[15px] text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="surface-card h-fit rounded-2xl border border-accent-blue/20 bg-brand-gradient-soft p-7">
              <h2 className="font-display text-xl font-semibold">What this gives your business</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-300">{service.outcome}</p>
              <div className="hairline my-6" />
              <p className="text-sm leading-relaxed text-slate-400">
                Every service is part of one system: strategy feeds content, content feeds enquiry
                pathways, reporting feeds next month&apos;s strategy.
              </p>
              <div className="mt-6">
                <CTAButton label={cta.label} href={cta.href} size="md" className="w-full" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-white/[0.05] bg-navy-950/30">
        <div className="container-tight">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">Related services</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 text-sm text-slate-500">
              <Link href="/services" className="text-accent-cyan hover:underline">
                View all services →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
