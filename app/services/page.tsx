
import type { Metadata } from "next";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SectionHeader, Breadcrumb } from "@/components/ui/section-header";
import { ServiceCard } from "@/components/ui/service-card";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/sections/reveal";
import { getServices } from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "Services — Social Media Strategy, Instagram Management & Content",
  description:
    "Strategy & audit, Instagram management, premium content production, founder personal branding, enquiry flow and transparent reporting — one connected growth system.",
  path: "/services",
});

const breadcrumb = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumb)),
        }}
      />

      <div className="border-b border-white/[0.05] bg-navy-950/30">
        <div className="container-tight pb-16 pt-14">
          <Breadcrumb items={breadcrumb} />

          <SectionHeader
            as="h1"
            eyebrow="Services"
            title="Social media built around your business."
            description="Our services work together as one system. Start where your business needs the most help — or let the whole system run end to end."
          />
        </div>
      </div>

      <section className="section">
        <div className="container-tight">
          {services.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Reveal key={service.slug} delay={index * 60}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-slate-400">
              Services are currently being updated. Please check back soon.
            </p>
          )}

          <Reveal>
            <div className="surface-card mt-14 p-8 text-center sm:p-10">
              <h2 className="font-display text-2xl font-semibold">
                Not sure where to start?
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-slate-400">
                A growth call is a simple conversation about your business,
                your customers and your current presence — and what a
                structured system could look like.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton label="Book a Growth Call" href="/growth-call" />

                <a
                  href="/services/social-media-strategy"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-accent-cyan/50"
                >
                  Request a Social Media Audit
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
