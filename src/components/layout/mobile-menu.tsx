"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

/**
 * Toggle + dropdown panel for < 900px. The panel's content is server-rendered and passed as children;
 * this component only owns open/close state, Escape handling and focus return.
 */
export function MobileMenu({
  label,
  closeLabel,
  children,
}: {
  label: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onResize = () => window.innerWidth >= 900 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Any link inside the panel closes it (in-page anchors don't trigger a navigation).
  const onPanelClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };

  return (
    <>
      <Button
        ref={buttonRef}
        size="icon"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : label}
        onClick={() => setOpen((o) => !o)}
        className="nav:hidden"
      >
        {open ? (
          <XIcon aria-hidden="true" className="size-4" />
        ) : (
          <ListIcon aria-hidden="true" className="size-4" />
        )}
      </Button>
      <div
        id={panelId}
        hidden={!open}
        onClick={onPanelClick}
        className="absolute inset-x-0 top-full border-b border-hairline bg-bg nav:hidden"
      >
        {children}
      </div>
    </>
  );
}
