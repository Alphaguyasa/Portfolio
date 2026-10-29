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

/**
 * Hard ceiling on tracked keys. Pruning expired windows alone is not enough:
 * many distinct keys inside one window (spoofed x-forwarded-for values) would
 * grow the map without bound. Past the cap the oldest windows go first; those
 * clients get a fresh window, which is the cheaper failure than running the
 * instance out of memory.
 */
export const MAX_WINDOWS = 5_000;

// Insertion order is window start order (a renewed window is re-inserted), so
// the first entries are always the oldest.
const windows = new Map<string, Window>();

/** Cheap sweep so an instance that lives a long time doesn't grow unbounded. */
function evict(now: number) {
  if (windows.size < 500) return;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
  for (const key of windows.keys()) {
    if (windows.size < MAX_WINDOWS) break;
    windows.delete(key);
  }
}

/** Number of keys currently tracked; for tests. */
export function trackedWindows() {
  return windows.size;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  evict(now);

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.delete(key);
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
