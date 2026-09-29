"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import {
  type BUDGETS,
  HONEYPOT,
  MIN_FILL_MS,
  type PROJECT_TYPES,
  readForm,
  STARTED_AT,
  validateContact,
  type ContactInput,
  type ContactState,
} from "@/lib/contact-schema";
import { serverEnv } from "@/lib/env";
import { allowContactSubmission } from "@/lib/rate-limit";
import { siteConfig } from "@/site.config";

// Human-readable labels for the email (always English: it's for Rafa's inbox).
const PROJECT_LABEL: Record<(typeof PROJECT_TYPES)[number], string> = {
  cicd: "CI/CD pipeline",
  cloud: "Cloud & Kubernetes",
  mvp: "MVP / web app",
  retainer: "DevOps retainer",
  unsure: "Not sure yet",
};
const BUDGET_LABEL: Record<(typeof BUDGETS)[number], string> = {
  lt5k: "Under $5k",
  k5to15: "$5k – $15k",
  k15to40: "$15k – $40k",
  gt40k: "$40k+",
  discuss: "Let’s discuss",
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function renderEmail(data: ContactInput, locale: string) {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Company", data.company || "—"],
    ["Project type", data.projectType ? PROJECT_LABEL[data.projectType] : "—"],
    ["Budget", data.budget ? BUDGET_LABEL[data.budget] : "—"],
    ["Site language", locale],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${data.message}\n`;
  const html = `<table style="font:14px/1.5 system-ui,sans-serif;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:2px 16px 2px 0;color:#75798c">${k}</td><td>${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table><p style="font:15px/1.6 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(
    data.message,
  )}</p>`;
  return { text, html };
}

/** Contact form Server Action (used with useActionState). */
export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Bots: a filled honeypot or an implausibly fast submission gets a fake success.
  const startedAt = Number(form.get(STARTED_AT));
  const tooFast = !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS;
  if (form.get(HONEYPOT) || tooFast) return { status: "success" };

  const result = validateContact(readForm(form));
  if (!result.ok) return { status: "invalid", errors: result.errors };

  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await allowContactSubmission(ip))) return { status: "rateLimited" };

  const env = serverEnv();
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    console.error("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL not configured");
    return { status: "error" };
  }

  const locale = String(form.get("locale") ?? "en").slice(0, 5);
  const { text, html } = renderEmail(result.data, locale);
  const project = result.data.projectType ? ` · ${PROJECT_LABEL[result.data.projectType]}` : "";

  try {
    const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      replyTo: result.data.email,
      subject: `New enquiry from ${result.data.name}${project} — ${siteConfig.domain}`,
      text,
      html,
    });
    if (error) {
      console.error("[contact] Resend error", error);
      return { status: "error" };
    }
  } catch (error) {
    console.error("[contact] send failed", error);
    return { status: "error" };
  }

  return { status: "success" };
}
