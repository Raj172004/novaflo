"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/** Sticky mobile-only CTA bar. Hidden on the growth-call page itself. */
export function StickyMobileCTA() {
  const pathname = usePathname();
  if (pathname === "/growth-call") return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-900/92 p-3 backdrop-blur-xl lg:hidden">
      <Link
        href="/growth-call"
        onClick={() => trackEvent("navigation_cta_click", { label: "sticky_mobile_cta" })}
        className="block rounded-xl bg-brand-gradient py-3.5 text-center text-[15px] font-semibold text-navy-950 shadow-glow"
      >
        Book a Growth Call
      </Link>
    </div>
  );
}
