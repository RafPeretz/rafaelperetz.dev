import * as z from "zod/mini";

/**
 * Contact form contract, shared by the client (instant feedback) and the Server Action (the real check).
 * Issues carry *codes* (e.g. "required"), not sentences, so each locale renders its own messages.
 */

import { BUDGETS, PROJECT_TYPES, type ContactField, type FieldErrors } from "./contact-fields";

export * from "./contact-fields";

// zod/mini: small, tree-shakable API. This module is also loaded in the browser (on first submit).
const text = (max: number, ...checks: z.core.$ZodCheck<string>[]) =>
  z.string().check(z.trim(), ...checks, z.maxLength(max, "tooLong"));

export const contactSchema = z.object({
  name: text(100, z.minLength(1, "required")),
  email: z.pipe(text(254, z.minLength(1, "required")), z.email("invalid")),
  company: z._default(z.optional(text(100)), ""),
  projectType: z.optional(z.enum(PROJECT_TYPES, "invalid")),
  budget: z.optional(z.enum(BUDGETS, "invalid")),
  message: text(5000, z.minLength(1, "required"), z.minLength(20, "tooShort")),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Read the form into a plain object; empty selects become `undefined`. */
export function readForm(form: FormData) {
  const get = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : "";
  };
  const optional = (k: string) => get(k) || undefined;
  return {
    name: get("name"),
    email: get("email"),
    company: get("company"),
    projectType: optional("projectType"),
    budget: optional("budget"),
    message: get("message"),
  };
}

/** Validate and flatten zod issues to one error code per field. */
export function validateContact(
  raw: ReturnType<typeof readForm>,
): { ok: true; data: ContactInput } | { ok: false; errors: FieldErrors } {
  const result = contactSchema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    const code = (["required", "invalid", "tooShort", "tooLong"] as const).find((c) => c === issue.message);
    if (!errors[field]) errors[field] = code ?? "invalid";
  }
  return { ok: false, errors };
}
