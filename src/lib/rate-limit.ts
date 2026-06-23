// Rate limiting for the paid realtime-voice endpoint.
//
// Two tiers, both optional and graceful:
//   • If UPSTASH_REDIS_REST_URL/TOKEN are set, uses a durable sliding window in
//     Redis that holds across serverless instances and a global daily cap so
//     distributed abuse still can't run up the bill.
//   • Otherwise falls back to a per-instance in-memory window — weaker (each
//     lambda has its own memory) but better than nothing and needs no setup.
//
// Nothing here throws on missing config, so builds and the no-key path are
// unaffected.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const PER_IP_LIMIT = 3; // sessions
const PER_IP_WINDOW = "1 h" as const;
const GLOBAL_DAILY_LIMIT = 100; // total sessions across everyone per day

let perIp: Ratelimit | null = null;
let global: Ratelimit | null = null;
let redis: Redis | null = null;
let initialized = false;

function init() {
  if (initialized) return;
  initialized = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;
  redis = new Redis({ url, token });
  perIp = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(PER_IP_LIMIT, PER_IP_WINDOW),
    prefix: "rl:realtime:ip",
    analytics: false,
  });
  global = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(GLOBAL_DAILY_LIMIT, "1 d"),
    prefix: "rl:realtime:global",
    analytics: false,
  });
}

// In-memory fallback (per-instance, best-effort).
const memHits = new Map<string, number[]>();
const MEM_WINDOW_MS = 60 * 60 * 1000;

function memAllow(key: string): boolean {
  const now = Date.now();
  const recent = (memHits.get(key) ?? []).filter(
    (t) => now - t < MEM_WINDOW_MS
  );
  if (recent.length >= PER_IP_LIMIT) {
    memHits.set(key, recent);
    return false;
  }
  recent.push(now);
  memHits.set(key, recent);
  return true;
}

export type RateResult = { allowed: boolean; reason?: "ip" | "global" };

export async function checkRateLimit(ip: string): Promise<RateResult> {
  init();

  if (perIp && global) {
    // Global cap first so one IP can't exhaust everyone's budget unfairly,
    // then the per-IP window.
    const globalRes = await global.limit("all");
    if (!globalRes.success) return { allowed: false, reason: "global" };
    const ipRes = await perIp.limit(ip);
    if (!ipRes.success) return { allowed: false, reason: "ip" };
    return { allowed: true };
  }

  return { allowed: memAllow(ip), reason: "ip" };
}
