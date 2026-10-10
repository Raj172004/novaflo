import type { Metadata } from "next";
import { pageMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { SectionHeader, Breadcrumb } from "@/components/ui/section-header";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ButtonLink } from "@/components/ui/button";
import { CTAButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/sections/reveal";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = pageMetadata({
  title: "FAQs — Honest Answers About Working With Novaflo",
  description:
    "What Novaflo manages, camera requirements, filming time, paid ads, measurement, guarantees, ownership and timelines — answered honestly.",
  path: "/faqs",
});

const breadcrumb = [
  { name: "Home", path: "/" },
  { name: "FAQs", path: "/faqs" },
];

export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd(breadcrumb), faqJsonLd(faqs)]),
        }}
      />
      <div className="border-b border-white/[0.05] bg-navy-950/30">
        <div className="container-tight pb-16 pt-14">
          <Breadcrumb items={breadcrumb} />
          <SectionHeader
            as="h1"
            eyebrow="FAQs"
            title="Straight answers, before you ask."
            description="If a question is missing, ask it directly on a growth call — honest answers are part of the service."
          />
        </div>
      </div>

      <section className="section">
        <div className="container-tight max-w-3xl">
          <FAQAccordion items={faqs} defaultOpen={0} />
          <Reveal>
            <div className="mt-12 text-center">
              <h2 className="font-display text-2xl font-semibold">Still deciding?</h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] text-slate-400">
                A growth call is a conversation, not a commitment.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton label="Book a Growth Call" href="/growth-call" />
                <ButtonLink href="/contact" variant="secondary">
                  Send an Enquiry
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
