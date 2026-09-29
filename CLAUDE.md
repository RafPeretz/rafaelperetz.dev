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
pnpm dev              # dev server (http://localhost:3000)
pnpm build            # production build; routes must stay ○/● (static), except the catch-all 404
pnpm start            # serve the production build
pnpm lint             # ESLint (flat config); `next lint` no longer exists in Next 16
pnpm typecheck        # next typegen && tsc --noEmit
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
scripts/                  # contrast check, screenshots
```

## Conventions

- **Server Components by default.** Add `"use client"` only for interactivity (menu, theme, animations, form). Pass server-rendered content into client islands as `children` instead of moving it client-side.
- **Static by default.** Pages read only `params`. Never use `cookies()`, `headers()` or `searchParams` in pages. Every page calls `setRequestLocale(locale)`, and `[locale]/layout.tsx` sets `generateStaticParams` + `dynamicParams = false`.
- **Tokens only.** Use colours such as `bg-bg`, `text-fg-muted`, `text-accent-text`, `border-divider`, and never raw hex. The default Tailwind palette is disabled. For accent-coloured *text* use `accent-text` (AA-safe in light mode); `accent` is for lines, icons and glows. After changing tokens, run `pnpm check:contrast`.
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

## Commits

One commit per phase or logical change. Use a short imperative subject with the scope first, e.g. `feat(hero): …`, `chore(ci): …`.
