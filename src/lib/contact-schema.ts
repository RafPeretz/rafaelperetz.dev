import * as z from "zod/mini";

/**
 * Contact form contract, shared by the client (instant feedback) and the Server Action (the real check).
 * Issues carry *codes* (e.g. "required"), not sentences, so each locale renders its own messages.
 */

export const PROJECT_TYPES = ["cicd", "cloud", "mvp", "retainer", "unsure"] as const;
export const BUDGETS = ["lt5k", "k5to15", "k15to40", "gt40k", "discuss"] as const;

export const FIELDS = ["name", "email", "company", "projectType", "budget", "message"] as const;
export type ContactField = (typeof FIELDS)[number];
export type FieldErrorCode = "required" | "invalid" | "tooShort" | "tooLong";

/** Honeypot field name: visually hidden, humans leave it empty. */
export const HONEYPOT = "website";
/** Hidden field with the render timestamp; submissions faster than this are treated as bots. */
export const STARTED_AT = "startedAt";
export const MIN_FILL_MS = 3000;

// zod/mini: same validation, tree-shakable functional API (this module ships to the browser).
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
export type FieldErrors = Partial<Record<ContactField, FieldErrorCode>>;

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

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "rateLimited" }
  | { status: "error" };
