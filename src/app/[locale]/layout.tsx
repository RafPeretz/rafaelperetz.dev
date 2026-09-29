import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";

import { Interactions } from "@/components/interactions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import { getDirection, routing } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/server";
import { alternates, indexable, openGraph } from "@/lib/seo";
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
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    // Pages set their own canonical/hreflang; this is the fallback for the locale root.
    alternates: alternates(locale),
    openGraph: openGraph(locale, "/", { title: t("title"), description: t("description") }),
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    formatDetection: { telephone: false, address: false, email: false },
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
          {/* No NextIntlClientProvider: links are localized on the server (src/i18n/link.tsx) and client
              components get strings as props, so next-intl's client runtime never ships. */}
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
        </Providers>
        {/* /_vercel/* endpoints only exist on Vercel, so skip the scripts elsewhere (local, CI). */}
        {siteConfig.features.analytics && process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
