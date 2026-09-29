import "server-only";

import NextLink from "next/link";
import { getLocale } from "next-intl/server";
import { type ComponentProps } from "react";

import { routing, type Locale } from "./routing";

/** "/work/x" → "/fr/work/x" (default locale unprefixed); keeps "#hash" and "?query". */
export function localizeHref(locale: Locale, href: string): string {
  if (locale === routing.defaultLocale || !href.startsWith("/")) return href;
  const [, path = "", rest = ""] = href.match(/^([^?#]*)(.*)$/) ?? [];
  return `/${locale}${path === "/" ? "" : path}${rest}`;
}

/**
 * Locale-aware link for Server Components. Resolves the prefix on the server and renders a plain
 * next/link, so the browser doesn't need next-intl's client runtime (its <Link> reads the locale
 * from client context).
 */
export async function Link({
  href,
  ...props
}: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const locale = (await getLocale()) as Locale;
  return <NextLink href={localizeHref(locale, href)} {...props} />;
}
