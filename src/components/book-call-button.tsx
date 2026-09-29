"use client";

import { type ComponentProps, type MouseEvent } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calUrl, siteConfig } from "@/site.config";

type CalFn = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  q?: unknown[];
  ns?: Record<string, unknown>;
};
declare global {
  interface Window {
    Cal?: CalFn;
  }
}

const EMBED_SRC = "https://app.cal.com/embed/embed.js";
let loadPromise: Promise<boolean> | null = null;

/**
 * Load Cal.com's embed script once. Like Cal's official snippet, a queueing stub is installed
 * first; embed.js drains the queue when it arrives. Resolves false if the script is blocked.
 */
function loadCal(): Promise<boolean> {
  loadPromise ??= new Promise<boolean>((resolve) => {
    if (!window.Cal) {
      const stub: CalFn = (...args: unknown[]) => void stub.q?.push(args);
      stub.q = [];
      stub.ns = {};
      stub.loaded = true;
      window.Cal = stub;
      window.Cal("init", { origin: "https://app.cal.com" });
    }
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return loadPromise;
}

let ready = false;
const warmUp = () => void loadCal().then((ok) => (ready = ok));

/**
 * "Book a call" CTA. A real link to cal.com (works without JS, opens in a new tab).
 * The embed script is fetched on first hover/focus; if it's ready by the click, the booking opens
 * in Cal's popup instead. Touch devices without hover simply get the (mobile-friendly) cal.com page.
 */
export function BookCallButton({
  className,
  variant = "primary",
  size,
  onClick,
  ...props
}: Omit<ComponentProps<"a">, "href"> & Parameters<typeof buttonVariants>[0]) {
  const open = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !ready || !window.Cal || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    window.Cal("ui", { theme, styles: { branding: { brandColor: "#9184d9" } }, hideEventTypeDetails: false });
    window.Cal("modal", { calLink: siteConfig.links.cal, config: { layout: "month_view", theme } });
  };

  return (
    <a
      href={calUrl}
      target="_blank"
      rel="noopener"
      onPointerEnter={warmUp}
      onFocus={warmUp}
      onClick={open}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
