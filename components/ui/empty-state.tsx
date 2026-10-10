import Link from "next/link";

interface Props {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="surface-card mx-auto flex max-w-xl flex-col items-center px-8 py-14 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400">
        {icon ?? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <path d="M3 9h18M9 22h6" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-slate-400">{description}</p>
      {action ? (
        <Link
          href={action.href}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cyan hover:underline"
        >
          {action.label} →
        </Link>
      ) : null}
    </div>
  );
}
