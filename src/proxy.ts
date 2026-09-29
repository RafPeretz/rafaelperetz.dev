import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

/** Locale negotiation + rewrites ("/" → "/en" internally, "/fr/*" → "fr"). */
export const proxy = createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, Vercel internals and any path with a file extension.
  matcher: "/((?!api|_next|_vercel|apple-icon|.*opengraph-image|.*\\..*).*)",
};
