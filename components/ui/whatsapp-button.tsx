import { whatsappLink } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

interface Props {
  source?: string;
  className?: string;
  label?: string;
}

/** Reusable WhatsApp CTA. Renders nothing when no number is configured. */
export function WhatsAppButton({ source, className, label = "Chat on WhatsApp" }: Props) {
  const href = whatsappLink(source);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { source: source ?? "unknown" })}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-400/20"
      }
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.2L2 22l4.9-1.6A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.2-3 .9.9-2.9-.2-.3a8.1 8.1 0 0 1 6.7-12.6Zm-3.2 4c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.2s.9 2.6 1 2.8c.2.2 1.9 3 4.6 4.1 2.3.9 2.7.7 3.2.7.5-.1 1.6-.7 1.8-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4l-2-1c-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L9.6 8.2c-.2-.4-.4-.4-.6-.4h-.2Z" />
      </svg>
      {label}
    </a>
  );
}
