import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

import { Interactions } from "@/components/interactions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import { getDirection, routing } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/server";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import { inter, jetbrainsMono, notoHebrew } from "../fonts";
import "../globals.css";

// Every locale is pre-rendered at build time; anything else is a 404.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("title"), template: `%s — ${siteConfig.name}` },
    description: t("description"),
  };
}

export const viewport: Viewport = {
  themeColor: "#161826",
  colorScheme: "dark light",
};

export default async function LocaleLayout({ children, modal, params }: LayoutProps<"/[locale]">) {
  const locale = await resolveLocale(params);

  const t = await getTranslations("common");

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={cn(inter.variable, jetbrainsMono.variable, locale === "he" && notoHebrew.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <Providers>
          {/* Client components receive strings as props; only the locale is needed client-side. */}
          <NextIntlClientProvider messages={null}>
            <a
              href="#main"
              className="btn btn-primary sr-only z-60 bg-bg focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:px-3 focus:py-2"
            >
              {t("skipToContent")}
            </a>
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
            <Interactions />
            {modal}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
