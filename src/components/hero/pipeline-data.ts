import { FlaskIcon, PackageIcon, RocketLaunchIcon, ShieldCheckIcon } from "@phosphor-icons/react/ssr";

/** The hero's pipeline run. Terminal text is intentionally not translated (it's "code"). */
export const STAGES = [
  { name: "build", icon: PackageIcon, time: "0.6s", tone: "tone-sky" },
  { name: "test", icon: FlaskIcon, time: "0.5s", tone: "tone-amber" },
  { name: "scan", icon: ShieldCheckIcon, time: "0.6s", tone: "tone-rose" },
  { name: "deploy", icon: RocketLaunchIcon, time: "0.7s", tone: "tone-teal" },
] as const;

/** Tone class per stage name (log lines reuse their stage's colour). */
export const STAGE_TONE = Object.fromEntries(STAGES.map((s) => [s.name, s.tone])) as Record<
  (typeof STAGES)[number]["name"],
  string
>;

export const LOGS = [
  { stage: "build", text: "docker build rafa/app:9f3c2e1" },
  { stage: "test", text: "142 passed · 0 failed" },
  { stage: "scan", text: "trivy + gitleaks · 0 critical" },
  { stage: "deploy", text: "kubectl rollout · 3/3 pods ready" },
] as const;
