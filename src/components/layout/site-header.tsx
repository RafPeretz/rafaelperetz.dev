import { getLocale, getTranslations } from "next-intl/server";

import { BrandMark } from "@/components/ui/brand-mark";
import { BookCallButton } from "@/components/book-call-button";
import { Link } from "@/i18n/link";
import { siteConfig } from "@/site.config";

import { AvailabilityBadge } from "./availability-badge";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

const SECTIONS = ["services", "work", "about", "stack", "contact"] as const;

export async function SiteHeader() {
  const t = await getTranslations();
  const locale = await getLocale();

  const links = SECTIONS.map((id) => ({ id, href: `/#${id}`, label: t(`nav.${id}`) }));

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-[color-mix(in_srgb,var(--color-bg)_74%,transparent)] backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <nav aria-label={t("nav.label")} className="container-page flex items-center gap-2.5 py-3 nav:gap-4.5">
        <Link href="/" className="me-auto flex items-center gap-2.5 text-fg no-underline hover:text-fg">
          <BrandMark />
          <span className="text-sm font-medium whitespace-nowrap">{siteConfig.name}</span>
        </Link>

        <ul role="list" className="hidden items-center gap-5 nav:flex">
          {links.map((l) => (
            <li key={l.id}>
              <Link
                href={l.href}
                prefetch={false}
                className="text-sm whitespace-nowrap text-fg-muted no-underline transition-colors hover:text-fg"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-status hidden nav:block">
          <AvailabilityBadge />
        </div>

        <LocaleSwitcher label={t("nav.language")} locale={locale} />
        <ThemeToggle toLight={t("theme.toLight")} toDark={t("theme.toDark")} />

        <BookCallButton data-magnetic variant="primary" className="hidden nav:inline-flex">
          {t("nav.book")}
        </BookCallButton>

        <MobileMenu label={t("nav.menu")} closeLabel={t("nav.closeMenu")}>
          <div className="container-page flex flex-col gap-1 pt-2 pb-5">
            <ul role="list" className="flex flex-col">
              {links.map((l) => (
                <li key={l.id}>
                  <Link
                    href={l.href}
                    prefetch={false}
                    className="block border-b border-hairline py-2.5 text-xl text-fg no-underline hover:text-fg"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3.5">
              <AvailabilityBadge variant="inline" />
            </div>
            <BookCallButton variant="primary" className="mt-3.5 min-h-11">
              {t("nav.book")}
            </BookCallButton>
          </div>
        </MobileMenu>
      </nav>
    </header>
  );
}
