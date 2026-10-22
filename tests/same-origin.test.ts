import { describe, expect, it } from "vitest";
import { isCrossSite } from "@/lib/same-origin";

const SITE = "https://alpha-guyasa-portfolio.vercel.app";

function req(url: string, headers: Record<string, string>) {
  return new Request(url, { method: "POST", headers });
}

describe("isCrossSite", () => {
  it("allows a request with no Origin header", () => {
    expect(isCrossSite(req(`${SITE}/api/contact`, {}), SITE)).toBe(false);
  });

  it("allows the canonical site and the host the request was sent to", () => {
    expect(isCrossSite(req("http://localhost:3000/api/contact", { origin: SITE }), SITE)).toBe(false);
    expect(
      isCrossSite(req("http://localhost:3000/api/contact", { origin: "http://localhost:3000" }), SITE),
    ).toBe(false);
  });

  it("allows a preview deployment named by the Host or X-Forwarded-Host header", () => {
    const preview = "https://portfolio-git-x.vercel.app";
    expect(
      isCrossSite(req("http://internal/api/contact", { origin: preview, host: "portfolio-git-x.vercel.app" }), SITE),
    ).toBe(false);
    expect(
      isCrossSite(
        req("http://internal/api/contact", { origin: preview, "x-forwarded-host": "portfolio-git-x.vercel.app" }),
        SITE,
      ),
    ).toBe(false);
  });

  it("refuses another site, a different port and an opaque origin", () => {
    expect(isCrossSite(req(`${SITE}/api/contact`, { origin: "https://evil.example" }), SITE)).toBe(true);
    expect(isCrossSite(req("http://localhost:3000/x", { origin: "http://localhost:4000" }), SITE)).toBe(true);
    expect(isCrossSite(req(`${SITE}/api/contact`, { origin: "null" }), SITE)).toBe(true);
  });

  it("refuses a look-alike host", () => {
    expect(
      isCrossSite(req(`${SITE}/api/contact`, { origin: "https://alpha-guyasa-portfolio.vercel.app.evil.example" }), SITE),
    ).toBe(true);
  });
});
