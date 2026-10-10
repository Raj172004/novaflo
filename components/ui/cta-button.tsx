"use client";

import { trackEvent } from "@/lib/analytics";
import { ButtonLink } from "./button";

/** Convenience CTA that also fires analytics. Use for primary conversion CTAs. */
export function CTAButton({
  label,
  href = "/growth-call",
  variant = "primary",
  size = "lg",
  className,
}: {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
}) {
  const isInternal = href.startsWith("/");
  const handleClick = () =>
    trackEvent(href === "/growth-call" ? "primary_cta_click" : "navigation_cta_click", { label, href });
  return (
    <ButtonLink href={href} variant={variant} size={size} className={className} onClick={handleClick}>
      {label}
      {isInternal ? <ArrowIcon /> : null}
    </ButtonLink>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8h9m0 0L8.75 4.25M12.5 8l-3.75 3.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
