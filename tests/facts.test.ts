import { describe, expect, it } from "vitest";
import { numbersIn, normalize, verifyProjects } from "../scripts/lib/facts.mjs";
import { assetExists, fixture, readDoc, readJson, type Data, type Sync } from "./helpers";

describe("the real data", () => {
  it("backs every claim in data/projects.json with the sync snapshot", () => {
    const errors = verifyProjects(
      readJson<Data>("data/projects.json"),
      readJson<Sync>("data/sync/index.json"),
      readDoc,
      assetExists,
    );
    expect(errors).toEqual([]);
  });
});

describe("verifyProjects (honesty rules)", () => {
  const run = (p: ReturnType<ReturnType<typeof fixture>["project"]>) => {
    const f = fixture();
    return verifyProjects({ projects: [p] }, f.sync, f.readDoc, f.assetExists);
  };

  it("accepts a quote that matches the doc across markdown emphasis and line breaks", () => {
    const p = fixture().project();
    p.facts.push({ path: "README.md", quote: "375 unit tests and a 3.07 MB APK" });
    expect(run(p)).toEqual([]);
  });

  it("rejects a quote that is not in the cited doc", () => {
    const p = fixture().project();
    p.facts = [{ path: "README.md", quote: "400 unit tests" }];
    expect(run(p).join()).toMatch(/quote not found/);
  });

  it("rejects a number no verified fact quotes (no invented metrics)", () => {
    const p = fixture().project();
    p.results.push("Used by 5,000 shops.");
    expect(run(p).join()).toMatch(/states "5000"/);
  });

  it("checks numbers in every visible field, including stack and alt text", () => {
    const p = fixture().project();
    p.stack.push("Next.js 99");
    expect(run(p).join()).toMatch(/stack\[1\] states "99"/);
  });

  it("can quote the repo description", () => {
    const p = fixture().project();
    p.facts.push({ path: "@description", quote: "12 screens" });
    p.results.push("12 screens.");
    expect(run(p)).toEqual([]);
  });

  it("rejects a repo the sync did not see, and private repos", () => {
    const missing = fixture().project();
    missing.repo = "me/ghost";
    expect(run(missing).join()).toMatch(/not in the sync snapshot/);

    const priv = fixture().project();
    priv.repo = "me/secret";
    priv.facts = [];
    expect(run(priv).join()).toMatch(/private/);
  });

  it("rejects 'shipped' with no release, npm version or documented release build", () => {
    const p = fixture().project();
    p.status = "shipped";
    expect(run(p).join()).toMatch(/needs a release/);
  });

  it("rejects unknown statuses", () => {
    const p = fixture().project();
    p.status = "launched";
    expect(run(p).join()).toMatch(/status "launched"/);
  });

  it("rejects a 'since <Month> <Year>' that disagrees with the last commit", () => {
    const p = fixture().project();
    p.statusNote = "No commits since March 2026.";
    expect(run(p).join()).toMatch(/last commit is 2026-10-14/);
    p.statusNote = "No commits since October 2026.";
    expect(run(p)).toEqual([]);
  });

  it("rejects stand-in illustrations and images without a source", () => {
    const standIn = fixture().project();
    standIn.images = [{ src: "/assets/proj-suq.png", alt: "x", source: "design" }];
    expect(run(standIn).join()).toMatch(/stand-in/);

    const noSource = fixture().project();
    noSource.images = [{ src: "/assets/real.png", alt: "Real screen" }];
    expect(run(noSource).join()).toMatch(/needs a "source"/);

    const missing = fixture().project();
    missing.images = [{ src: "/assets/nope.png", alt: "x", source: "repo" }];
    expect(run(missing).join()).toMatch(/does not exist/);
  });

  it("requires https links", () => {
    const p = fixture().project();
    p.links = [{ label: "x", href: "http://example.com" }];
    expect(run(p).join()).toMatch(/https/);
  });
});

describe("helpers", () => {
  it("normalizes whitespace and emphasis", () => {
    expect(normalize("**375**  unit\n`tests`")).toBe("375 unit tests");
  });
  it("extracts numbers with separators and decimals", () => {
    expect(numbersIn("1,190 ms, 3.07 MB, 100.00% and 23/23")).toEqual(["1190", "3.07", "100.00", "23", "23"]);
  });
});

describe("completed status", () => {
  it("needs Alpha's dated confirmation, because a repo cannot show it", () => {
    const data = readJson<Data>("data/projects.json");
    const sync = readJson<Sync>("data/sync/index.json");
    const coin = data.projects.find((p) => p.slug === "alpha-coin") as Data["projects"][number] & { statusConfirmed?: string };
    coin.status = "completed";
    delete coin.statusConfirmed;
    expect(verifyProjects(data, sync, readDoc, assetExists).join("\n")).toMatch(/alpha-coin: status "completed" needs statusConfirmed/);
    coin.statusConfirmed = "Alpha, 2026-10-18";
    expect(verifyProjects(data, sync, readDoc, assetExists)).toEqual([]);
  });
});
