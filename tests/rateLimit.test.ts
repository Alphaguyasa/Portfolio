import { afterEach, describe, expect, it, vi } from "vitest";
import { MAX_WINDOWS, clientKey, rateLimit, trackedWindows } from "@/lib/rateLimit";

// The limiter's windows live in module memory, so every test uses its own key.
const key = (name: string) => `${name}-${Math.random()}`;

describe("rateLimit", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows up to the limit and blocks the next request", () => {
    const k = key("allow");
    for (let i = 0; i < 3; i += 1) expect(rateLimit(k, 3, 60_000).allowed).toBe(true);

    const blocked = rateLimit(k, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });

  it("keeps separate counters per key", () => {
    const a = key("a");
    const b = key("b");
    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).allowed).toBe(false);
    expect(rateLimit(b, 1, 60_000).allowed).toBe(true);
  });

  it("starts a fresh window once the old one expires", () => {
    vi.useFakeTimers();
    const k = key("expiry");
    expect(rateLimit(k, 1, 1_000).allowed).toBe(true);
    expect(rateLimit(k, 1, 1_000).allowed).toBe(false);

    vi.advanceTimersByTime(1_001);
    expect(rateLimit(k, 1, 1_000).allowed).toBe(true);
  });

  it("never tracks more than MAX_WINDOWS keys, evicting the oldest first", () => {
    const oldest = key("oldest");
    rateLimit(oldest, 1, 60_000);
    expect(rateLimit(oldest, 1, 60_000).allowed).toBe(false);

    // Distinct keys inside one unexpired window: pruning expired ones frees nothing.
    for (let i = 0; i < MAX_WINDOWS * 3; i += 1) rateLimit(key("flood"), 1, 60_000);
    expect(trackedWindows()).toBeLessThanOrEqual(MAX_WINDOWS);

    // The oldest window was evicted, so that client starts over.
    expect(rateLimit(oldest, 1, 60_000).allowed).toBe(true);
  });

  it("keeps a newer window when the cap evicts older ones", () => {
    for (let i = 0; i < MAX_WINDOWS; i += 1) rateLimit(key("fill"), 1, 60_000);
    const recent = key("recent");
    rateLimit(recent, 1, 60_000);
    for (let i = 0; i < 10; i += 1) rateLimit(key("more"), 1, 60_000);
    expect(rateLimit(recent, 1, 60_000).allowed).toBe(false);
  });
});

describe("clientKey", () => {
  it("takes the first hop of x-forwarded-for", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.7, 70.41.3.18" },
    });
    expect(clientKey(request)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip, then to a constant", () => {
    const withReal = new Request("https://example.com", { headers: { "x-real-ip": "198.51.100.4" } });
    expect(clientKey(withReal)).toBe("198.51.100.4");
    expect(clientKey(new Request("https://example.com"))).toBe("unknown");
  });
});
