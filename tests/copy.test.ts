import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildCopy, buildShipped, isHousekeeping, methodEvidence } from "../scripts/lib/copy.mjs";
import { numbersIn, proseOf } from "../scripts/lib/facts.mjs";
import { fixture, readJson, root, type Data, type Sync } from "./helpers";

const data = readJson<Data>("data/projects.json");
const sync = readJson<Sync>("data/sync/index.json");
const { certificates } = readJson<{ certificates: Certificate[] }>("data/certificates.json");

type Certificate = { title: string; kind: string; issuer: string; issued: string; href: string };

describe("PORTFOLIO_COPY.md and data/shipped.json", () => {
  it("are regenerated from the current data (run `npm run copy`)", () => {
    expect(readFileSync(path.join(root, "PORTFOLIO_COPY.md"), "utf8")).toBe(buildCopy(data.projects, sync, certificates));
    expect(readJson("data/shipped.json")).toEqual(buildShipped(data.projects, sync));
  });

  it("states no number that the verified project data does not", () => {
    const allowed = new Set(data.projects.flatMap((p) => proseOf(p).flatMap(([, t]: [string, string]) => numbersIn(t))));
    const m = methodEvidence(data.projects, sync);
    for (const n of [m.total, m.withRoadmap, m.withCi]) allowed.add(String(n));

    const copy = buildCopy(data.projects, sync, certificates).replace(/\d{4}-\d{2}-\d{2}/g, "").replace(/@[\d.]+/g, "");
    const npmVersions = sync.repos.flatMap((r) => (r.npm?.latest ? numbersIn(r.npm.latest) : []));
    for (const n of npmVersions) allowed.add(n);
    // Certificate links are the issuer's own URLs; their digits are not claims.
    for (const n of certificates.flatMap((c) => numbersIn(c.href))) allowed.add(n);

    const unbacked = numbersIn(copy).filter((n: string) => !allowed.has(n));
    expect(unbacked).toEqual([]);
  });
});

describe("buildShipped", () => {
  it("lists real work, newest first, one release tag per day, within the window", () => {
    const f = fixture();
    const feed = buildShipped([f.project()], f.sync);
    expect(feed.map((i: { title: string }) => i.title)).toEqual(["Add the ledger", "v2026-10-14-2", "v2026-10-13-1"]);
  });

  it("never includes private repos", () => {
    const f = fixture();
    const p = f.project();
    p.repo = "me/secret";
    expect(buildShipped([p], f.sync)).toEqual([]);
  });
});

describe("isHousekeeping", () => {
  it.each([
    "docs: log the 2026-10-14 setup run",
    "Log 2026-10-14 run; mark roadmap items done",
    "Resolve auto-approve item in NEEDS_APPROVAL",
    "Model policy: Opus line only",
    "chore(deps): bump next",
  ])("hides %s", (title) => expect(isHousekeeping(title)).toBe(true));

  it.each(["Parser: never read a value from a cut-off message", "Send and honour delivery receipts (ACK)"])(
    "keeps %s",
    (title) => expect(isHousekeeping(title)).toBe(false),
  );
});

describe("certificates", () => {
  it("each have a Udacity verification link and an exact issue date", () => {
    expect(certificates.length).toBeGreaterThan(0);
    for (const c of certificates) {
      expect(c.href).toMatch(/^https:\/\/www\.udacity\.com\/certificate\/e\/[0-9a-f-]{36}$/);
      expect(c.issued).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("are listed in the copy with their links", () => {
    const copy = buildCopy(data.projects, sync, certificates);
    for (const c of certificates) expect(copy).toContain(`**${c.title}** — ${c.issuer} ${c.kind}, issued ${c.issued}. ${c.href}`);
  });
});
