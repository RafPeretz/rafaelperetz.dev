/**
 * Icon names that content files (services, stack, …) may reference.
 * Shared by velite.config.ts (schema validation) and components/ui/content-icon.tsx (rendering),
 * so a typo in frontmatter fails the build instead of rendering nothing.
 */
export const CONTENT_ICONS = [
  "git-merge",
  "cloud-arrow-up",
  "rocket-launch",
  "infinity",
  "steering-wheel",
  "cube",
  "cloud",
  "github-logo",
  "arrows-clockwise",
  "file-py",
  "lightning",
  "atom",
  "database",
  "train",
  "triangle",
  "shield-check",
  "identification-badge",
  "key",
  "robot",
] as const;

export type ContentIconName = (typeof CONTENT_ICONS)[number];
