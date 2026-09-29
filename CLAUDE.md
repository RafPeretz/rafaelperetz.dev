@AGENTS.md

# rafaelperetz.dev

Freelance portfolio for Rafael "Rafa" Peretz, a DevOps & Cloud engineer. The site is a sales tool, and also a showcase of engineering quality: it must stay fast, accessible, and cleanly built.

The design source is `Design/Rafa's portfolio mockup/Rafa Peretz Portfolio.dc.html`, a Claude Design export built on the Nocturne design system. It's for reference only and is never imported or built.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19) + **TypeScript strict** (`noUncheckedIndexedAccess`, no `any`)
- **Tailwind CSS v4**, configured in CSS (`@theme` in `src/styles/tokens.css`). There is no `tailwind.config`.
- **next-intl**: `en` (default, unprefixed), `fr`, `he` (RTL). Messages are in `messages/*.json`.
- **next-themes**: `data-theme` on `<html>`, dark by default
- **@phosphor-icons/react**: always import from `@phosphor-icons/react/ssr` with the `*Icon` names (e.g. `SunIcon`)
- **pnpm 10** (pinned in `packageManager`), Node ≥ 22

## Commands

```bash
pnpm dev              # Velite (content, watch) + next dev (http://localhost:3000)
pnpm build            # velite build && next build; routes must stay ○/● (static), except the catch-all 404
pnpm start            # serve the production build
pnpm lint             # ESLint (flat config); `next lint` no longer exists in Next 16
pnpm typecheck        # velite build && next typegen && tsc --noEmit
pnpm content          # rebuild the content layer (.velite/) only
pnpm format           # Prettier (+ Tailwind class sorting)
pnpm check:contrast   # WCAG AA guard over the colour tokens, dark + light
node scripts/screenshot.mjs http://localhost:3000 / [paths…]  # full-page shots at 375/768/1280/1920, dark+light
```

## Project structure

```
src/
  site.config.ts          # identity, links, Cal.com, availability, feature flags; edit this, not components
  proxy.ts                # next-intl locale routing (Next 16's replacement for middleware.ts)
  app/
    globals.css           # Tailwind entry, base styles, Nocturne component classes (.btn, .input, .tag)
    fonts.ts              # next/font (Inter, JetBrains Mono)
    [locale]/             # root layout (<html>), pages, not-found, catch-all → 404
  components/
    layout/               # header, footer, menu, theme + locale switchers
    ui/                   # primitives (Button, BrandMark)
  i18n/                   # routing, request config, locale-aware Link/usePathname
  lib/                    # utilities
  styles/tokens.css       # design tokens: the single source of truth for colour/type/radius/shadow/motion
messages/{en,fr,he}.json  # UI strings; all three files keep identical keys
content/                  # editable content (Velite, schemas in velite.config.ts)
  work/<slug>/<locale>.md       # case studies (card + Context → Challenge → Built → Stack → Outcome)
  services/<slug>/<locale>.md   # packages + retainer (kind: package | retainer)
  faq/<slug>/<locale>.md        # question in frontmatter, answer as Markdown body
  testimonials/<slug>/<locale>.md  # section hidden while empty
  stack/<locale>.yml            # stack groups
velite.config.ts          # content schemas; output → .velite/ (imported as #site/content)
scripts/                  # contrast check, screenshots
```

## Content

- Copy that the owner edits lives in `content/` (Velite, typed via zod schemas in `velite.config.ts`). Interface strings live in `messages/`.
- A missing `<locale>` file falls back to English (`src/lib/content.ts`). Read content only through those accessors.
- Content icons are validated names from `src/content-icons.ts`, rendered by `ContentIcon`. To add an icon, update both.
- Velite runs as its own process (`next.config.ts` can't use top-level await in Next 16).

## Conventions

- **Server Components by default.** Add `"use client"` only for interactivity (menu, theme, animations, form). Pass server-rendered content into client islands as `children` instead of moving it client-side.
- **Static by default.** Pages read only `params`, via `resolveLocale(params)` from `@/i18n/server` (narrows the type + `setRequestLocale`). Never use `cookies()`, `headers()` or `searchParams` in pages. Every page calls `setRequestLocale(locale)`, and `[locale]/layout.tsx` sets `generateStaticParams` + `dynamicParams = false`.
- **Tokens only.** Use colours such as `bg-bg`, `text-fg-muted`, `text-accent-text`, `border-divider`, and never raw hex. The default Tailwind palette is disabled. For accent-coloured _text_ use `accent-text` (AA-safe in light mode); `accent` is for lines, icons and glows. After changing tokens, run `pnpm check:contrast`.
- **Text emphasis steps:** `fg` > `fg-soft` (78%) > `fg-muted` (72%) > `fg-subtle` (62%) > `fg-faint` (55%).
- **Type scale:** `text-display`, `text-display-cta`, `text-h2`, `text-stat`, `text-case`. Don't name a size token after a colour token; `text-section` would collide with `--color-section`.
- **Layout helpers:** `container-page` (1200px max + fluid gutter), `section-pad`, `font-mono-ui`. Desktop nav breakpoint: `nav:` (900px).
- **RTL.** Use logical properties only (`ms-*`, `me-*`, `ps-*`, `start-*`, `text-start`, `border-s`). Mirror directional icons in RTL. Code, terminal and pipeline visuals stay `dir="ltr"`.
- **Theme-dependent UI** renders both variants and switches with the `light:` variant. Never branch on `useTheme()` during render, because it causes hydration mismatches.
- **Links.** Use `Link` from `@/i18n/navigation` for internal links (it adds the locale prefix), and plain `<a>` for external ones.
- **Strings** go in `messages/*.json`, never hard-coded in components. Add every key to all three locale files.
- **Placeholders** carry a `TODO` comment and are listed in `TODO.md`.
- **Reduced motion:** every animation must have a final-state fallback under `prefers-reduced-motion`.
- **Imports:** `@/*` maps to `src/*`. Type-only imports use inline `type`.

## Contact form & booking

- `src/lib/contact-schema.ts` is shared by the browser and the Server Action (`src/app/actions/contact.ts`). It uses **`zod/mini`** because it ships to the client; full zod added about 400 KB raw. Server-only code (`lib/env.ts`) may use full `zod`.
- Validation issues are **codes** (`required`, `invalid`, `tooShort`, `tooLong`), and each locale maps them to its own strings.
- Spam protection:
  - A honeypot field (`website`).
  - A minimum fill time (`startedAt`, 3s). Bots get a fake success.
  - Upstash rate limit: 3 per 10 min per IP. It's skipped with a warning when the env vars are missing, and fails open if Redis is down.
- The form submits via `startTransition(formAction)` in `onSubmit`, so React doesn't reset the fields after a failed send. `action={formAction}` stays for no-JS.
- `BookCallButton` is a real cal.com link. Cal's embed loads on first hover/focus, and the click opens Cal's popup only if the embed is ready.

## Case studies

- `/[locale]/work/[slug]` is the standalone, indexable page. `@modal/(.)work/[slug]` intercepts the same URL from the homepage and shows it in a native `<dialog>`; closing it calls `router.back()`.
- `@modal/default.tsx`, `@modal/page.tsx` and `@modal/[...rest]` all render `null`, which closes the modal on other navigations. The slot's catch-all must share the page catch-all's param name (`rest`).
- Both routes use `CaseStudyBody`. The homepage cards link with `scroll={false}`.

## i18n / RTL

- Locales: `en` (default, served at `/`), `fr` (`/fr`), `he` (`/he`, RTL). `/` redirects returning or `Accept-Language` visitors to their locale (next-intl detection + cookie). Playwright scripts pin `locale: "en-US"` for that reason.
- `pnpm check:i18n` verifies that all locales have the same keys and placeholders as `en.json`.
- Hebrew uses Noto Sans Hebrew (`--font-hebrew`, only on `/he`, not preloaded). Inter has no Hebrew glyphs; the font stacks fall through per glyph.
- Bidi pitfalls: numeric ranges like "2–4" render reversed inside Hebrew text, so use words ("2 עד 4"). Currency goes after the number (`2,500$`). Email inputs get `dir="ltr"`.
- The French nav is long: the status pill is hidden for `:lang(fr)` below 1100px (see globals.css).

## Motion & interactions

- **CSS first, no animation library in the bundle.** Page-level effects are driven by data attributes and handled by one client island, `src/components/interactions.tsx`:
  - `data-reveal`: fade/slide in on scroll. Only elements below the fold at load are hidden, so there's no flash and no JS is needed.
  - `data-count="N"`: count-up.
  - `.glow-card`: cursor glow via `--mx`/`--my`.
  - `data-magnetic`: magnetic buttons, on fine pointers only.
- **Hero pipeline** (`components/hero/`) is pure CSS. Timings live in `pipeline-timeline.ts` and reach the markup as `--pl-*` variables; the classes are under "Hero pipeline timeline" in `globals.css`.
  - The markup's resting state is the final "✓ deployed" state. Animations only hold earlier states for a time window, so reduced motion, no-JS and crawlers get the finished pipeline.
  - "Re-run" toggles `.pl-reset` on `[data-pipeline-root]` to restart every animation.
  - Keep the whole run under 3s, and prefer `opacity`/`transform` (compositor) for anything new.
  - The log area has a reserved `min-height` so the window never changes size (CLS).
- Everything respects `prefers-reduced-motion` (global rule in `globals.css`, plus JS checks).
- Links to in-page anchors on the homepage (`/#services`) use `prefetch={false}`, as do locale-switcher links.

## Commits

One commit per phase or logical change. Use a short imperative subject with the scope first, e.g. `feat(hero): …`, `chore(ci): …`.
