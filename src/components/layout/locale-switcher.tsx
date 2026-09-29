"use client";

import { usePathname } from "next/navigation";

import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const NAMES: Record<Locale, string> = { en: "English", fr: "Français", he: "עברית" };

/** "/fr/work/x" → "/work/x"; "/" stays "/". */
function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (first && (routing.locales as readonly string[]).includes(first)) return `/${rest.join("/")}`;
  return pathname;
}

const hrefFor = (locale: Locale, path: string) =>
  locale === routing.defaultLocale ? path : `/${locale}${path === "/" ? "" : path}`;

/**
 * EN / FR / HE segmented control. Plain links that keep the current path (crawlable, no JS needed).
 * Full page loads on purpose (see below); the current path comes from next/navigation.
 */
export function LocaleSwitcher({ label, locale: active }: { label: string; locale: Locale }) {
  const path = stripLocale(usePathname());

  return (
    <nav aria-label={label} className="flex overflow-hidden rounded-md border border-divider">
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        return (
          // A plain <a>: switching language is a full document change (lang, dir, fonts), and a
          // client-side navigation would also be caught by the /work/[slug] modal interception.
          <a
            key={locale}
            href={hrefFor(locale, path)}
            hrefLang={locale}
            lang={locale}
            aria-current={isActive ? "true" : undefined}
            aria-label={NAMES[locale]}
            // Remember the choice: next-intl's proxy reads this cookie on "/".
            onClick={() =>
              (document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`)
            }
            className={cn(
              "px-2 py-1.5 font-mono-ui text-[11px] leading-none font-medium no-underline transition-colors",
              isActive
                ? "bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)] text-accent-300 hover:text-accent-300"
                : "text-fg-subtle hover:text-fg",
            )}
          >
            {locale.toUpperCase()}
          </a>
        );
      })}
    </nav>
  );
}
