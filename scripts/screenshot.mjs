#!/usr/bin/env node
/**
 * Visual check: full-page screenshots at the four target widths, dark + light.
 * Uses the locally installed Google Chrome via playwright-core (no browser download).
 *
 *   node scripts/screenshot.mjs [baseUrl] [path...]
 *   env: OUT=dir  THEMES=dark,light  WIDTHS=375,768,1280,1920  REDUCED=1
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3000";
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ["/"];
const out = process.env.OUT ?? ".screenshots";
const widths = (process.env.WIDTHS ?? "375,768,1280,1920").split(",").map(Number);
const themes = (process.env.THEMES ?? "dark,light").split(",");

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });

for (const theme of themes) {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      locale: "en-US", // pin Accept-Language: "/" redirects to the browser's preferred locale
      deviceScaleFactor: 1,
      reducedMotion: process.env.REDUCED ? "reduce" : "no-preference",
    });
    await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    for (const p of paths) {
      await page.goto(base + p, { waitUntil: "networkidle" });
      await page.waitForTimeout(Number(process.env.WAIT ?? 3200)); // let the hero pipeline finish
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const file = `${out}/${p.replace(/\W+/g, "_") || "_"}-${width}-${theme}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log(`${file}${overflow > 0 ? `  ⚠ horizontal overflow ${overflow}px` : ""}`);
    }
    for (const e of errors) console.log(`  console error: ${e}`);
    await context.close();
  }
}
await browser.close();
