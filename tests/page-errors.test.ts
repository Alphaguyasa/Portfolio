import { describe, expect, it } from "vitest";
import { ALLOWED_CONSOLE_ERRORS, classifyConsole } from "../scripts/lib/page-errors.mjs";

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
