import Link from "next/link";
import { NovaLogo } from "@/components/ui/nova-logo";
import { siteConfig, whatsappLink } from "@/lib/config";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/industries", label: "Industries" },
  { href: "/insights", label: "Insights" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services/social-media-strategy", label: "Strategy" },
  { href: "/services/instagram-management", label: "Instagram Management" },
  { href: "/services/content-production", label: "Premium Content" },
  { href: "/services/founder-personal-branding", label: "Personal Branding" },
  { href: "/services/reporting", label: "Reporting" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const wa = whatsappLink("footer");

  return (
    <footer className="border-t border-white/[0.06] bg-navy-950/60">
      <div className="container-tight pb-28 pt-14 lg:pb-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <NovaLogo className="h-7 w-auto" />
              <span className="font-display text-lg font-bold text-white">Novaflo</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Make your business the trusted name customers remember.
            </p>
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 hover:underline"
              >
                WhatsApp us →
              </a>
            ) : null}
          </div>

          <nav aria-label="Quick links">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {siteConfig.email ? (
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-5 inline-block text-sm text-slate-400 hover:text-white"
              >
                {siteConfig.email}
              </a>
            ) : null}
          </nav>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-6 text-sm text-slate-500">
          © {year} Novaflo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
