import { describe, expect, it } from "vitest";
import { parseRobots, robotsProblems } from "../scripts/lib/robots.mjs";

const SITE = "https://alpha-guy.vercel.app";
const good = `User-Agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;

describe("parseRobots", () => {
  it("reads groups and sitemaps, case-insensitive, ignoring comments", () => {
    const parsed = parseRobots(`# top\nuser-agent: a\nUSER-AGENT: b\nDISALLOW: /x # no\n\nUser-agent: *\nAllow: /\nSITEMAP: ${SITE}/s.xml`);
    expect(parsed.groups).toEqual([
      { agents: ["a", "b"], allow: [], disallow: ["/x"] },
      { agents: ["*"], allow: ["/"], disallow: [] },
    ]);
    expect(parsed.sitemaps).toEqual([`${SITE}/s.xml`]);
  });

  it("treats an empty Disallow as no rule", () => {
    expect(parseRobots("User-agent: *\nDisallow:\n").groups[0].disallow).toEqual([]);
  });
});

describe("robotsProblems", () => {
  it("passes what robots.ts renders", () => {
    expect(robotsProblems(good, SITE)).toEqual([]);
    expect(robotsProblems(good, `${SITE}/`)).toEqual([]);
  });

  it("fails when no rules cover every agent", () => {
    expect(robotsProblems(`User-agent: bot\nAllow: /\nSitemap: ${SITE}/sitemap.xml`, SITE).join()).toMatch(/no rules for/);
  });

  it('fails when "*" does not allow "/"', () => {
    expect(robotsProblems(`User-agent: *\nAllow: /public\nSitemap: ${SITE}/sitemap.xml`, SITE).join()).toMatch(/does not allow/);
  });

  it('fails when any agent is blocked from "/"', () => {
    expect(robotsProblems(`User-agent: *\nDisallow: /\nAllow: /\nSitemap: ${SITE}/sitemap.xml`, SITE).join()).toMatch(/blocked from/);
    expect(robotsProblems(`${good}\nUser-agent: Googlebot\nDisallow: /\n`, SITE).join()).toMatch(/"Googlebot" is blocked/);
  });

  it("does not flag a blocked sub-path", () => {
    expect(robotsProblems(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE}/sitemap.xml`, SITE)).toEqual([]);
  });

  it("fails on a missing or stale sitemap line", () => {
    expect(robotsProblems("User-agent: *\nAllow: /\n", SITE).join()).toMatch(/names: none/);
    expect(robotsProblems("User-agent: *\nAllow: /\nSitemap: https://old.example/sitemap.xml", SITE).join()).toMatch(/old\.example/);
  });
});
