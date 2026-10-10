import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { AttributionCapture } from "@/components/layout/attribution-capture";
import { AnalyticsScripts } from "@/components/layout/analytics-scripts";
import { StickyMobileCTA } from "@/components/layout/sticky-mobile-cta";
import { siteConfig } from "@/lib/config";
import { organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Novaflo — Social Media Growth Agency in Anantapur",
    template: "%s | Novaflo",
  },
  description:
    "Novaflo helps ambitious businesses build a professional online presence through strategy, premium content and transparent reporting. Make your business the trusted name customers remember.",
  openGraph: {
    type: "website",
    siteName: "Novaflo",
    url: siteConfig.url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <ScrollProgress />
        <AttributionCapture />
        <AnalyticsScripts />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-navy-800 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
        <StickyMobileCTA />
      </body>
    </html>
  );
}
