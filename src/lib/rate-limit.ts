import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { serverEnv } from "./env";

let limiter: Ratelimit | null | undefined;

function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = serverEnv();
  if (!url || !token) {
    console.warn("[contact] Upstash not configured — rate limiting is disabled.");
    limiter = null;
    return limiter;
  }
  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    prefix: "ratelimit:contact",
    analytics: false,
  });
  return limiter;
}

/** 3 submissions per 10 minutes per client. Fails open if Redis is unreachable. */
export async function allowContactSubmission(clientId: string): Promise<boolean> {
  const rl = getLimiter();
  if (!rl) return true;
  try {
    const { success } = await rl.limit(clientId);
    return success;
  } catch (error) {
    console.error("[contact] rate limiter unavailable, allowing request", error);
    return true;
  }
}
