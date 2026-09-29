import { ImageResponse } from "next/og";

import { siteConfig } from "@/site.config";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon (Safari doesn't use SVG favicons). */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#161826",
        color: "#9184d9",
        fontSize: 72,
        fontWeight: 600,
        letterSpacing: -2,
      }}
    >
      {siteConfig.initials}
    </div>,
    size,
  );
}
