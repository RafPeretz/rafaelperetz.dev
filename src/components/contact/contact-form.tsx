"use client";

import { PaperPlaneTiltIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { submitContact } from "@/app/actions/contact";
import {
  BUDGETS,
  FIELDS,
  HONEYPOT,
  PROJECT_TYPES,
  readForm,
  STARTED_AT,
  validateContact,
  type ContactField,
  type ContactState,
  type FieldErrorCode,
  type FieldErrors,
} from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

export type ContactFormLabels = {
  name: string;
  company: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  select: string;
  optional: string;
  submit: string;
  sending: string;
  honeypot: string;
  invalid: string;
  successTitle: string;
  successBody: string;
  sendAnother: string;
  error: string;
  rateLimited: string;
  errors: Record<FieldErrorCode, string>;
  projectTypes: Record<(typeof PROJECT_TYPES)[number], string>;
  budgets: Record<(typeof BUDGETS)[number], string>;
};

const initial: ContactState = { status: "idle" };

/** Remounting the inner form (new key) is how "send another message" resets the action state. */
export function ContactForm(props: { labels: ContactFormLabels; locale: string; email: string }) {
  const [generation, setGeneration] = useState(0);
  return <Form key={generation} {...props} onReset={() => setGeneration((g) => g + 1)} />;
}

function Form({
  labels: l,
  locale,
  email,
  onReset,
}: {
  labels: ContactFormLabels;
  locale: string;
  email: string;
  onReset: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const startedAtRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Timestamp is taken in the browser (the page itself is static, so a server value would be stale).
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  const serverErrors = state.status === "invalid" ? state.errors : {};
  const errors: FieldErrors = { ...serverErrors, ...clientErrors };

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "invalid") focusFirstInvalid(formRef.current, state.errors);
  }, [state]);

  // With JS we submit manually: React resets uncontrolled fields after a form `action` completes,
  // which would wipe the visitor's message on a failed send. Without JS, `action` still works.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const result = validateContact(readForm(data));
    if (!result.ok) {
      setClientErrors(result.errors);
      focusFirstInvalid(e.currentTarget, result.errors);
      return;
    }
    setClientErrors({});
    startTransition(() => formAction(data));
  };

  // Clear a field's error as soon as it's edited.
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as ContactField;
    if (clientErrors[name]) setClientErrors(({ [name]: _removed, ...rest }) => rest);
  };

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col justify-center gap-3 rounded-md bg-[color-mix(in_srgb,var(--color-bg)_60%,transparent)] p-7 font-mono-ui"
      >
        <span dir="ltr" className="text-start text-[15px] text-accent-text">
          {l.successTitle}
        </span>
        <span className="text-[13px] text-fg-muted">{l.successBody}</span>
        <button
          type="button"
          onClick={onReset}
          className="btn btn-ghost mt-2 self-start font-mono-ui text-xs"
        >
          {l.sendAnother}
        </button>
      </div>
    );
  }

  const describedBy = (f: ContactField) => (errors[f] ? `err-${f}` : undefined);
  const err = (f: ContactField) =>
    errors[f] ? (
      <p id={`err-${f}`} className="mt-1.5 flex items-start gap-1.5 text-xs leading-snug text-accent-300">
        <WarningCircleIcon aria-hidden="true" className="mt-px size-3.5 flex-none" />
        {f === "email" && errors[f] === "invalid" ? l.errors.invalid : l.errors[errors[f]]}
      </p>
    ) : null;

  const alert =
    state.status === "error"
      ? l.error.replace("{email}", email)
      : state.status === "rateLimited"
        ? l.rateLimited.replace("{email}", email)
        : state.status === "invalid" || Object.keys(clientErrors).length
          ? l.invalid
          : null;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      onInput={onInput}
      noValidate
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] content-start gap-3.5"
    >
      <input type="hidden" name="locale" value={locale} />
      <input ref={startedAtRef} type="hidden" name={STARTED_AT} defaultValue="" />
      {/* Honeypot: off-screen, skipped by keyboard and screen readers; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-website">{l.honeypot}</label>
        <input id="f-website" name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="f-name" label={l.name}>
        <input
          id="f-name"
          name="name"
          className="input"
          required
          maxLength={100}
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("name")}
        />
        {err("name")}
      </Field>
      <Field id="f-company" label={l.company} hint={l.optional}>
        <input
          id="f-company"
          name="company"
          className="input"
          maxLength={100}
          autoComplete="organization"
          aria-invalid={!!errors.company}
          aria-describedby={describedBy("company")}
        />
        {err("company")}
      </Field>
      <Field id="f-email" label={l.email} className="col-span-full">
        <input
          id="f-email"
          name="email"
          type="email"
          dir="ltr"
          className="input"
          required
          maxLength={254}
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email")}
        />
        {err("email")}
      </Field>
      <Field id="f-type" label={l.projectType} hint={l.optional}>
        <select id="f-type" name="projectType" className="input" defaultValue="">
          <option value="">{l.select}</option>
          {PROJECT_TYPES.map((k) => (
            <option key={k} value={k}>
              {l.projectTypes[k]}
            </option>
          ))}
        </select>
      </Field>
      <Field id="f-budget" label={l.budget} hint={l.optional}>
        <select id="f-budget" name="budget" className="input" defaultValue="">
          <option value="">{l.select}</option>
          {BUDGETS.map((k) => (
            <option key={k} value={k}>
              {l.budgets[k]}
            </option>
          ))}
        </select>
      </Field>
      <Field id="f-msg" label={l.message} className="col-span-full">
        <textarea
          id="f-msg"
          name="message"
          className="input"
          rows={4}
          required
          maxLength={5000}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
        />
        {err("message")}
      </Field>

      <div aria-live="polite" className="col-span-full empty:hidden">
        {alert ? (
          <p
            role={state.status === "error" || state.status === "rateLimited" ? "alert" : undefined}
            className="rounded-md border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-900)_60%,transparent)] px-4 py-3 text-sm"
          >
            {alert}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary col-span-full min-h-11.5 text-[15px]"
      >
        {pending ? l.sending : l.submit}
        <PaperPlaneTiltIcon
          aria-hidden="true"
          className={cn("size-4 rtl:-scale-x-100", pending && "animate-pulse")}
        />
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("field", className)}>
      <label htmlFor={id}>
        {label}
        {hint ? <span className="text-fg-faint"> · {hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

function focusFirstInvalid(form: HTMLFormElement | null, errors: FieldErrors) {
  const first = FIELDS.find((f) => errors[f]);
  if (first) form?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
}
