import { ArrowClockwiseIcon, GitBranchIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";

import { LOGS, STAGES } from "./pipeline-data";

/**
 * The CI/CD run in the hero, rendered in its final "✓ deployed" state.
 * This static markup is also what reduced-motion users, crawlers and no-JS visitors get.
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
        <span className="ms-auto text-accent-300">{t("success")}</span>
        <button
          type="button"
          className="btn btn-ghost px-1.5 py-1.25 font-mono-ui text-[11px] leading-none"
          aria-label={t("rerunLabel")}
        >
          <ArrowClockwiseIcon aria-hidden="true" className="size-3.25" />
          {t("rerun")}
        </button>
      </div>

      <div aria-hidden="true" className="px-4.5 pt-5.5 pb-2">
        <div className="relative">
          <div className="absolute inset-x-[12.5%] top-1/2 h-px bg-divider" />
          <div className="absolute start-[12.5%] top-1/2 h-px w-3/4 bg-accent shadow-glow-sm" />
          <ol dir="ltr" className="relative grid grid-cols-4 gap-1.5 xs:gap-3">
            {STAGES.map(({ name, icon: IconCmp, time }) => (
              <li
                key={name}
                className="flex flex-col gap-2 rounded-md border border-[color-mix(in_srgb,var(--color-accent)_55%,transparent)] bg-surface px-1.5 py-2 xs:px-2.5 xs:py-2.75"
              >
                <div className="flex items-center justify-between">
                  <IconCmp className="size-4.5 text-accent" />
                  <span className="font-mono-ui text-[10px] leading-none text-fg-faint">{time}</span>
                </div>
                <div className="font-mono-ui text-xs leading-none font-medium xs:text-[13px]">{name}</div>
                <div className="font-mono-ui text-[10.5px] leading-none text-accent-300">
                  ✓<span className="hidden xs:inline"> {t("stage.passed")}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div
        dir="ltr"
        className="flex min-h-[118px] flex-col gap-1.75 px-4.5 pt-3.5 pb-4.5 text-left font-mono-ui text-[12.5px] leading-[1.45]"
      >
        {LOGS.slice(-3).map((l) => (
          <p key={l.stage} className="flex gap-3 text-fg-soft">
            <span className="w-13 flex-none text-fg-faint">{l.stage}</span>
            <span className="min-w-0 [overflow-wrap:anywhere]">{l.text}</span>
          </p>
        ))}
        <p className="mt-1.5 flex items-center gap-2 font-medium text-accent-text">{t("deployed")}</p>
      </div>
    </figure>
  );
}
