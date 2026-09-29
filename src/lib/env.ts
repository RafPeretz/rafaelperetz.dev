import "server-only";

import { z } from "zod";

/**
 * Server-side environment, validated on first use (not at import, so `next build`
 * works without secrets). Missing optional integrations degrade gracefully.
 */
const schema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
  CONTACT_FROM_EMAIL: z.string().min(3).default("Portfolio <onboarding@resend.dev>"),
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

let cached: z.infer<typeof schema> | undefined;

export function serverEnv() {
  // Empty strings (e.g. copied from .env.example) count as "not set".
  const raw = Object.fromEntries(
    Object.keys(schema.shape).map((k) => [k, process.env[k] === "" ? undefined : process.env[k]]),
  );
  cached ??= schema.parse(raw);
  return cached;
}
