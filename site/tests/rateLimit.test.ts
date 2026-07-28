import { beforeEach, describe, expect, it, vi } from "vitest";
import { clientKey, rateLimit } from "@/lib/rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("allows up to the limit and blocks the next request", () => {
    const key = `allow-${Math.random()}`;

    for (let i = 0; i < 3; i += 1) {
      expect(rateLimit(key, 3, 60_000).allowed).toBe(true);
    }

    const blocked = rateLimit(key, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("keeps separate counters per key", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;

    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).allowed).toBe(false);
    expect(rateLimit(b, 1, 60_000).allowed).toBe(true);
  });

  it("starts a fresh window once the old one expires", () => {
    vi.useFakeTimers();
    const key = `expiry-${Math.random()}`;

    expect(rateLimit(key, 1, 1_000).allowed).toBe(true);
    expect(rateLimit(key, 1, 1_000).allowed).toBe(false);

    vi.advanceTimersByTime(1_001);

    expect(rateLimit(key, 1, 1_000).allowed).toBe(true);
    vi.useRealTimers();
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
    const withReal = new Request("https://example.com", {
      headers: { "x-real-ip": "198.51.100.4" },
    });
    expect(clientKey(withReal)).toBe("198.51.100.4");
    expect(clientKey(new Request("https://example.com"))).toBe("unknown");
  });
});
