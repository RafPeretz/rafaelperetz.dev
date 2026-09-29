import { type ComponentProps } from "react";

import { Link } from "@/i18n/link";
import { cn } from "@/lib/utils";

import { buttonVariants } from "./button";

type Variants = Parameters<typeof buttonVariants>[0];

/** Internal, locale-aware link styled as a button (Server Component). */
export function ButtonLink({ className, variant, size, ...props }: ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
