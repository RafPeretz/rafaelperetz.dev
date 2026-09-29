# rafaelperetz.dev

[![CI](https://github.com/RafPeretz/rafaelperetz.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/RafPeretz/rafaelperetz.dev/actions/workflows/ci.yml)
[![Lighthouse](https://github.com/RafPeretz/rafaelperetz.dev/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/RafPeretz/rafaelperetz.dev/actions/workflows/lighthouse.yml)
![Lighthouse scores](https://img.shields.io/badge/lighthouse-95%2B%20%C2%B7%20100%20%C2%B7%20100%20%C2%B7%20100-9184d9)
![Next.js](https://img.shields.io/badge/Next.js-16-161826?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)

Portfolio and sales site for **Rafael Peretz, freelance DevOps & Cloud engineer**. The site is also a working sample of the engineering I sell: static-first, fast, accessible, localized (EN / FR / HE with full RTL), locked down with security headers, and shipped through a CI/CD pipeline with quality gates.

## Highlights

- **Static by default.** Every page in all three locales is pre-rendered at build time: 3 homepages, 9 case study pages and their Open Graph images. The only server code is the contact form's Server Action.
- **Animated CI/CD hero, zero JS for the first run.** The pipeline animation is pure CSS on server-rendered markup. Its resting state _is_ the final "✓ deployed" frame, so reduced-motion users, crawlers and no-JS visitors get the finished state. There's no layout shift, and it finishes in under 3 seconds.
- **i18n + RTL.** next-intl with locale routing (`/`, `/fr`, `/he`), logical CSS properties throughout, and mirrored layout for Hebrew. It also generates Hebrew Open Graph images, with a small bidi helper because satori has no RTL support. CI checks that every locale has the same keys as English.
- **Accessible.** Native `<dialog>` modal, keyboard navigation, visible focus, `prefers-reduced-motion`, and a script that fails the build if any colour pair drops below WCAG AA.
- **Secure.** A strict set of security headers (CSP, HSTS, frame, referrer and permissions policies). The contact form uses a honeypot, a minimum fill time and per-IP rate limiting, and all secrets stay server-side.
- **Quality gates on every PR:**
  - lint, format, type-check, i18n parity, contrast, build
  - an end-to-end smoke test in real Chrome
  - **Lighthouse CI against the actual Vercel preview**, which fails below 95

## Stack

| Area      | Choice                                                                                  |
| --------- | --------------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, React Server Components, Turbopack), React 19                   |
| Language  | TypeScript (strict, `noUncheckedIndexedAccess`, no `any`)                               |
| Styling   | Tailwind CSS v4, design tokens in CSS (`src/styles/tokens.css`)                         |
| Content   | Markdown/YAML + [Velite](https://velite.js.org) (zod-typed collections)                 |
| i18n      | next-intl (EN default, FR, HE/RTL)                                                      |
| Forms     | Server Action + zod/mini (shared client/server schema) + Resend + Upstash rate limiting |
| Booking   | Cal.com (embed lazy-loaded on intent, link fallback)                                    |
| Hosting   | Vercel (Git integration, preview per PR), Web Analytics + Speed Insights                |
| CI/CD     | GitHub Actions (SHA-pinned actions), Lighthouse CI, Dependabot                          |

## Architecture

```
Browser ──► Vercel edge (security headers, static HTML/CSS/JS from CDN)
              │
              ├─ proxy.ts (next-intl)  "/" → en, "/fr", "/he" · locale cookie / Accept-Language
              ├─ Static pages          [locale] · [locale]/work/[slug] · OG images · sitemap · robots
              └─ Server Action         submitContact → validate (zod) → rate-limit (Upstash) → email (Resend)

GitHub PR ──► CI: lint · format · types · i18n · contrast · build · smoke (Chrome)
          └─► Vercel preview deploy ──deployment_status──► Lighthouse CI on the preview URL (≥ 95)
main ──────► Vercel production deploy
```

## Project structure

```
content/                  Editable content (case studies, services, FAQ, stack, testimonials) per locale
messages/{en,fr,he}.json  Interface strings (identical keys)
src/
  site.config.ts          Name, domain, links, Cal.com slug, availability, feature flags
  proxy.ts                Locale routing
  app/[locale]/           Pages, modal slot (@modal), OG images, not-found
  app/actions/contact.ts  Contact form Server Action
  app/sitemap.ts, robots.ts
  components/             layout/, sections/, hero/, case-study/, contact/, ui/
  lib/                    content accessors, SEO/JSON-LD, schema, rate limit, OG rendering, bidi
  styles/tokens.css       Design tokens (single source of truth)
scripts/                  contrast + i18n guards, smoke test, screenshots, Lighthouse summary
.github/                  CI + Lighthouse workflows, Dependabot
```

See [CLAUDE.md](CLAUDE.md) for conventions, and [TODO.md](TODO.md) for content that's still needed.

## Getting started

Requirements: Node ≥ 22 and pnpm 10 (`corepack enable` picks up the pinned version).

```bash
pnpm install
cp .env.example .env.local   # optional locally: the form shows its fallback without keys
pnpm dev                     # http://localhost:3000
```

| Command                                        | What it does                                             |
| ---------------------------------------------- | -------------------------------------------------------- |
| `pnpm dev`                                     | Velite (content, watch mode) + Next dev server           |
| `pnpm build` / `pnpm start`                    | Production build / serve it                              |
| `pnpm lint` · `pnpm format` · `pnpm typecheck` | ESLint · Prettier · `next typegen && tsc`                |
| `pnpm check:i18n`                              | FR/HE message keys and placeholders match EN             |
| `pnpm check:contrast`                          | All design-token text pairs meet WCAG AA (dark + light)  |
| `pnpm smoke [url]`                             | End-to-end smoke test against a running build            |
| `node scripts/screenshot.mjs <url> [paths]`    | Full-page screenshots at 375/768/1280/1920, dark + light |

### Environment variables

| Variable                            | Required                | Purpose                                                                      |
| ----------------------------------- | ----------------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`              | once the domain is live | Canonical origin (defaults to the Vercel production URL)                     |
| `RESEND_API_KEY`                    | production              | Sends contact form emails                                                    |
| `CONTACT_TO_EMAIL`                  | production              | Inbox for enquiries (your Resend account email until the domain is verified) |
| `CONTACT_FROM_EMAIL`                | optional                | Sender; defaults to `Portfolio <onboarding@resend.dev>`                      |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | production              | Rate limiting (3 messages / 10 min / IP); skipped with a warning if unset    |

## Editing content

- **Text and case studies:** `content/**/<locale>.md`. Frontmatter is validated at build time, so a typo fails the build instead of breaking the page. A missing FR/HE file falls back to English.
- **Interface strings:** `messages/<locale>.json`. `pnpm check:i18n` keeps the locales in sync.
- **Links, availability, Cal.com, analytics:** `src/site.config.ts`.
- **Testimonials:** add `content/testimonials/<client>/<locale>.md`. The section appears automatically.

## CI/CD

| Stage                                                                      | Where                                                                    | Gate                            |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------- |
| Lint, format, type-check, i18n parity, contrast, build, smoke test         | `.github/workflows/ci.yml`, every PR + `main`                            | must pass                       |
| Preview deployment                                                         | Vercel Git integration, every PR                                         | —                               |
| Lighthouse (mobile, median of 3) on `/`, `/fr`, `/he`, `/work/reysecurity` | `.github/workflows/lighthouse.yml`, on each successful Vercel deployment | all categories ≥ 95, CLS ≤ 0.05 |
| Production deployment                                                      | Vercel, on merge to `main`                                               | —                               |

The Lighthouse job reports a score table in the run summary and uploads the full reports as an artifact.

## Deployment (Vercel)

1. **Import the GitHub repo** in Vercel. The framework is detected automatically; the build command `pnpm build` and Node 22 come from `package.json`.
2. **Environment variables** (Project → Settings → Environment Variables): add those in the table above to _Production_ and _Preview_.
3. **Protection bypass for Lighthouse.** Go to Project → Settings → Deployment Protection → _Protection Bypass for Automation_ and generate a secret. In GitHub, add it as the repository secret `VERCEL_AUTOMATION_BYPASS_SECRET`. Without it, Lighthouse would audit Vercel's login page instead of the preview.
4. **Branch protection on `main`** (GitHub → Settings → Branches): require the `Lint · Types · Build` and `Lighthouse (Preview)` checks and a PR before merging.
5. Enable **Web Analytics** and **Speed Insights** in the Vercel project. The site already includes both, controlled by `features.analytics` in `site.config.ts`.

## Custom domain runbook (rafaelperetz.dev)

Once the domain is bought:

1. **Add the domain** in Vercel → Project → Settings → Domains: add `rafaelperetz.dev` and `www.rafaelperetz.dev`, and set `www` to redirect (308) to the apex.
2. **DNS** at the registrar, using one of these options:
   - **Nameservers:** point them to Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`), or
   - **Records:** apex `A 76.76.21.21`, and `www CNAME cname.vercel-dns.com`. Use the exact values Vercel shows.

   Wait until Vercel shows _Valid Configuration_. HTTPS certificates are issued automatically.

3. **Canonical URL:** set `NEXT_PUBLIC_SITE_URL=https://rafaelperetz.dev` for Production and redeploy. The canonical links, hreflang, sitemap, robots, Open Graph and JSON-LD all switch to the domain.
4. **Sending email:** in Resend → Domains, add `rafaelperetz.dev` and create the SPF, DKIM and (recommended) DMARC records it lists. Once verified, set `CONTACT_FROM_EMAIL="Rafael Peretz <hello@rafaelperetz.dev>"`.
5. **Receiving email** at `hello@`: use Cloudflare Email Routing, ImprovMX, or a mailbox provider. Add their MX/TXT records; don't overwrite the Resend ones.
6. **Search:** add the domain in Google Search Console (DNS TXT verification) and submit `https://rafaelperetz.dev/sitemap.xml`.
7. **Optional, once it's stable:** submit the domain to [hstspreload.org](https://hstspreload.org). The HSTS header already has `includeSubDomains; preload`. Preloading is hard to undo, so do it only when every subdomain serves HTTPS.

## Security notes

- **CSP:**
  - Pages are statically generated, so per-request nonces aren't possible without giving up the CDN. See the [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy).
  - `script-src` therefore allows `'self' 'unsafe-inline'`, plus Cal.com only.
  - Everything else is locked down: `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`.
  - The Vercel preview toolbar is allowed on preview deployments only.
- **Secrets:** Resend and Upstash are only called server-side, and their keys never reach the browser. The server environment is validated with zod when first used.
- **Supply chain:** third-party GitHub Actions are pinned to commit SHAs and updated by Dependabot. `pnpm install --frozen-lockfile` runs in CI, and only allow-listed packages may run install scripts.
- **Indexing:** preview deployments send `noindex` and a disallow-all `robots.txt`, so only production is indexable.

---

© Rafael Peretz. The code is shared for review; the content and design are not licensed for reuse.
