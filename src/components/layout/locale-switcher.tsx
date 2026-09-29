"use client";

import { useLocale } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const NAMES: Record<string, string> = { en: "English", fr: "Français", he: "עברית" };

/** EN / FR / HE segmented control. Real links (crawlable, work without JS) that keep the current path. */
export function LocaleSwitcher({ label }: { label: string }) {
  const pathname = usePathname();
  const active = useLocale();

  return (
    <nav aria-label={label} className="flex overflow-hidden rounded-md border border-divider">
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            prefetch={false}
            lang={locale}
            aria-current={isActive ? "true" : undefined}
            aria-label={NAMES[locale]}
            className={cn(
              "px-2 py-1.5 font-mono-ui text-[11px] leading-none font-medium no-underline transition-colors",
              isActive
                ? "bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)] text-accent-300 hover:text-accent-300"
                : "text-fg-subtle hover:text-fg",
            )}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
