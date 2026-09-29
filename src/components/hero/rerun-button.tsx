"use client";

import { ArrowClockwiseIcon } from "@phosphor-icons/react/ssr";
import { useRef } from "react";

/**
 * Restarts the hero's CSS timeline. Finished CSS animations aren't reachable through
 * getAnimations(), so we remove every animation (.pl-reset), force a reflow, and put them back.
 */
export function RerunButton({ label, children }: { label: string; children: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  const rerun = () => {
    const root = ref.current?.closest<HTMLElement>("[data-pipeline-root]");
    if (!root) return;
    root.classList.add("pl-reset");
    void root.offsetWidth; // flush styles so the animations restart from zero
    root.classList.remove("pl-reset");
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={rerun}
      aria-label={label}
      className="btn btn-ghost px-1.5 py-1.25 font-mono-ui text-[11px] leading-none"
    >
      <ArrowClockwiseIcon aria-hidden="true" className="size-3.25" />
      {children}
    </button>
  );
}
