import { describe, expect, it } from "vitest";
import { contentSecurityPolicy, securityHeaders } from "@/lib/security-headers";
import nextConfig from "../next.config";

const directives = (csp: string) =>
  new Map(csp.split(";").map((d) => d.trim().split(/\s+/)).map(([name, ...values]) => [name, values]));

describe("security headers", () => {
  it("sets the hardening headers", () => {
    const headers = new Map(securityHeaders(false).map((h) => [h.key, h.value]));
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    for (const feature of ["camera", "microphone", "geolocation"]) {
      expect(headers.get("Permissions-Policy")).toContain(`${feature}=()`);
    }
  });

  it("keeps the production CSP closed to other origins and to framing", () => {
    const csp = directives(contentSecurityPolicy(false));
    expect(csp.get("default-src")).toEqual(["'self'"]);
    expect(csp.get("frame-ancestors")).toEqual(["'none'"]);
    expect(csp.get("object-src")).toEqual(["'none'"]);
    expect(csp.get("connect-src")).toEqual(["'self'"]);
    expect(csp.get("script-src")).not.toContain("'unsafe-eval'");
    for (const values of csp.values()) {
      expect(values.some((v) => /^(https?:|\*)/.test(v))).toBe(false);
    }
  });

  it("allows eval only in development", () => {
    expect(directives(contentSecurityPolicy(true)).get("script-src")).toContain("'unsafe-eval'");
  });

  it("applies the headers to every route", async () => {
    const rules = await nextConfig.headers!();
    expect(rules).toEqual([{ source: "/:path*", headers: securityHeaders(false) }]);
  });
});
