#!/usr/bin/env node
/**
 * i18n guard: every locale in messages/ must have exactly the same keys as en.json
 * (and the same ICU placeholders / rich-text tags), so nothing silently falls back or breaks.
 */
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../messages/", import.meta.url);
const load = (f) => JSON.parse(readFileSync(new URL(f, dir), "utf8"));

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flatten(v, key, out);
    else out[key] = String(v);
  }
  return out;
}
const tokens = (s) =>
  [...s.matchAll(/\{(\w+)\}|<\/?(\w+)>/g)]
    .map((m) => m[0])
    .sort()
    .join(" ");

const ref = flatten(load("en.json"));
let problems = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "en.json")) {
  const msgs = flatten(load(file));
  const missing = Object.keys(ref).filter((k) => !(k in msgs));
  const extra = Object.keys(msgs).filter((k) => !(k in ref));
  const mismatched = Object.keys(ref).filter((k) => k in msgs && tokens(ref[k]) !== tokens(msgs[k]));
  for (const k of missing) console.error(`✗ ${file}: missing ${k}`);
  for (const k of extra) console.error(`✗ ${file}: unknown key ${k}`);
  for (const k of mismatched) console.error(`✗ ${file}: placeholders differ in ${k}`);
  problems += missing.length + extra.length + mismatched.length;
  if (!missing.length && !extra.length && !mismatched.length)
    console.log(`✓ ${file}: ${Object.keys(msgs).length} keys match en.json`);
}
if (problems) process.exit(1);
