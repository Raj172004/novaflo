"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  validateGrowthCall,
  validateContact,
  CONTACT_METHODS,
  type FieldErrors,
} from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink, siteConfig } from "@/lib/config";

/* ───────────────────────── shared bits ───────────────────────── */

type Status = "idle" | "submitting" | "success" | "error";

function Field({
  label,
  htmlFor,
  error,
  children,
  optional,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label} {optional ? <span className="text-slate-500">(optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Honeypot() {
  return (
    <div className="absolute left-[-9999px] top-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label>
        Nickname
        <input type="text" name="nickname" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function ConsentCheckbox({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-400">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-navy-850 accent-[#4D8DFF]"
        />
        <span>
          I agree to be contacted by Novaflo about my enquiry and to the{" "}
          <Link href="/privacy-policy" className="text-accent-cyan hover:underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200" role="alert">
      Something went wrong. Please try again or contact Novaflo directly.
      <button
        type="button"
        onClick={onRetry}
        className="ml-2 font-semibold underline underline-offset-2"
      >
        Try again
      </button>
    </div>
  );
}

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { errors?: FieldErrors };
  return { ok: res.ok, data };
}

/* ───────────────────────── Growth Call Form ───────────────────────── */

export function GrowthCallForm() {
  const [values, setValues] = useState({
    name: "",
    business: "",
    phone: "",
    email: "",
    industry: "",
    city: "",
    instagram: "",
    challenge: "",
    contactMethod: "Phone Call",
    message: "",
    consent: false,
    nickname: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof typeof values) => (v: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { errors: errs, value } = validateGrowthCall(values);
    setErrors(errs);
    if (!value) return;
    setStatus("submitting");
    try {
      const { ok, data } = await postJSON("/api/leads/growth-call", value);
      if (ok) {
        trackEvent("growth_call_form_submit", { industry: value.industry, city: value.city });
        setStatus("success");
      } else {
        setErrors(data.errors ?? {});
        setStatus("idle");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="surface-card p-8 text-center sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-semibold">Thank you.</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-slate-400">
          Thanks. Your enquiry has been received. Novaflo will review the information and contact you
          through your preferred method.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {whatsappLink("growth_call_success") ? (
            <a
              href={whatsappLink("growth_call_success")!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/20"
            >
              Continue on WhatsApp
            </a>
          ) : null}
          <Link
            href="/how-it-works"
            className="text-sm font-semibold text-accent-cyan hover:underline"
          >
            See how the process works →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card relative p-6 sm:p-8">
      <Honeypot />
      {status === "error" ? (
        <div className="mb-6">
          <ErrorBanner onRetry={() => setStatus("idle")} />
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="gc-name" error={errors.name}>
          <input
            id="gc-name"
            className={`input-field ${errors.name ? "input-error" : ""}`}
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            autoComplete="name"
            required
          />
        </Field>
        <Field label="Business Name" htmlFor="gc-business" error={errors.business}>
          <input
            id="gc-business"
            className={`input-field ${errors.business ? "input-error" : ""}`}
            value={values.business}
            onChange={(e) => set("business")(e.target.value)}
            autoComplete="organization"
            required
          />
        </Field>
        <Field label="Phone Number" htmlFor="gc-phone" error={errors.phone}>
          <input
            id="gc-phone"
            type="tel"
            className={`input-field ${errors.phone ? "input-error" : ""}`}
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            autoComplete="tel"
            required
          />
        </Field>
        <Field label="Email" htmlFor="gc-email" error={errors.email}>
          <input
            id="gc-email"
            type="email"
            className={`input-field ${errors.email ? "input-error" : ""}`}
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Business Type / Industry" htmlFor="gc-industry" error={errors.industry}>
          <input
            id="gc-industry"
            className={`input-field ${errors.industry ? "input-error" : ""}`}
            value={values.industry}
            onChange={(e) => set("industry")(e.target.value)}
            placeholder="e.g. Clinic, salon, real estate…"
            required
          />
        </Field>
        <Field label="City / Location" htmlFor="gc-city" error={errors.city}>
          <input
            id="gc-city"
            className={`input-field ${errors.city ? "input-error" : ""}`}
            value={values.city}
            onChange={(e) => set("city")(e.target.value)}
            autoComplete="address-level2"
            required
          />
        </Field>
        <Field label="Instagram Handle" htmlFor="gc-instagram" error={errors.instagram} optional>
          <input
            id="gc-instagram"
            className="input-field"
            value={values.instagram}
            onChange={(e) => set("instagram")(e.target.value)}
            placeholder="@yourbusiness"
            autoComplete="off"
          />
        </Field>
        <Field label="Preferred Contact Method" htmlFor="gc-method" error={errors.contactMethod}>
          <select
            id="gc-method"
            className="input-field"
            value={values.contactMethod}
            onChange={(e) => set("contactMethod")(e.target.value)}
          >
            {CONTACT_METHODS.map((m) => (
              <option key={m} value={m} className="bg-navy-850">
                {m}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Main Marketing Challenge" htmlFor="gc-challenge" error={errors.challenge}>
          <textarea
            id="gc-challenge"
            rows={3}
            className={`input-field resize-y ${errors.challenge ? "input-error" : ""}`}
            value={values.challenge}
            onChange={(e) => set("challenge")(e.target.value)}
            placeholder="What is the biggest challenge with your social media right now?"
            required
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" htmlFor="gc-message" error={errors.message} optional>
          <textarea
            id="gc-message"
            rows={3}
            className="input-field resize-y"
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            placeholder="Anything else Novaflo should know?"
          />
        </Field>
      </div>

      <div className="mt-6">
        <ConsentCheckbox
          checked={values.consent}
          onChange={(v) => set("consent")(v)}
          error={errors.consent}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-7 py-3.5 text-[15px] font-semibold text-navy-950 shadow-glow transition-all hover:brightness-110 disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950/40 border-t-navy-950" />
            Sending…
          </>
        ) : (
          "Book My Growth Call"
        )}
      </button>
      <p className="mt-3 text-xs text-slate-500">
        Your details are used only to respond to this enquiry.
      </p>
    </form>
  );
}

/* ───────────────────────── Contact Form ───────────────────────── */

export function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactMethod: "Email",
    consent: false,
    nickname: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof typeof values) => (v: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { errors: errs, value } = validateContact(values);
    setErrors(errs);
    if (!value) return;
    setStatus("submitting");
    try {
      const { ok, data } = await postJSON("/api/leads/contact", value);
      if (ok) {
        trackEvent("contact_form_submit", { subject: value.subject });
        setStatus("success");
      } else {
        setErrors(data.errors ?? {});
        setStatus("idle");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="surface-card p-8 text-center sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-semibold">Enquiry sent.</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-slate-400">
          Thanks. Your enquiry has been received. Novaflo will review the information and contact you
          through your preferred method.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card relative p-6 sm:p-8">
      <Honeypot />
      {status === "error" ? (
        <div className="mb-6">
          <ErrorBanner onRetry={() => setStatus("idle")} />
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="ct-name" error={errors.name}>
          <input
            id="ct-name"
            className={`input-field ${errors.name ? "input-error" : ""}`}
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            autoComplete="name"
            required
          />
        </Field>
        <Field label="Business Name" htmlFor="ct-business" error={errors.business}>
          <input
            id="ct-business"
            className={`input-field ${errors.business ? "input-error" : ""}`}
            value={values.business}
            onChange={(e) => set("business")(e.target.value)}
            autoComplete="organization"
            required
          />
        </Field>
        <Field label="Email" htmlFor="ct-email" error={errors.email}>
          <input
            id="ct-email"
            type="email"
            className={`input-field ${errors.email ? "input-error" : ""}`}
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Phone" htmlFor="ct-phone" error={errors.phone} optional>
          <input
            id="ct-phone"
            type="tel"
            className={`input-field ${errors.phone ? "input-error" : ""}`}
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            autoComplete="tel"
          />
        </Field>
        <Field label="Subject" htmlFor="ct-subject" error={errors.subject}>
          <input
            id="ct-subject"
            className={`input-field ${errors.subject ? "input-error" : ""}`}
            value={values.subject}
            onChange={(e) => set("subject")(e.target.value)}
            required
          />
        </Field>
        <Field label="Preferred Contact Method" htmlFor="ct-method" error={errors.contactMethod}>
          <select
            id="ct-method"
            className="input-field"
            value={values.contactMethod}
            onChange={(e) => set("contactMethod")(e.target.value)}
          >
            {CONTACT_METHODS.map((m) => (
              <option key={m} value={m} className="bg-navy-850">
                {m}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" htmlFor="ct-message" error={errors.message}>
          <textarea
            id="ct-message"
            rows={5}
            className={`input-field resize-y ${errors.message ? "input-error" : ""}`}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            required
          />
        </Field>
      </div>

      <div className="mt-6">
        <ConsentCheckbox
          checked={values.consent}
          onChange={(v) => set("consent")(v)}
          error={errors.consent}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-7 py-3.5 text-[15px] font-semibold text-navy-950 shadow-glow transition-all hover:brightness-110 disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950/40 border-t-navy-950" />
            Sending…
          </>
        ) : (
          "Send Enquiry"
        )}
      </button>
      {siteConfig.email ? (
        <p className="mt-4 text-sm text-slate-500">
          Prefer email?{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-accent-cyan hover:underline">
            {siteConfig.email}
          </a>
        </p>
      ) : null}
    </form>
  );
}
