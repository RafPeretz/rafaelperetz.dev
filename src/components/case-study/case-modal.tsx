"use client";

import { XIcon } from "@phosphor-icons/react/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

/**
 * Case study modal for the intercepted /work/[slug] route. Built on the native <dialog>:
 * showModal() gives focus trapping, an inert background, Escape handling and the top layer for free.
 * Closing goes back in history, which also restores the homepage URL.
 */
export function CaseModal({
  titleId,
  closeLabel,
  header,
  children,
}: {
  titleId: string;
  closeLabel: string;
  header: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = () => router.back();

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      // Clicks on the ::backdrop are dispatched to the <dialog> itself.
      onClick={(e) => e.target === e.currentTarget && close()}
      className="case-dialog m-auto max-h-[88vh] w-[min(760px,calc(100%-32px))] max-w-none overflow-hidden rounded-lg bg-surface p-0 text-fg shadow-dialog backdrop:bg-[color-mix(in_srgb,var(--color-neutral-800)_55%,transparent)] backdrop:backdrop-blur-[6px]"
    >
      <div className="flex max-h-[88vh] flex-col gap-5.5 overflow-y-auto p-[clamp(22px,4vw,40px)]">
        <div className="flex items-start justify-between gap-4">
          {header}
          <Button size="icon" aria-label={closeLabel} onClick={close} className="size-9 flex-none">
            <XIcon aria-hidden="true" className="size-4" />
          </Button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
