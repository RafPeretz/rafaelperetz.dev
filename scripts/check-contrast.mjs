#!/usr/bin/env node
/**
 * WCAG contrast guard for the design tokens.
 * Parses src/styles/tokens.css (dark = @theme block, light = [data-theme="light"] overrides),
 * resolves `color-mix(in srgb, var(--color-x) N%, transparent)` as alpha over the background,
 * and fails if any text/background pair used by the design drops below AA.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");

function block(start) {
  const i = css.indexOf(start);
  if (i < 0) throw new Error(`Block not found: ${start}`);
  let depth = 0;
  for (let j = css.indexOf("{", i); j < css.length; j++) {
    if (css[j] === "{") depth++;
    if (css[j] === "}" && --depth === 0) return css.slice(i, j);
  }
  throw new Error(`Unclosed block: ${start}`);
}

function vars(src) {
  const out = {};
  for (const m of src.matchAll(/--color-([\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

const dark = vars(block("@theme {"));
const light = { ...dark, ...vars(block('[data-theme="light"] {')) };

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Resolve a token to an opaque sRGB triple, compositing translucent mixes over `under`. */
function resolve(theme, name, under) {
  const value = theme[name];
  if (!value) throw new Error(`Unknown token --color-${name}`);
  if (value.startsWith("#")) return hex(value);
  const mix = value.match(/color-mix\(in srgb,\s*var\(--color-([\w-]+)\)\s*([\d.]+)%,\s*transparent\)/);
  if (!mix) throw new Error(`Cannot resolve --color-${name}: ${value}`);
  const fg = resolve(theme, mix[1], under);
  const a = Number(mix[2]) / 100;
  return fg.map((c, i) => Math.round(c * a + under[i] * (1 - a)));
}

// [text token, background token, minimum ratio, where it's used]
const PAIRS = [
  ["fg", "bg", 4.5, "body text"],
  ["fg-soft", "bg", 4.5, "hero lede, about copy"],
  ["fg-muted", "bg", 4.5, "section ledes, nav links"],
  ["fg-subtle", "bg", 4.5, "mono meta, footer"],
  ["fg-faint", "bg", 4.5, "stage timings, labels"],
  ["fg-faint", "surface", 4.5, "pipeline stage cards"],
  ["fg-muted", "section", 4.5, "stat band labels"],
  ["accent-text", "bg", 4.5, "kickers, text links"],
  ["accent-text", "surface", 4.5, "links on cards"],
  ["accent-300", "bg", 4.5, "pipeline status text"],
  ["neutral-400", "bg", 4.5, "experience wordmarks"],
  ["accent", "bg", 3, "icons, rules, focus ring (non-text)"],
];

let failed = 0;
for (const [themeName, theme] of [
  ["dark", dark],
  ["light", light],
]) {
  console.log(`\n${themeName}`);
  for (const [text, bg, min, use] of PAIRS) {
    const bgRgb = resolve(theme, bg, [0, 0, 0]);
    const r = ratio(resolve(theme, text, bgRgb), bgRgb);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`  ${ok ? "✓" : "✗"} ${text} on ${bg}: ${r.toFixed(2)} (min ${min}) — ${use}`);
  }
}

if (failed) {
  console.error(`\n${failed} contrast pair(s) below WCAG AA.`);
  process.exit(1);
}
console.log("\nAll token pairs meet WCAG AA.");
