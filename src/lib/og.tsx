import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { type ReactNode } from "react";

import { siteConfig } from "@/site.config";

import { drawLines, toVisual } from "./bidi";

/** Visual-order text for satori (see lib/bidi.ts). */
export const ogText = (text: string, rtl: boolean) => (rtl ? toVisual(text) : text);

/** One flex row per line: RTL text is pre-wrapped; LTR text is left to satori's wrapping. */
function Lines({ text, maxChars, rtl }: { text: string; maxChars: number; rtl: boolean }) {
  // A real column container: satori doesn't stack fragment children reliably.
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: rtl ? "flex-end" : "flex-start" }}>
      {drawLines(text, maxChars, rtl).map((line, i) => (
        <div key={i} style={{ display: "flex" }}>
          {line}
        </div>
      ))}
    </div>
  );
}

/** Shared look for Open Graph images (next/og / satori). Colours mirror the dark theme tokens. */
export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  bg: "#161826",
  surface: "#232532",
  fg: "#e9e9ed",
  soft: "rgba(233,233,237,0.78)",
  faint: "rgba(233,233,237,0.55)",
  divider: "rgba(233,233,237,0.16)",
  accent: "#9184d9",
  accent300: "#d2cefd",
  glow: "#2b2741",
};

/** satori needs TTF/OTF/WOFF (not WOFF2): subset WOFFs are committed in assets/og-fonts. */
export async function ogFonts() {
  const dir = join(process.cwd(), "assets/og-fonts");
  const load = (f: string) => readFile(join(dir, f));
  const [inter400, inter500, mono, hebrew] = await Promise.all([
    load("Inter-400.woff"),
    load("Inter-500.woff"),
    load("JetBrainsMono-400.woff"),
    load("NotoSansHebrew-500.woff"),
  ]);
  return [
    { name: "Inter", data: inter400, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: inter500, weight: 500 as const, style: "normal" as const },
    { name: "Mono", data: mono, weight: 400 as const, style: "normal" as const },
    { name: "Hebrew", data: hebrew, weight: 500 as const, style: "normal" as const },
  ];
}

const STAGES = ["build", "test", "scan", "deploy"];

export function OgFrame({
  kicker,
  title,
  subtitle,
  footer,
  rtl = false,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  footer: ReactNode;
  rtl?: boolean;
}) {
  const align = rtl ? "flex-end" : "flex-start";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: `radial-gradient(900px 560px at ${rtl ? "18%" : "82%"} -120px, ${C.glow}, ${C.bg} 70%)`,
        color: C.fg,
        fontFamily: "Inter, Hebrew",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, flexDirection: rtl ? "row-reverse" : "row" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: 12,
            border: `2px solid ${C.accent}`,
            color: C.accent,
            fontFamily: "Mono",
            fontSize: 21,
          }}
        >
          {siteConfig.initials}
        </div>
        <div style={{ fontSize: 26, fontWeight: 500 }}>{siteConfig.name}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: align, gap: 22 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: C.accent,
            fontFamily: "Mono, Hebrew",
            fontSize: 20,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 36, height: 2, background: C.accent }} />
          {ogText(kicker, rtl)}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: align,
            fontSize: title.length > 60 ? 58 : 68,
            fontWeight: 500,
            lineHeight: 1.06,
            letterSpacing: rtl ? -0.5 : -2,
            maxWidth: 980,
            textAlign: rtl ? "right" : "left",
          }}
        >
          <Lines text={title} maxChars={title.length > 60 ? 30 : 26} rtl={rtl} />
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: align,
              fontSize: 26,
              color: C.soft,
              maxWidth: 900,
              lineHeight: 1.4,
              textAlign: rtl ? "right" : "left",
            }}
          >
            <Lines text={subtitle} maxChars={62} rtl={rtl} />
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "Mono",
          fontSize: 19,
          color: C.faint,
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          {STAGES.map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 8,
                border: `1px solid rgba(145,132,217,0.55)`,
                background: C.surface,
                color: C.fg,
              }}
            >
              {/* Drawn, not a glyph: the subset fonts have no ✓ and satori would fetch one at build time. */}
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginTop: 3 }}>
                <path
                  d="M4 12.5l5 5L20 6.5"
                  fill="none"
                  stroke={C.accent300}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {s}
            </div>
          ))}
        </div>
        {footer}
      </div>
    </div>
  );
}

export const ogColors = C;
