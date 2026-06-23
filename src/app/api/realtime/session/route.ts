// Mints a short-lived ephemeral client secret for the browser WebRTC demo.
// The standard OPENAI_API_KEY never leaves the server — the browser only ever
// receives an `ek_...` token bound to this session/model.
//
// Dormant by default: with no OPENAI_API_KEY configured this returns 503 and the
// demo UI never renders (see VoiceDemoSection), so the public site costs nothing.
//
// Abuse protection: each successful call starts a *paid* realtime session, so
// requests are rate limited per IP (and globally when Upstash is configured)
// before any token is minted. See lib/rate-limit.ts. For even stronger
// guarantees add a Turnstile/captcha challenge in front of the button.

import { checkRateLimit } from "@/lib/rate-limit";

const MODEL = "gpt-realtime-2";

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Verifies a Cloudflare Turnstile token. If no secret is configured the check is
// skipped (returns true), so the demo works with or without Turnstile set up.
async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → skip
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = clientIp(req);

  // Block abusive traffic before spending money on a token.
  const rate = await checkRateLimit(ip);
  if (!rate.allowed) {
    return Response.json(
      {
        error: "rate_limited",
        reason: rate.reason,
      },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  // Confirm a human (no-op unless Turnstile is configured).
  let turnstileToken: string | undefined;
  try {
    const body = (await req.json()) as { turnstileToken?: string };
    turnstileToken = body?.turnstileToken;
  } catch {
    /* no body is fine when Turnstile is disabled */
  }
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return Response.json({ error: "verification_failed" }, { status: 403 });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": "toyinyu-portfolio-demo",
      },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model: MODEL,
          instructions:
            "You are To Yin Yu's friendly portfolio assistant. To Yin Yu is a " +
            "full-stack and applied-AI engineer who builds with TypeScript, " +
            "Python, Next.js, FastAPI, WebRTC and the OpenAI Realtime API. Keep " +
            "replies short, warm and conversational. If asked who built you, say " +
            "To Yin Yu did, as a live demo on his portfolio.",
          audio: { output: { voice: "marin" } },
        },
      }),
    });

    if (!res.ok) {
      return Response.json({ error: "upstream_error" }, { status: 502 });
    }

    const data = await res.json();
    const token = data?.value ?? data?.client_secret?.value;
    if (!token) {
      return Response.json({ error: "no_token" }, { status: 502 });
    }

    return Response.json({ token, model: MODEL });
  } catch {
    return Response.json({ error: "exception" }, { status: 502 });
  }
}
