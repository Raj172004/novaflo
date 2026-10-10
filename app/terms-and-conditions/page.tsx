import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/section-header";

export const metadata: Metadata = pageMetadata({
  title: "Terms and Conditions",
  description: "Terms governing the use of the Novaflo website and enquiries.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <article className="container-tight max-w-3xl py-14">
      <Breadcrumb
        items={[{ name: "Home", path: "/" }, { name: "Terms and Conditions", path: "/terms-and-conditions" }]}
      />
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Terms and Conditions
      </h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: October 2026</p>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-slate-300">
        <section>
          <h2 className="font-display text-xl font-semibold">Website use</h2>
          <p className="mt-2 text-slate-400">
            This website provides information about Novaflo's services. Content on this website is
            provided in good faith for general information only; Novaflo makes no representation or
            warranty of any kind regarding accuracy, adequacy or completeness.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Enquiries and engagements</h2>
          <p className="mt-2 text-slate-400">
            Submitting a form or booking a growth call creates an enquiry, not a client
            relationship. Service scope, deliverables and commercial terms are defined in a written
            agreement before any engagement begins. Pricing is shared only in a proposal after scope
            is understood.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Intellectual property</h2>
          <p className="mt-2 text-slate-400">
            All approved content created for a client is owned by that client. Novaflo retains
            ownership of its frameworks, templates and internal processes. Website content and
            branding are the property of Novaflo.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Limitation of liability</h2>
          <p className="mt-2 text-slate-400">
            Novaflo is not liable for indirect or consequential losses arising from use of this
            website. Nothing on this website constitutes a guarantee of results — see the{" "}
            <a href="/disclaimer" className="text-accent-cyan hover:underline">
              Disclaimer
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
