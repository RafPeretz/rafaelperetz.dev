# TODO: content and accounts needed from Rafa

Placeholders are marked `TODO` in the code. Items are grouped by where they live.

## `src/site.config.ts`

- [ ] **GitHub** profile URL (`links.github`)
- [ ] **LinkedIn** profile URL (`links.linkedin`)
- [ ] **Upwork** profile URL (`links.upwork`)
- [ ] **Malt** profile URL (`links.malt`)
- [ ] **Cal.com** event slug (`links.cal`, e.g. `rafaelperetz/20min`). Create a 20-minute event at cal.com. The popup and link already use this value.
- [ ] **Contact email.** `hello@rafaelperetz.dev` won't receive mail until the domain is bought _and_ forwarding is set up (see README → Custom domain). Until then, use an address that works.
- [ ] **Availability** (`availability`: `available` | `limited` | `booked`). The limited/booked wording is in `messages/*.json → availability`.

## Content

- [ ] **Prices**: the three packages plus the retainer "from $___/mo"
- [ ] **Portrait photo**: ideally shot on a dark background (the design blends it with `mix-blend-mode: lighten`). At least 880×1100px.
- [ ] **Testimonials**: the section stays hidden until at least one exists. The design wants a founder or CTO outside Israel.
- [ ] **Case-study metrics**: outcome numbers make the case studies much stronger (e.g. deploy time, cost saved)
- [ ] **Confirm "Porsche Digital"** in the "Experience with" strip. It isn't mentioned anywhere else in your bio.
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
- [ ] **Domain** `rafaelperetz.dev`: buy it, then follow README → Custom domain

## Optional

- [ ] Real uptime figure: the design's "uptime: 99.99%" was removed rather than faked. Add a status monitor (e.g. Better Stack, UptimeRobot) if you want it back.
