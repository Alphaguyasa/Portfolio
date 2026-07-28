/**
 * Fixed-window rate limit held in module memory.
 *
 * Scope: one serverless instance. Vercel may run several concurrently and
 * recycles them freely, so a determined attacker spread across instances gets
 * more than `limit`. It is here to stop one script hammering the form and
 * burning the Resend quota, not as a security boundary. Move to Upstash Redis
 * or the Vercel WAF if this ever needs to be authoritative.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Cheap sweep so an instance that lives a long time doesn't grow unbounded. */
function evictExpired(now: number) {
  if (windows.size < 500) return;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  evictExpired(now);

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  return { allowed: true, retryAfter: 0 };
}

/** Best-effort client address. Vercel sets x-forwarded-for; local dev may not. */
export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
