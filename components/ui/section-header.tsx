import Link from "next/link";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
}

export function SectionHeader({ eyebrow, title, description, align = "center", as = "h2" }: Props) {
  const Tag = as;
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="mb-4">
          <span className="eyebrow">{eyebrow}</span>
        </p>
      ) : null}
      <Tag className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        {title}
      </Tag>
      {description ? (
        <p className="mt-4 text-[17px] leading-relaxed text-slate-400">{description}</p>
      ) : null}
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export function Breadcrumb({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-slate-300">
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className="transition-colors hover:text-accent-cyan">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
