/**
 * Contact form constants and types — no zod here, so client components can import them without
 * pulling the validation library into the initial bundle (the schema is loaded on submit).
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

export type FieldErrors = Partial<Record<ContactField, FieldErrorCode>>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "rateLimited" }
  | { status: "error" };
