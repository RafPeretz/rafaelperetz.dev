"use client";

import { useEffect } from "react";

import { usePathname } from "@/i18n/navigation";

/**
 * All page-level micro-interactions in one small island, driven by data attributes on
 * server-rendered markup (no wrapper components, no animation library):
 *
 * - [data-reveal]     fade/slide in when scrolled into view. Only elements *below the fold* at load
 *                     are hidden, so there's no flash, and without JS everything is simply visible.
 * - [data-count="N"]  count up from 0 to N when scrolled into view.
 * - .glow-card        accent glow follows the pointer (sets --mx / --my).
 * - [data-magnetic]   button drifts slightly towards the pointer.
 *
 * Everything is skipped under prefers-reduced-motion (glow stays: it's not motion).
 */
export function Interactions() {
  const pathname = usePathname();

  // Scroll reveal + count-up. Re-scanned on client-side navigation.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          if (el.dataset.count != null) countUp(el, Number(el.dataset.count));
          else reveal(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]:not(.reveal-done)")) {
      if (el.getBoundingClientRect().top < window.innerHeight) continue;
      el.classList.add("reveal-pending");
      io.observe(el);
    }
    for (const el of document.querySelectorAll<HTMLElement>("[data-count]")) io.observe(el);

    return () => io.disconnect();
  }, [pathname]);

  // Pointer effects (delegated; fine pointers only).
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let magnet: HTMLElement | null = null;

    const release = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;

      const card = target?.closest<HTMLElement>(".glow-card");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      if (reduced) return;
      const next = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (next !== magnet) release();
      if (!next) return;
      magnet = next;
      const r = next.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      next.style.transform = `translate(${x}px, ${y}px)`;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", release);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", release);
    };
  }, []);

  return null;
}

function reveal(el: HTMLElement) {
  el.classList.add("reveal-in");
  requestAnimationFrame(() => el.classList.remove("reveal-pending"));
  el.addEventListener(
    "transitionend",
    () => {
      el.classList.remove("reveal-in");
      el.classList.add("reveal-done");
    },
    { once: true },
  );
}

function countUp(el: HTMLElement, to: number) {
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / 1100);
    el.textContent = String(Math.round(to * (1 - (1 - p) ** 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  el.textContent = "0";
  requestAnimationFrame(tick);
}
