"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react/ssr";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Both icons and both labels are rendered; CSS picks the right pair from <html data-theme>.
 * That keeps server and client markup identical (no hydration mismatch, no flash).
 */
export function ThemeToggle({ toLight, toDark }: { toLight: string; toDark: string }) {
  const { setTheme } = useTheme();

  return (
    <Button
      size="icon"
      onClick={() => {
        const current = document.documentElement.dataset.theme;
        setTheme(current === "light" ? "dark" : "light");
      }}
    >
      <SunIcon aria-hidden="true" className="size-4 light:hidden" />
      <MoonIcon aria-hidden="true" className="hidden size-4 light:block" />
      <span className="sr-only light:hidden">{toLight}</span>
      <span className="sr-only hidden light:inline">{toDark}</span>
    </Button>
  );
}
