import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/section-header";

export const metadata: Metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "Novaflo does not guarantee followers, viral content, sales, bookings, leads or specific ROI.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <article className="container-tight max-w-3xl py-14">
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Disclaimer", path: "/disclaimer" }]} />
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Disclaimer</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: October 2026</p>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-slate-300">
        <section>
          <h2 className="font-display text-xl font-semibold">No guaranteed results</h2>
          <p className="mt-2 text-slate-400">
            Novaflo does not guarantee followers, viral videos, sales, bookings, leads or any
            specific return on investment. Social media performance depends on many factors beyond
            content, including market conditions, offers, competition and timing. What Novaflo
            commits to is a structured system: strategy, consistent premium content, clear enquiry
            pathways and transparent monthly reporting.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Demo and example content</h2>
          <p className="mt-2 text-slate-400">
            Interface examples shown on this website (such as content calendars and dashboards) are
            illustrative demos, clearly labelled as such. They do not represent actual client
            accounts, scheduled posts or performance data.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">External platforms</h2>
          <p className="mt-2 text-slate-400">
            Novaflo is not affiliated with Meta, Instagram, Facebook, YouTube or WhatsApp. Platform
            features, algorithms and policies are outside Novaflo's control and may change at any
            time.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Professional advice</h2>
          <p className="mt-2 text-slate-400">
            Content on this website is general information, not business, financial or legal advice.
          </p>
        </section>
      </div>
    </article>
  );
}
