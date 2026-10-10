import type { Metadata } from "next";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SectionHeader, Breadcrumb } from "@/components/ui/section-header";
import { ContactForm } from "@/components/forms/lead-forms";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Reveal } from "@/components/sections/reveal";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = pageMetadata({
  title: "Contact Novaflo",
  description:
    "Talk to Novaflo about social media strategy, Instagram management and content for your business. Send an enquiry and Novaflo will respond through your preferred method.",
  path: "/contact",
});

const breadcrumb = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  const hasAnyContact = Boolean(
    siteConfig.email || siteConfig.phone || siteConfig.whatsapp || siteConfig.instagram || siteConfig.location
  );

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
            eyebrow="Contact"
            title="Let us build a stronger online presence for your business."
            description="Send an enquiry and Novaflo will review it and respond through your preferred method."
          />
        </div>
      </div>

      <section className="section">
        <div className="container-tight grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">Contact details</h2>
              {hasAnyContact ? (
                <ul className="space-y-3">
                  {siteConfig.email ? (
                    <li className="surface-card flex items-center gap-3.5 p-4">
                      <Mail className="h-5 w-5 shrink-0 text-accent-cyan" aria-hidden />
                      <a href={`mailto:${siteConfig.email}`} className="text-[15px] text-slate-200 hover:underline">
                        {siteConfig.email}
                      </a>
                    </li>
                  ) : null}
                  {siteConfig.phone ? (
                    <li className="surface-card flex items-center gap-3.5 p-4">
                      <Phone className="h-5 w-5 shrink-0 text-accent-cyan" aria-hidden />
                      <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`} className="text-[15px] text-slate-200 hover:underline">
                        {siteConfig.phone}
                      </a>
                    </li>
                  ) : null}
                  {siteConfig.instagram ? (
                    <li className="surface-card flex items-center gap-3.5 p-4">
                      <Instagram className="h-5 w-5 shrink-0 text-accent-cyan" aria-hidden />
                      <a
                        href={`https://instagram.com/${siteConfig.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[15px] text-slate-200 hover:underline"
                      >
                        @{siteConfig.instagram}
                      </a>
                    </li>
                  ) : null}
                  {siteConfig.location ? (
                    <li className="surface-card flex items-center gap-3.5 p-4">
                      <MapPin className="h-5 w-5 shrink-0 text-accent-cyan" aria-hidden />
                      <span className="text-[15px] text-slate-200">{siteConfig.location}</span>
                    </li>
                  ) : null}
                </ul>
              ) : (
                <p className="surface-card p-5 text-sm leading-relaxed text-slate-400">
                  Direct contact details will appear here once verified contact information is
                  configured. In the meantime, the enquiry form reaches Novaflo directly.
                </p>
              )}
              {siteConfig.whatsapp ? (
                <WhatsAppButton source="contact_page" label="Chat on WhatsApp" className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-400/20" />
              ) : null}

              <div className="hairline my-8" />
              <div className="surface-card p-5">
                <h3 className="font-display text-base font-semibold">Looking for a growth call instead?</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  The growth call form asks a few more questions so the first conversation is already
                  prepared.
                </p>
                <a href="/growth-call" className="mt-3 inline-block text-sm font-semibold text-accent-cyan hover:underline">
                  Book a Growth Call →
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
