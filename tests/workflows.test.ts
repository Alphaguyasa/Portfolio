import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { root } from "./helpers";

const read = (file: string) => readFileSync(path.join(root, ".github/workflows", file), "utf8");
const ci = read("ci.yml");
const audit = read("audit.yml");

const AUDIT = "npm audit --omit=dev --audit-level=high";

// The weekly job is only useful if it checks exactly what CI's gate checks, on a
// schedule, without write access or the cost of a full CI run.
describe("weekly production audit", () => {
  it("runs on a weekly schedule and by hand", () => {
    expect(audit).toMatch(/schedule:\s*\n\s*- cron: "\d+ \d+ \* \* [0-6]"/);
    expect(audit).toContain("workflow_dispatch:");
    expect(audit).not.toMatch(/^\s*(pull_request|push):/m);
  });

  it("runs the same audit command as CI", () => {
    expect(ci).toContain(AUDIT);
    expect(audit).toContain(AUDIT);
  });

  it("is read-only and skips install scripts", () => {
    expect(audit).toMatch(/permissions:\s*\n\s*contents: read\s*\n/);
    expect(audit).not.toMatch(/: write/);
    expect(audit).toContain("npm ci --ignore-scripts");
    expect(audit).not.toMatch(/npm run (build|check)/);
  });
});
