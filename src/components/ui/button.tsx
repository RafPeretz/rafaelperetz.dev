import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Nocturne buttons: the primary is an accent outline, never a fill. Base styles live in globals.css (.btn). */
export const buttonVariants = cva("btn whitespace-nowrap", {
  variants: {
    variant: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
    },
    size: {
      sm: "",
      md: "min-h-11 px-4.5 text-[15px]",
      lg: "min-h-12 px-5.5 text-base",
      icon: "btn-icon size-8",
      "icon-lg": "btn-icon size-11",
    },
  },
  defaultVariants: { variant: "secondary", size: "sm" },
});

type Variants = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ComponentProps<"button"> & Variants) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/** External link styled as a button. */
export function ButtonAnchor({ className, variant, size, ...props }: ComponentProps<"a"> & Variants) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
