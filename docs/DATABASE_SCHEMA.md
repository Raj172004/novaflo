# NOVAFLO — Database Schema (Future)

The site currently uses Firebase Firestore through `lib/leads.ts`. If migrating to another database (Postgres/Supabase/PlanetScale/SQLite), preserve the lead-service interface and keep API routes independent of database details.
Use this schema for the relational database design. Relationships are FK-first; secrets are never stored in the database.

## Tables

### users
| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| email | text UNIQUE NOT NULL | login identifier |
| password_hash | text NOT NULL | argon2/bcrypt |
| name | text | |
| role | text | `admin` \| `editor` \| `client` (role-based permissions) |
| created_at | timestamptz | |

### companies
| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text NOT NULL | |
| industry | text | |
| city | text | |
| instagram_handle | text | |
| owner_user_id | uuid FK → users | nullable |
| created_at | timestamptz | |

### leads
| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| type | text | `growth_call` \| `contact` |
| status | text | `new` `contacted` `qualified` `proposal` `won` `lost` |
| name / business / phone / email | text | contact identity |
| industry / city / instagram | text | nullable |
| challenge / subject / message | text | nullable |
| contact_method | text | phone \| whatsapp \| email |
| company_id | uuid FK → companies | nullable, set when qualified |
| source | text | instagram, facebook, google, whatsapp, organic, referral, website, other |
| landing_page | text | |
| utm_source / utm_medium / utm_campaign / utm_content / utm_term | text | nullable |
| created_at | timestamptz | |

### services / service_categories
| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| category_id | uuid FK → service_categories | nullable |
| slug | text UNIQUE | |
| name / short / description / outcome | text | |
| includes | jsonb | string[] |
| icon | text | lucide key |
| published | boolean | admin CMS toggle |
| sort_order | integer | |

### insights
| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| slug | text UNIQUE | |
| title / excerpt | text | |
| body | jsonb | paragraph blocks |
| category | text | one of insightCategories |
| author | text | |
| cover_image | text | nullable |
| seo_title / seo_description / og_image | text | nullable |
| published | boolean | |
| publish_date | timestamptz | |
| reading_time | text | |

### case_studies
| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| company_id | uuid FK → companies | nullable until approved |
| status | text | `draft` `client_review` `approved` `published` |
| context / challenge / strategy / content_approach / delivered / measured_result / testimonial / lessons / next_steps | text | the 9-part structure |
| metrics | jsonb | only real, approved numbers |
| published | boolean | |

### faqs
| id | uuid PK | | | — | | slug |
| --- | --- | --- | --- | --- | --- | --- |
| question / answer | text NOT NULL | |
| sort_order | integer | |
| published | boolean | |

### content_items
| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| company_id | uuid FK → companies | |
| title | text | |
| format | text | reel, carousel, static, story, video |
| platform | text | instagram, facebook, youtube_shorts |
| topic / hook / script / caption / cta / notes | text | nullable |
| media | jsonb | asset refs |
| scheduled_date | date | nullable |
| approval_status | text | `draft` `internal_review` `client_review` `changes_requested` `approved` `scheduled` `published` |
| reviewed_by | uuid FK → users | nullable |
| reviewed_at | timestamptz | |

### content_calendar
| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| company_id | uuid FK → companies | |
| month | date | first of month |
| view | text | month \| week \| list (UI preference) |

*(Calendar is derived from content_items.scheduled_date; this table stores per-client planning metadata.)*

### analytics_events
| column | type | notes |
| --- | --- | --- |
| id | bigserial PK | |
| name | text | growth_call_form_submit, whatsapp_click, … |
| path | text | |
| session_id | text | first-party, anonymous |
| props | jsonb | |
| created_at | timestamptz | |

### contact_submissions
Merged into `leads` (type = `contact`) — kept as a view for admin filtering.

### settings
| column | type | notes |
| --- | --- | --- |
| key | text PK | e.g. hero_heading, cta_label |
| value | jsonb | editable without deploys |
| updated_by | uuid FK → users | |
| updated_at | timestamptz | |

### site_announcements
| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| message | text | |
| link | text | nullable |
| active | boolean | |
| starts_at / ends_at | timestamptz | nullable |

## Migration notes

1. `lib/leads.ts` interface is intentionally tiny: `readLeads`, `addLead`, `updateLeadStatus`,
   `forwardToWebhook`. The current implementation uses Firestore. Preserve the lead-service interface when refactoring; API routes should remain independent of database details.
2. Attribution columns are denormalized onto `leads` on purpose — lead source reporting stays a
   single-table query.
3. The admin session model (`lib/auth.ts`) already supports swapping to `users` table auth.
4. Never store API keys, WhatsApp tokens or CRM credentials in the database; env only.
