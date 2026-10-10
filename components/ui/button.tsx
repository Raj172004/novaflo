import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 select-none disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-gradient text-navy-950 shadow-glow hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "border border-white/15 bg-white/[0.04] text-white hover:border-accent-cyan/50 hover:bg-white/[0.07]",
  ghost: "text-slate-300 hover:text-white",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-[15px]",
};

interface InnerProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: InnerProps & ComponentProps<"button">) {
  return (
    <button className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
  ...rest
}: InnerProps & ComponentProps<typeof Link> & { external?: boolean }) {
  const cls = cx(base, variants[variant], sizes[size], className);
  if (external) {
    const anchorProps = rest as Record<string, unknown>;
    const externalHref = typeof href === "string" ? href : String((href as { pathname?: string })?.pathname ?? "");
    return (
      <a href={externalHref} target="_blank" rel="noopener noreferrer" className={cls} {...anchorProps}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

