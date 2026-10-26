import { describe, expect, it } from "vitest";
import { ALLOWED_CONSOLE_ERRORS, classifyConsole, isOwnNotFound } from "../scripts/lib/page-errors.mjs";

describe("check:site page errors", () => {
  it("reports a CSP violation as csp, whatever its level", () => {
    expect(classifyConsole("error", "Refused to load the script because it violates the following Content Security Policy directive")).toBe("csp");
  });

  it("fails on any console error, such as a failed hydration", () => {
    expect(classifyConsole("error", "Minified React error #418; visit https://react.dev/errors/418")).toBe("error");
    expect(classifyConsole("error", "Failed to load resource: the server responded with a status of 404")).toBe("error");
  });

  it("ignores warnings, info and logs", () => {
    expect(classifyConsole("warning", "Something deprecated")).toBeNull();
    expect(classifyConsole("info", "hello")).toBeNull();
    expect(classifyConsole("log", "hello")).toBeNull();
  });

  it("starts with no allowlisted errors", () => {
    expect(ALLOWED_CONSOLE_ERRORS).toEqual([]);
  });
});

describe("check:site 404 page", () => {
  const page = "http://127.0.0.1:3123/check-site-unknown-page";
  const own = "Failed to load resource: the server responded with a status of 404 (Not Found)";

  it("allows only the page's own 404", () => {
    expect(isOwnNotFound(own, page, page)).toBe(true);
  });

  it("still fails a 404 for anything the page loads", () => {
    expect(isOwnNotFound(own, "http://127.0.0.1:3123/_next/static/chunks/app.js", page)).toBe(false);
  });

  it("still fails other errors from the page itself", () => {
    expect(isOwnNotFound("Minified React error #418", page, page)).toBe(false);
  });
});
