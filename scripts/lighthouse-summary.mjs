#!/usr/bin/env node
/** Markdown table of Lighthouse scores (median run per URL) for the GitHub job summary. */
import { existsSync, readFileSync } from "node:fs";

const manifestPath = ".lighthouseci/manifest.json";
if (!existsSync(manifestPath)) {
  console.log("_No Lighthouse results were produced._");
  process.exit(0);
}

const runs = JSON.parse(readFileSync(manifestPath, "utf8")).filter((r) => r.isRepresentativeRun);
const pct = (v) => (typeof v === "number" ? Math.round(v * 100) : "–");
const badge = (v) =>
  typeof v !== "number" ? "–" : v >= 0.95 ? `🟢 ${pct(v)}` : v >= 0.9 ? `🟠 ${pct(v)}` : `🔴 ${pct(v)}`;

console.log("### Lighthouse (mobile, median of 3)\n");
console.log("| URL | Performance | Accessibility | Best practices | SEO |");
console.log("| --- | --- | --- | --- | --- |");
for (const r of runs) {
  const s = r.summary;
  console.log(
    `| ${new URL(r.url).pathname} | ${badge(s.performance)} | ${badge(s.accessibility)} | ${badge(s["best-practices"])} | ${badge(s.seo)} |`,
  );
}
