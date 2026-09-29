#!/usr/bin/env node
/**
 * End-to-end smoke test against a running build (local `pnpm start`, or a deployment URL).
 * Uses playwright-core with the machine's Chrome (CI: ubuntu runners ship Google Chrome).
 *
 *   node scripts/smoke.mjs [baseUrl=http://localhost:3000]
 */
import { chromium } from "playwright-core";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const failures = [];
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures.push(name);
};

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "en-US" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && !/status of 404/.test(m.text()) && errors.push(m.text()));
const docState = () =>
  page.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir }));

try {
  // Locales render with the right lang/dir.
  for (const [path, lang, dir] of [
    ["/", "en", "ltr"],
    ["/fr", "fr", "ltr"],
    ["/he", "he", "rtl"],
  ]) {
    const res = await page.goto(base + path, { waitUntil: "networkidle" });
    const s = await docState();
    check(
      `GET ${path}`,
      res?.status() === 200 && s.lang === lang && s.dir === dir,
      `${res?.status()} ${s.lang}/${s.dir}`,
    );
  }

  // Security headers.
  const head = await context.request.get(`${base}/`, { headers: { "Accept-Language": "en-US" } });
  const h = head.headers();
  for (const key of [
    "content-security-policy",
    "strict-transport-security",
    "x-frame-options",
    "referrer-policy",
    "permissions-policy",
  ])
    check(`header ${key}`, Boolean(h[key]));

  // Unknown routes are 404.
  check("404 for unknown path", (await context.request.get(`${base}/nope`)).status() === 404);
  check("404 for unknown case study", (await context.request.get(`${base}/work/nope`)).status() === 404);

  // Case study modal: opens on the homepage, URL changes, Escape restores.
  // (Visiting /he above set the NEXT_LOCALE cookie, which would redirect "/" to "/he".)
  await context.clearCookies();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.locator("#work a[href^='/work/']").first().click();
  await page.waitForSelector("dialog[open]");
  const modalPath = new URL(page.url()).pathname;
  check("modal opens with /work/<slug> URL", modalPath.startsWith("/work/"), modalPath);
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog[open]", { state: "detached" });
  check("Escape closes modal and restores URL", new URL(page.url()).pathname === "/");

  // Direct case study page (no modal).
  await page.goto(base + modalPath, { waitUntil: "networkidle" });
  check(
    "case study page renders standalone",
    (await page.locator("dialog").count()) === 0 && (await page.locator("h1").count()) === 1,
  );

  // Locale switch is a full document change (lang/dir update, no modal interception).
  await page.getByRole("link", { name: "עברית" }).click();
  await page.waitForURL(`**/he${modalPath}`);
  await page.waitForLoadState("networkidle");
  const he = await docState();
  check(
    "switch to Hebrew on a case page",
    he.dir === "rtl" && (await page.locator("dialog[open]").count()) === 0,
    `${he.lang}/${he.dir}`,
  );

  // Contact form: client-side validation.
  await page.goto(`${base}/#contact`, { waitUntil: "networkidle" });
  await page.locator("#contact button[type=submit]").click();
  await page.waitForSelector("#err-name");
  const focused = await page.evaluate(() => document.activeElement?.id);
  check("form validation shows errors and focuses first field", focused === "f-name", `focused=${focused}`);

  check("no page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
} catch (error) {
  failures.push(String(error));
  console.error(error);
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n${failures.length} smoke check(s) failed.`);
  process.exit(1);
}
console.log("\nAll smoke checks passed.");
