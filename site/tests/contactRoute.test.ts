// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { POST } from "@/app/api/contact/route";

let ip = 0;

/** Each call gets its own address so the shared rate-limit window stays clean. */
function post(body: unknown) {
  ip += 1;
  return POST(
    new Request("https://example.com/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `192.0.2.${ip}`,
      },
      body: JSON.stringify(body),
    }),
  );
}

const valid = {
  name: "Jane Doe",
  email: "jane@company.com",
  message: "Are you free for a contract in March?",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({ data: { id: "sent" }, error: null });
    process.env.RESEND_API_KEY = "re_test_key";
  });

  it("sends the message and replies to the sender", async () => {
    const response = await post(valid);

    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);

    const payload = send.mock.calls[0][0];
    expect(payload.replyTo).toBe("jane@company.com");
    expect(payload.subject).toContain("Jane Doe");
    expect(payload.text).toContain("Are you free for a contract in March?");
  });

  it("rejects missing fields", async () => {
    const response = await post({ ...valid, message: "   " });

    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    const response = await post({ ...valid, email: "jane[at]company" });

    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("swallows honeypot submissions without sending", async () => {
    const response = await post({ ...valid, company: "Acme Spam Co" });

    expect(response.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("reports a 500 when the API key is absent", async () => {
    delete process.env.RESEND_API_KEY;

    const response = await post(valid);

    expect(response.status).toBe(500);
    expect(send).not.toHaveBeenCalled();
  });

  it("surfaces a provider rejection as 502", async () => {
    send.mockResolvedValue({ data: null, error: { message: "domain not verified" } });

    const response = await post(valid);

    expect(response.status).toBe(502);
  });

  it("rate-limits a single address", async () => {
    const headers = {
      "content-type": "application/json",
      "x-forwarded-for": "198.51.100.99",
    };
    const request = () =>
      POST(
        new Request("https://example.com/api/contact", {
          method: "POST",
          headers,
          body: JSON.stringify(valid),
        }),
      );

    for (let i = 0; i < 5; i += 1) {
      expect((await request()).status).toBe(200);
    }

    const blocked = await request();
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
  });
});
