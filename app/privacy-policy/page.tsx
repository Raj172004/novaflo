import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/section-header";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Novaflo collects, uses and protects information submitted through this website.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <article className="container-tight max-w-3xl py-14">
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }]} />
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: October 2026</p>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-slate-300">
        <section>
          <h2 className="font-display text-xl font-semibold">What Novaflo collects</h2>
          <p className="mt-2 text-slate-400">
            When you submit a form on this website, Novaflo collects the information you provide:
            your name, business name, phone number, email address, business type, city, Instagram
            handle (if provided), your marketing challenge or message, and your preferred contact
            method. Technical attribution information (the page you landed on and referring campaign
            parameters) is stored with your submission so Novaflo can understand where enquiries
            originate.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">How this information is used</h2>
          <p className="mt-2 text-slate-400">
            Your information is used only to review your enquiry and respond through your preferred
            contact method. Novaflo does not sell personal information and does not send unrelated
            marketing without consent.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Analytics</h2>
          <p className="mt-2 text-slate-400">
            If analytics is enabled, this website may use privacy-respecting analytics (such as
            Google Analytics with IP anonymisation) to understand aggregate website usage. Analytics
            is loaded only when configured, and no analytics cookies are used for advertising by
            this website itself.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Data retention and your rights</h2>
          <p className="mt-2 text-slate-400">
            Enquiry records are retained only as long as needed to respond and maintain a business
            relationship. You may request access to, correction of, or deletion of your information
            at any time using the contact details on the contact page.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Contact</h2>
          <p className="mt-2 text-slate-400">
            Questions about this policy can be sent through the{" "}
            <a href="/contact" className="text-accent-cyan hover:underline">
              contact page
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
