import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { MAX_BODY_BYTES } from "@/lib/read-capped";
import { budgetOptions, interestOptions, site } from "@/data/site";

let ip = 0;

/** Each call gets its own address so the shared rate-limit window stays clean. */
function post(body: unknown, address = `192.0.2.${++ip}`, extra: Record<string, string> = {}) {
  return POST(
    new Request("https://example.com/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": address, ...extra },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const valid = {
  name: "Jane Doe",
  email: "jane@company.com",
  phone: "+251 911 000000",
  interest: interestOptions[0],
  budget: budgetOptions[0],
  country: "Ethiopia",
  message: "Are you free for a contract in March?",
};

const fetchMock = vi.fn<typeof fetch>();

describe("POST /api/contact", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: "sent" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends the message to the site address and replies to the sender", async () => {
    const response = await post(valid);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ delivery: "sent" });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer re_test_key");
    const payload = JSON.parse(String(init?.body));
    expect(payload.to).toEqual([site.email]);
    expect(payload.reply_to).toBe("jane@company.com");
    expect(payload.subject).toContain("Jane Doe");
    expect(payload.text).toContain("Are you free for a contract in March?");
  });

  it("answers a filled honeypot as sent but delivers nothing", async () => {
    const response = await post({ ...valid, company: "Acme Bots" });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ delivery: "sent" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends normally when the honeypot is present but empty", async () => {
    const response = await post({ ...valid, company: "" });
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("accepts a post from the site's own origin", async () => {
    const response = await post(valid, undefined, { origin: "https://example.com" });
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("accepts a post from the canonical site URL", async () => {
    const response = await post(valid, undefined, { origin: site.url });
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("refuses a cross-site post with 403 and delivers nothing", async () => {
    const response = await post(valid, undefined, { origin: "https://evil.example" });
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses an opaque null origin", async () => {
    const response = await post(valid, undefined, { origin: "null" });
    expect(response.status).toBe(403);
  });

  it("does not spend the sender's rate limit on refused cross-site posts", async () => {
    const address = "198.51.100.77";
    for (let i = 0; i < 10; i++) {
      await post(valid, address, { origin: "https://evil.example" });
    }
    const response = await post(valid, address, { origin: "https://example.com" });
    expect(response.status).toBe(200);
  });

  it("still accepts a post with no Origin header", async () => {
    const response = await post(valid);
    expect(response.status).toBe(200);
  });

  it("rejects missing fields with per-field errors", async () => {
    const response = await post({ ...valid, message: "   " });
    expect(response.status).toBe(422);
    expect((await response.json()).errors.message).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    const response = await post({ ...valid, email: "jane[at]company" });
    expect(response.status).toBe(422);
    expect((await response.json()).errors.email).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an option that is not on the form", async () => {
    const response = await post({ ...valid, budget: "$1" });
    expect(response.status).toBe(422);
    expect((await response.json()).errors.budget).toBeTruthy();
  });

  it("rejects a body that is not JSON or not an object", async () => {
    expect((await post("{not json")).status).toBe(400);
    expect((await post(null)).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses a body over the size cap before parsing it", async () => {
    const response = await post({ ...valid, message: "a".repeat(MAX_BODY_BYTES) });
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses an oversized body even when Content-Length understates it", async () => {
    const big = JSON.stringify({ ...valid, message: "a".repeat(MAX_BODY_BYTES) });
    const response = await POST(
      new Request("https://example.com/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "content-length": "10", "x-forwarded-for": "198.51.100.7" },
        body: new Blob([big]).stream(),
        duplex: "half",
      } as RequestInit),
    );
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts a full-length message written in Amharic", async () => {
    const response = await post({ ...valid, message: "ሰላም".repeat(1666) });
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reports unconfigured delivery when the API key is absent, so the form falls back to mailto", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const response = await post(valid);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ delivery: "unconfigured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces a provider rejection as 502 without leaking its detail", async () => {
    fetchMock.mockResolvedValue(new Response("domain not verified", { status: 403 }));
    const response = await post(valid);
    expect(response.status).toBe(502);
    expect(JSON.stringify(await response.json())).not.toContain("domain not verified");
  });

  it("surfaces a network failure as 502", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect((await post(valid)).status).toBe(502);
  });

  it("rate-limits a single address after 5 messages", async () => {
    for (let i = 0; i < 5; i += 1) expect((await post(valid, "198.51.100.99")).status).toBe(200);

    const blocked = await post(valid, "198.51.100.99");
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });
});
