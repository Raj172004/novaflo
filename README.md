# NOVAFLO — Website

> Make your business the trusted name customers remember.

A complete, dynamic website for **Novaflo**, a social media growth agency for local and growing
businesses (initially Anantapur and nearby service areas). Built as a conversion-focused growth
system: credibility + lead generation + strategic positioning.

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3** — custom premium dark design system (deep navy, electric blue / cyan / violet)
- **lucide-react** icons
- Zero-dependency lead storage (JSON file) with optional CRM webhook forwarding
- Lightweight IntersectionObserver animations (no heavy animation library)

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

## Configuration

Copy `.env.example` to `.env.local`. **Everything is optional** — the site is fully functional
with a blank env file. Values left empty are hidden from the website (no fake contact details,
no invented WhatsApp numbers, no fake stats).

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph |
| `NEXT_PUBLIC_NOVAFLO_EMAIL` / `_PHONE` / `_WHATSAPP` / `_INSTAGRAM` / `_LOCATION` | Verified contact details (shown only when set) |
| `NEXT_PUBLIC_WHATSAPP_MESSAGE` | Pre-filled WhatsApp message |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | Analytics (loads only when set) |
| `CRM_WEBHOOK_URL` | Server-side: every lead is POSTed here as JSON when set |
| `BOOKING_URL` | External booking link (Calendly etc.) |
| `ADMIN_PASSWORD` + `LEADS_SECRET` | Enables the `/admin` panel (HMAC-signed session cookie) |
| `LEADS_DIR` | Lead storage directory (default `./.data`) |

Generate a secret: `openssl rand -hex 32`

## Routes

Marketing: `/` · `/about` · `/services` (+6 service detail pages) · `/how-it-works` ·
`/industries` · `/insights` · `/faqs` · `/business-owners`

Conversion: `/growth-call` · `/contact`

Legal: `/privacy-policy` · `/terms-and-conditions` · `/disclaimer`

System: `/admin` (leads panel) · `/sitemap.xml` · `/robots.txt` · custom 404

API: `POST /api/leads/growth-call` · `POST /api/leads/contact` ·
`POST/DELETE /api/admin/login` · `GET/PATCH /api/admin/leads`

## Architecture

```
app/                  # App Router pages + API routes
components/
  ui/                 # Buttons, cards, accordion, empty states…
  layout/             # Navbar, footer, sticky CTA, attribution, analytics
  sections/           # Reveal, process timeline, roadmap, trust flow
  visuals/            # Hero visual (demo-labelled phone + dashboard cards)
  forms/              # GrowthCallForm, ContactForm
data/                 # Content as data (services, faqs, industries, process…)
lib/                  # config, seo, validation, leads, auth, rate-limit, attribution
```

Business content lives in `data/` — edit services/FAQs/industries there without touching UI.

## Lead Flow

Visitor → Growth Call Form → client validation → **server re-validation** → honeypot +
rate limit → lead stored (`.data/leads.json`) with UTM attribution → optional CRM webhook →
success screen with optional WhatsApp CTA.

Leads are manageable at `/admin` (statuses: new → contacted → qualified → proposal → won/lost).

## Content Rules (enforced by design)

No fake testimonials, client logos, metrics or case studies. Insights and case studies show
elegant empty states until real, approved content exists. Demo UI (hero phone, calendar) is
labelled **Demo**. No guarantees of followers, virality, sales or ROI anywhere.

## Future-Ready

The codebase is structured for: client portal (content approval states already modelled),
content calendar, CRM, WhatsApp automation, booking integration, and multilingual content —
see `docs/DATABASE_SCHEMA.md` for the full future database design.
