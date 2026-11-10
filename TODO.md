# TODO: content and accounts needed from Rafa

Placeholders are marked `TODO` in the code. Items are grouped by where they live.

## `src/site.config.ts`

- [ ] **Upwork** profile URL (`links.upwork`)
- [ ] **Malt** profile URL (`links.malt`)
- [ ] **Contact email.** `hello@rafaelperetz.dev` won't receive mail until the domain is bought _and_ forwarding is set up (see README → Custom domain). Until then, use an address that works.
- [ ] **Availability** (`availability`: `available` | `limited` | `booked`). The limited/booked wording is in `messages/*.json → availability`.

## Content

- [ ] **Prices** (in `content/services/*/<locale>.md`), lowered in Nov 2026 at Rafa's request to win the first clients:
  - Full-stack app from $7,500 · CI/CD from $2,000 · Cloud & Kubernetes from $4,500 · retainer from $1,200/mo.
  - That's roughly $50–60/h effective, well below the mid-level market (~$85–100/h: freelancermap 2026, Arc 2026). Raise them once you have testimonials and case-study metrics.
- [ ] **Testimonials**: the section stays hidden until at least one exists. The design wants a founder or CTO outside Israel.
- [ ] **ASGO case study**: the text is the former ReySecurity one, renamed. Check that the description (non-human identities in CI/CD, AI agent fleet) still matches what ASGO does.
- [ ] **New stack items**: TypeScript, Next.js, Node.js and PostgreSQL were added for the full-stack positioning. Remove any you don't want to be asked about.
- [ ] **Case-study metrics**: outcome numbers make the case studies much stronger (e.g. deploy time, cost saved)
- [ ] **Brand mark / favicon**: the "RP" monogram is used for now

## Translations (drafted in Phase 4, please review)

- [ ] **French**: `messages/fr.json` and `content/**/fr.*`. Uses _vous_. The retainer is called "forfait DevOps mensuel".
- [ ] **Hebrew**: `messages/he.json` and `content/**/he.*`
  - Follows the design's own Hebrew lines, which address the reader in masculine singular ("בוא", "שלך", "ספר לי"). Consider gender-neutral or plural forms ("בואו", "ספרו לי") if you prefer.
  - Prices use the Hebrew convention (amount, then `$`: `2,500$`). Ranges are written in words ("2 עד 4 שבועות") because "2–4" renders reversed in RTL.
- [ ] Terminal-style text (the pipeline window, the 404 console, the mono "stack/focus" rows on case-study cards) intentionally stays English in every locale.

## Accounts / environment (Phase 5–6)

- [ ] **Resend** ([resend.com](https://resend.com), free tier):
  1. Create an API key → `RESEND_API_KEY`.
  2. Set `CONTACT_TO_EMAIL` to your Resend account email. Until `rafaelperetz.dev` is verified, Resend's test sender `onboarding@resend.dev` can only deliver to that address.
  3. After buying the domain, verify it in Resend and set `CONTACT_FROM_EMAIL="Rafael Peretz <hello@rafaelperetz.dev>"`.
- [ ] **Upstash Redis** (free tier) → `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- [ ] **GitHub repo** + **Vercel project** (Git integration)
- [ ] **Vercel Protection Bypass for Automation** secret → GitHub secret `VERCEL_AUTOMATION_BYPASS_SECRET` (needed for Lighthouse CI on previews)
- [ ] **Branch protection** on `main`: require the `Lint · Types · Build` and `Lighthouse (Preview)` checks (see README → Deployment)
- [ ] Enable **Web Analytics** and **Speed Insights** in the Vercel project
- [ ] **Domain** `rafaelperetz.dev`: bought and attached to Vercel (www is primary). Apex A record must point to `76.76.21.21` (216.198.79.1 timed out). Finish README → _Custom domain runbook_ (DNS, `NEXT_PUBLIC_SITE_URL`, Resend domain verification, email forwarding, Search Console)

## Optional

- [ ] Real uptime figure: the design's "uptime: 99.99%" was removed rather than faked. Add a status monitor (e.g. Better Stack, UptimeRobot) if you want it back.
