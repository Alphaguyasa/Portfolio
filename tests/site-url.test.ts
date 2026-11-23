import { readFileSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { site } from "@/data/site";

const root = process.cwd();
const config = JSON.parse(readFileSync(path.join(root, "portfolio.config.json"), "utf8")) as { productionHost: string };

describe("site URL", () => {
  it("is the recorded production host, over https, with no path or trailing slash", () => {
    const url = new URL(site.url);
    expect(url.protocol).toBe("https:");
    expect(url.host).toBe(config.productionHost);
    expect(site.url).toBe(`https://${config.productionHost}`);
  });

  it("is not typed anywhere else in the site's code, so it cannot drift in one place", () => {
    const files = execFileSync("git", ["ls-files", "src", "scripts", "README.md"], { cwd: root, encoding: "utf8" })
      .split("\n")
      .filter((f) => /\.(ts|tsx|mjs|md)$/.test(f));
    const elsewhere = files.filter(
      (f) => f !== "src/data/site.ts" && readFileSync(path.join(root, f), "utf8").includes(config.productionHost),
    );
    expect(elsewhere).toEqual([]);
  });
});
