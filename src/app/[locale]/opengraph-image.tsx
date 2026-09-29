import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

import { getDirection, routing } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/server";
import { OG_SIZE, OgFrame, ogColors, ogFonts, ogText } from "@/lib/og";
import { siteConfig } from "@/site.config";

export const alt = `${siteConfig.name} — ${siteConfig.jobTitle}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "hero" });
  const a = await getTranslations({ locale, namespace: "availability" });
  const title = (t.raw("title") as string).replace(/<\/?em>/g, "");
  const rtl = getDirection(locale) === "rtl";

  return new ImageResponse(
    <OgFrame
      rtl={rtl}
      kicker="DevOps · Cloud · CI/CD"
      title={title}
      footer={
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "Mono, Hebrew" }}>
          <div style={{ width: 10, height: 10, borderRadius: 10, background: ogColors.accent }} />
          {ogText(a(siteConfig.availability), rtl)}
        </div>
      }
    />,
    { ...size, fonts: await ogFonts() },
  );
}
