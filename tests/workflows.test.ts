import { readdirSync, readFileSync } from "node:fs";
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

// A tag like `@v4` can be re-pointed to new code that then runs with the repo's
// token; a full commit SHA cannot. The comment keeps the version readable.
describe("third-party actions", () => {
  const files = readdirSync(path.join(root, ".github/workflows")).filter((f) => /\.ya?ml$/.test(f));
  const uses = files.flatMap((f) =>
    [...read(f).matchAll(/^\s*(?:-\s*)?uses:\s*(.+)$/gm)].map((m) => ({ file: f, line: m[1].trim() })),
  );

  it("are found in the workflows", () => {
    expect(files).toEqual(expect.arrayContaining(["ci.yml", "audit.yml"]));
    expect(uses.length).toBeGreaterThan(0);
  });

  it("are pinned to a full commit SHA with the version in a comment", () => {
    for (const u of uses) {
      expect(u.line, `${u.file}: ${u.line}`).toMatch(/^[\w.-]+\/[\w./-]+@[0-9a-f]{40} # v\d+(\.\d+)*$/);
    }
  });
});
