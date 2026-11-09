import { describe, expect, it } from "vitest";
import { jsonLdProblems, notFoundJsonLdProblems } from "../scripts/lib/json-ld.mjs";

const SITE = "https://alpha-guyasa-portfolio.vercel.app";
const person = { "@context": "https://schema.org", "@type": "Person", url: SITE };
const code = { "@context": "https://schema.org", "@type": "SoftwareSourceCode", url: `${SITE}/projects/mezgeb` };
const json = (v: unknown) => JSON.stringify(v);

describe("jsonLdProblems", () => {
  it("passes a Person whose url is the site, even on /about", () => {
    expect(jsonLdProblems([json(person)], SITE, SITE)).toEqual([]);
    expect(jsonLdProblems([json(person)], `${SITE}/about`, SITE)).toEqual([]);
  });

  it("passes a project block whose url is the page's canonical", () => {
    expect(jsonLdProblems([json(code)], `${SITE}/projects/mezgeb`, SITE)).toEqual([]);
    expect(jsonLdProblems([json(code)], `${SITE}/projects/mezgeb/`, SITE)).toEqual([]);
  });

  it("requires exactly one block", () => {
    expect(jsonLdProblems([], SITE, SITE).join()).toMatch(/0 JSON-LD/);
    expect(jsonLdProblems([json(person), json(person)], SITE, SITE).join()).toMatch(/2 JSON-LD/);
  });

  it("fails on invalid JSON", () => {
    expect(jsonLdProblems(["{not json"], SITE, SITE).join()).toMatch(/not valid JSON/);
  });

  it("fails when a Person points somewhere other than the site", () => {
    expect(jsonLdProblems([json({ ...person, url: "https://old.example" })], SITE, SITE).join()).toMatch(/old\.example/);
  });

  it("fails when a project block points at another page, or the page has no canonical", () => {
    expect(jsonLdProblems([json(code)], `${SITE}/projects/suq`, SITE).join()).toMatch(/expected .*suq/);
    expect(jsonLdProblems([json(code)], null, SITE).join()).toMatch(/expected null/);
  });

  it("fails on a missing @context, @type or url", () => {
    expect(jsonLdProblems([json({ ...person, "@context": "http://other" })], SITE, SITE).join()).toMatch(/@context/);
    expect(jsonLdProblems([json({ "@context": "https://schema.org", url: SITE })], SITE, SITE).join()).toMatch(/@type/);
    expect(jsonLdProblems([json({ "@context": "https://schema.org", "@type": "Person" })], SITE, SITE).join()).toMatch(/no url/);
  });
});

describe("notFoundJsonLdProblems", () => {
  it("passes none and fails any", () => {
    expect(notFoundJsonLdProblems([])).toEqual([]);
    expect(notFoundJsonLdProblems([json(person)]).join()).toMatch(/404 page/);
  });
});
