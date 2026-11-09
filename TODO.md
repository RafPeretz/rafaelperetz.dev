# TODO: content and accounts needed from Rafa

Placeholders are marked `TODO` in the code. Items are grouped by where they live.

## `src/site.config.ts`

- [ ] **Upwork** profile URL (`links.upwork`)
- [ ] **Malt** profile URL (`links.malt`)
- [ ] **Cal.com**: create a free account at cal.com and a 20-minute event, then set `links.cal` in `src/site.config.ts` (e.g. `"rafaelperetz/20min"`). Until then every "Book a call" button scrolls to the contact form, and the smoke test checks that a configured link really exists.
- [ ] **Contact email.** `hello@rafaelperetz.dev` won't receive mail until the domain is bought _and_ forwarding is set up (see README → Custom domain). Until then, use an address that works.
- [ ] **Availability** (`availability`: `available` | `limited` | `booked`). The limited/booked wording is in `messages/*.json → availability`.

## Content

- [ ] **Review the prices** (set in Nov 2026 from market data, in `content/services/*/<locale>.md`):
  - Full-stack app from $12,000 · CI/CD from $3,500 · Cloud & Kubernetes from $7,500 · retainer from $2,000/mo.
  - Basis: ~$85–100/h effective for a mid-level freelancer (freelancermap 2026, Germany/Austria/Switzerland: ~€100/h for IT infrastructure, ~€91/h for development; Arc 2026, full-stack worldwide: $61–80/h), times the effort in days for each package's duration.
  - These sit at the accessible end of the market, which suits winning the first clients. Raise them once you have testimonials.
- [ ] **Testimonials**: the section stays hidden until at least one exists. The design wants a founder or CTO outside Israel.
- [ ] **asgo.dev case study**: the text is the former ReySecurity one, renamed. Check that the description (non-human identities in CI/CD, AI agent fleet) still matches what asgo.dev does.
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
- [ ] **Domain** `rafaelperetz.dev`: buy it, then follow README → _Custom domain runbook_ (DNS, `NEXT_PUBLIC_SITE_URL`, Resend domain verification, email forwarding, Search Console)

## Optional

- [ ] Real uptime figure: the design's "uptime: 99.99%" was removed rather than faked. Add a status monitor (e.g. Better Stack, UptimeRobot) if you want it back.
