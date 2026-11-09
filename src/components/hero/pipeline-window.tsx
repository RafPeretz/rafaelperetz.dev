import { GitBranchIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { LOGS, STAGE_TONE, STAGES } from "./pipeline-data";
import {
  at,
  DEPLOYED_AT,
  FILL_DURATION,
  FIRST_LOG_EXITS_AT,
  logAppearsAt,
  ms,
  stageTimes,
} from "./pipeline-timeline";
import { RerunButton } from "./rerun-button";

type Vars = Record<`--pl-${string}`, string>;
const vars = (v: Vars) => v as CSSProperties;

/** Shown only during [from, until). */
const windowed = (from: number, until: number) =>
  vars({ "--pl-from": ms(from), "--pl-for": ms(until - from) });
/** Hidden until `when`. */
const late = (when: number) => vars({ "--pl-for": ms(when) });

/** Stacks state variants in one grid cell so swapping them never shifts layout. */
function Variants({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn("grid *:[grid-area:1/1]", className)}>{children}</span>;
}

/**
 * The CI/CD run in the hero. Server-rendered; animated purely by CSS (see globals.css,
 * "Hero pipeline timeline"). The markup's resting state is "✓ deployed".
 */
export async function PipelineWindow() {
  const t = await getTranslations("pipeline");

  return (
    <figure className="m-0 overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--color-fg)_14%,transparent)] bg-surface/72 shadow-window backdrop-blur-[10px]">
      <figcaption className="sr-only">{t("caption")}</figcaption>

      <div
        dir="ltr"
        className="flex items-center gap-2.5 border-b border-divider px-3.5 py-2.5 font-mono-ui text-[11.5px] leading-none text-fg-subtle"
      >
        <GitBranchIcon aria-hidden="true" className="size-3.5" />
        <span>{t("branch")}</span>
        <span aria-hidden="true" className="opacity-50">
          /
        </span>
        <span>{t("run")}</span>
        <Variants className="ms-auto justify-items-end">
          <span aria-hidden="true" className="pl-window text-fg-faint" style={windowed(0, at(1))}>
            {t("queued")}
          </span>
          <span aria-hidden="true" className="pl-window text-fg-faint" style={windowed(at(1), DEPLOYED_AT)}>
            {t("running")}
          </span>
          <span className="pl-late text-teal" style={late(DEPLOYED_AT)}>
            {t("success")}
          </span>
        </Variants>
        <RerunButton label={t("rerunLabel")}>{t("rerun")}</RerunButton>
      </div>

      <div aria-hidden="true" className="px-4.5 pt-5.5 pb-2">
        <div className="relative">
          <div className="absolute inset-x-[12.5%] top-1/2 h-px bg-divider" />
          {/* Three fill segments light up as build, test and scan pass. */}
          {[0, 1, 2].map((k) => (
            <div
              key={k}
              className={cn(
                "pl-grow absolute top-1/2 h-px w-1/4 origin-left bg-linear-to-r",
                ["from-sky to-amber", "from-amber to-rose", "from-rose to-teal"][k],
              )}
              style={{
                left: `${12.5 + 25 * k}%`,
                ...vars({ "--pl-from": ms(stageTimes(k).pass), "--pl-for": ms(FILL_DURATION) }),
              }}
            />
          ))}
          <ol dir="ltr" className="relative grid grid-cols-4 gap-1.5 xs:gap-3">
            {STAGES.map(({ name, icon: IconCmp, time, tone }, k) => {
              const { run, pass } = stageTimes(k);
              return (
                <li
                  key={name}
                  className={cn(
                    tone,
                    "pl-stage flex flex-col gap-2 rounded-md border border-tone/55 bg-surface px-1.5 py-2 xs:px-2.5 xs:py-2.75",
                  )}
                  style={vars({ "--pl-run": ms(run), "--pl-running": ms(pass - run) })}
                >
                  <div className="flex items-center justify-between">
                    <IconCmp weight="duotone" className="pl-stage-icon size-4.5 text-tone" />
                    <Variants className="justify-items-end font-mono-ui text-[10px] leading-none text-fg-faint">
                      <span className="pl-window" style={windowed(0, run)}>
                        —
                      </span>
                      <span className="pl-window" style={windowed(run, pass)}>
                        …
                      </span>
                      <span className="pl-late" style={late(pass)}>
                        {time}
                      </span>
                    </Variants>
                  </div>
                  <div className="font-mono-ui text-xs leading-none font-medium xs:text-[13px]">{name}</div>
                  <Variants className="font-mono-ui text-[10.5px] leading-none">
                    <span className="pl-window text-fg-faint" style={windowed(0, run)}>
                      ○<span className="hidden xs:inline"> {t("stage.queued")}</span>
                    </span>
                    <span className="pl-window text-tone" style={windowed(run, pass)}>
                      ●<span className="hidden xs:inline"> {t("stage.running")}</span>
                    </span>
                    <span className="pl-late text-teal" style={late(pass)}>
                      ✓<span className="hidden xs:inline"> {t("stage.passed")}</span>
                    </span>
                  </Variants>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div
        aria-hidden="true"
        dir="ltr"
        className="flex min-h-[152px] flex-col px-4.5 pt-[7px] pb-4.5 text-left font-mono-ui text-[12.5px] leading-[1.45] xs:min-h-[134px]"
      >
        {LOGS.map((l, i) => (
          <div
            key={l.stage}
            className={cn("pl-row", i === 0 ? "pl-row-temp" : "pl-row-late")}
            style={i === 0 ? windowed(logAppearsAt(0), FIRST_LOG_EXITS_AT) : late(logAppearsAt(i))}
          >
            <p className="flex gap-3 text-fg-soft">
              <span className={cn(STAGE_TONE[l.stage], "w-13 flex-none text-tone")}>{l.stage}</span>
              <span className="min-w-0 [overflow-wrap:anywhere]">{l.text}</span>
            </p>
          </div>
        ))}
        <Variants className="mt-[13px] font-medium text-teal">
          <span className="pl-late" style={late(DEPLOYED_AT)}>
            {t("deployed")}
          </span>
          <span className="pl-window flex items-center" style={windowed(0, DEPLOYED_AT)}>
            <span className="inline-block h-3.75 w-2 animate-blink bg-accent" />
          </span>
        </Variants>
      </div>
    </figure>
  );
}
