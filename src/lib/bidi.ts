/**
 * Minimal RTL support for OG images. satori (next/og) lays text out in logical order with no
 * bidi algorithm, so Hebrew renders reversed. We break lines ourselves and convert each line to
 * visual order: runs are reversed, Hebrew/neutral runs are reversed character by character, and
 * LTR runs (Latin words, numbers, "CI/CD", "GitHub Actions") keep their internal order.
 * Scope: short headlines and captions — not a general Unicode bidi implementation.
 */

// A left-to-right run: starts and ends with a Latin letter/digit, may contain spaces and
// joiners (/ . - : + # @ _ ') between them.
const LTR_RUN = /[A-Za-z0-9][A-Za-z0-9/.\-:+#@_' ]*[A-Za-z0-9+#]|[A-Za-z0-9]/g;
const HEBREW = /[\u0590-\u05FF]/;
const MIRROR: Record<string, string> = { "(": ")", ")": "(", "[": "]", "]": "[", "«": "»", "»": "«" };

/** Convert one logical RTL line to visual (left-to-right drawing) order. */
export function toVisual(line: string): string {
  const runs: { text: string; ltr: boolean }[] = [];
  let last = 0;
  for (const m of line.matchAll(LTR_RUN)) {
    if (m.index > last) runs.push({ text: line.slice(last, m.index), ltr: false });
    runs.push({ text: m[0], ltr: true });
    last = m.index + m[0].length;
  }
  if (last < line.length) runs.push({ text: line.slice(last), ltr: false });

  // Neutrals (spaces, "·", "—", …) between two LTR runs join them, as in the Unicode bidi algorithm:
  // "DevOps · Cloud · CI/CD" stays one left-to-right run.
  for (let i = runs.length - 2; i > 0; i--) {
    const [prev, mid, next] = [runs[i - 1], runs[i], runs[i + 1]];
    if (!prev || !mid || !next) continue; // the array shrinks as runs merge
    if (prev.ltr && next.ltr && !mid.ltr && !HEBREW.test(mid.text)) {
      runs.splice(i - 1, 3, { text: prev.text + mid.text + next.text, ltr: true });
    }
  }

  return runs
    .reverse()
    .map((r) =>
      r.ltr
        ? r.text
        : [...r.text]
            .reverse()
            .map((c) => MIRROR[c] ?? c)
            .join(""),
    )
    .join("");
}

/** Greedy word wrap by character budget (approximates glyph width), in logical order. */
export function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (current && current.length + 1 + word.length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Lines ready to draw: wrapped, then converted to visual order when RTL. */
export function drawLines(text: string, maxChars: number, rtl: boolean): string[] {
  return rtl ? wrap(text, maxChars).map(toVisual) : [text];
}
