import { getTranslations } from "next-intl/server";

import { BrandMark } from "@/components/ui/brand-mark";
import { ButtonAnchor } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { calUrl, siteConfig } from "@/site.config";

import { AvailabilityBadge } from "./availability-badge";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

const SECTIONS = ["services", "work", "about", "stack", "contact"] as const;

export async function SiteHeader() {
  const t = await getTranslations();

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
                className="text-sm text-fg-muted no-underline transition-colors hover:text-fg"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden nav:block">
          <AvailabilityBadge />
        </div>

        <LocaleSwitcher label={t("nav.language")} />
        <ThemeToggle toLight={t("theme.toLight")} toDark={t("theme.toDark")} />

        <ButtonAnchor
          data-magnetic
          variant="primary"
          href={calUrl}
          target="_blank"
          rel="noopener"
          className="hidden nav:inline-flex"
        >
          {t("nav.book")}
        </ButtonAnchor>

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
            <ButtonAnchor
              variant="primary"
              href={calUrl}
              target="_blank"
              rel="noopener"
              className="mt-3.5 min-h-11"
            >
              {t("nav.book")}
            </ButtonAnchor>
          </div>
        </MobileMenu>
      </nav>
    </header>
  );
}
