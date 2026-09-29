import { ImageResponse } from "next/og";

import { getDirection, routing } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/server";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/content";
import { OG_SIZE, OgFrame, ogFonts } from "@/lib/og";
import { siteConfig } from "@/site.config";

export const alt = `Case study — ${siteConfig.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getCaseStudySlugs().map((slug) => ({ locale, slug })));
}

export default async function OgImage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const study = getCaseStudy(locale, slug);

  return new ImageResponse(
    <OgFrame
      rtl={getDirection(locale) === "rtl"}
      kicker={study?.role ?? "Case study"}
      title={study?.title ?? siteConfig.name}
      subtitle={study?.outcome}
      footer={<div style={{ display: "flex" }}>{study?.stack.join(" · ")}</div>}
    />,
    { ...size, fonts: await ogFonts() },
  );
}
