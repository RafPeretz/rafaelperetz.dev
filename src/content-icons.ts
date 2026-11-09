/**
 * Names that content files (services, stack, case studies, …) may reference.
 * Shared by velite.config.ts (schema validation) and the renderers (components/ui/content-icon.tsx,
 * components/ui/logo.tsx), so a typo in frontmatter fails the build instead of rendering nothing.
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
  "browsers",
  "code",
  "graduation-cap",
  "shield-star",
] as const;

export type ContentIconName = (typeof CONTENT_ICONS)[number];

/** Technology logos (simple-icons, or a Phosphor glyph in the brand colour where the brand isn't in simple-icons). */
export const BRAND_LOGOS = [
  "kubernetes",
  "docker",
  "azure",
  "aws",
  "githubactions",
  "python",
  "fastapi",
  "react",
  "nextdotjs",
  "typescript",
  "nodedotjs",
  "postgresql",
  "supabase",
  "railway",
  "vercel",
] as const;

export type BrandLogoName = (typeof BRAND_LOGOS)[number];
