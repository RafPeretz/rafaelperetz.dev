"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * Prev/next for a horizontal scroll-snap list (by id). Direction-aware: in RTL "next" scrolls left,
 * and the arrows are mirrored. Buttons disable at either end.
 */
export function CarouselControls({ listId, prev, next }: { listId: string; prev: string; next: string }) {
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;
    const update = () => {
      // scrollLeft is 0 → negative in RTL, 0 → positive in LTR; compare magnitudes.
      const pos = Math.abs(list.scrollLeft);
      const max = list.scrollWidth - list.clientWidth;
      setEdges({ start: pos <= 2, end: pos >= max - 2 });
    };
    update();
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      list.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [listId]);

  const scroll = (dir: 1 | -1) => {
    const list = document.getElementById(listId);
    if (!list) return;
    const rtl = getComputedStyle(list).direction === "rtl";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({
      left: list.clientWidth * 0.8 * dir * (rtl ? -1 : 1),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        size="icon-lg"
        aria-label={prev}
        aria-controls={listId}
        disabled={edges.start}
        onClick={() => scroll(-1)}
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4.5 rtl:-scale-x-100" />
      </Button>
      <Button
        size="icon-lg"
        aria-label={next}
        aria-controls={listId}
        disabled={edges.end}
        onClick={() => scroll(1)}
      >
        <ArrowRightIcon aria-hidden="true" className="size-4.5 rtl:-scale-x-100" />
      </Button>
    </div>
  );
}
