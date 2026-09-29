import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** "01 — Services" kicker with the accent rule. */
export function Kicker({ index, children }: { index: number; children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono-ui text-xs leading-none font-medium tracking-[0.08em] text-accent-text uppercase">
      <span aria-hidden="true" className="h-px w-7 bg-accent" />
      <span>
        {String(index).padStart(2, "0")} — {children}
      </span>
    </p>
  );
}

export function SectionHeading({
  id,
  index,
  kicker,
  title,
  lede,
  className,
  titleClassName,
}: {
  id: string;
  index: number;
  kicker: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={className}>
      <Kicker index={index}>{kicker}</Kicker>
      <h2 id={id} className={cn("mt-4.5 max-w-[20ch] text-h2", titleClassName)}>
        {title}
      </h2>
      {lede ? <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-fg-muted">{lede}</p> : null}
    </div>
  );
}
