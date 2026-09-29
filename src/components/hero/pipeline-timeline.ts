/**
 * Timeline for the hero pipeline, mirroring the design's 8-step state machine:
 *   step 2k+1 → stage k running, step 2k+2 → stage k passed, log line l appears at step 2l+1,
 *   step 8 → "✓ deployed" + headline underline sweep.
 * Tightened from the design's 250ms + 8×290ms (+700ms underline = 3.27s) to finish under 3s.
 *
 * The animation itself is pure CSS (see "Hero pipeline" in globals.css); these numbers are passed
 * to the markup as CSS custom properties. The un-animated markup IS the final state, so
 * reduced-motion, no-JS and crawlers all get "✓ deployed".
 */

export const START_DELAY = 200;
export const STEP = 270;
export const FILL_DURATION = 300;
export const UNDERLINE_DURATION = 600;

/** Time (ms) at which the machine reaches `step`. */
export const at = (step: number) => START_DELAY + STEP * step;

export const DEPLOYED_AT = at(8);
export const TOTAL = DEPLOYED_AT + UNDERLINE_DURATION; // 2960ms

export const stageTimes = (k: number) => ({ run: at(2 * k + 1), pass: at(2 * k + 2) });
export const logAppearsAt = (l: number) => at(2 * l + 1);
/** The first log line scrolls out when the fourth appears (the window shows the last 3). */
export const FIRST_LOG_EXITS_AT = at(7);

export const ms = (n: number) => `${n}ms`;
