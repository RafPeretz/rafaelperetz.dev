import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";
const isPreview = process.env.VERCEL_ENV === "preview";

/**
 * Content-Security-Policy.
 * Pages are statically generated, so per-request nonces aren't possible without giving up SSG
 * (see the Next.js CSP guide). Scripts are therefore limited to 'self' + 'unsafe-inline' + the
 * exact third parties the site uses; everything else is locked down.
 *
 * - Cal.com: embed script, booking iframe, API calls (app.cal.com / cal.com)
 * - Vercel Web Analytics & Speed Insights: served same-origin under /_vercel/*
 * - Vercel preview toolbar (vercel.live): preview deployments only
 * - Resend / Upstash: server-side only → nothing needed here
 */
const CAL = ["https://app.cal.com", "https://cal.com"];
const VERCEL_LIVE = isPreview ? ["https://vercel.live", "https://*.pusher.com", "wss://*.pusher.com"] : [];

const csp = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : []), ...CAL, ...VERCEL_LIVE],
  "style-src": ["'self'", "'unsafe-inline'", ...VERCEL_LIVE],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    ...CAL,
    ...(isPreview ? ["https://vercel.live", "https://vercel.com"] : []),
  ],
  "font-src": ["'self'", "data:", ...(isPreview ? ["https://vercel.live", "https://assets.vercel.com"] : [])],
  "connect-src": ["'self'", ...CAL, ...VERCEL_LIVE, ...(isDev ? ["ws:", "wss:"] : [])],
  "frame-src": [...CAL, ...VERCEL_LIVE],
  "worker-src": ["'self'", "blob:"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "manifest-src": ["'self'"],
  ...(isDev ? {} : { "upgrade-insecure-requests": [] }),
};

const contentSecurityPolicy = Object.entries(csp)
  .map(([directive, sources]) => [directive, ...sources].join(" "))
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
