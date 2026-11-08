import { describe, expect, it } from "vitest";
import { readJson } from "./helpers";

type Manifest = Record<"dependencies" | "devDependencies", Record<string, string>>;
type Lock = { packages: Record<string, { version?: string } & Partial<Manifest>> };

const pkg = readJson<Manifest>("package.json");
const lock = readJson<Lock>("package-lock.json");
const EXACT = /^\d+\.\d+\.\d+$/;

// The engineering handbook asks for exact pins: a range lets any `npm install` move a dependency
// without review, even though the lockfile holds it today.
describe("dependency pins", () => {
  for (const field of ["dependencies", "devDependencies"] as const) {
    for (const [name, spec] of Object.entries(pkg[field])) {
      it(`${field}: ${name} is pinned exactly to the locked version`, () => {
        expect(spec, `${name}@${spec} is a range`).toMatch(EXACT);
        expect(lock.packages[`node_modules/${name}`]?.version).toBe(spec);
      });
    }
  }

  it("the lockfile's root entry matches package.json", () => {
    expect(lock.packages[""].dependencies).toEqual(pkg.dependencies);
    expect(lock.packages[""].devDependencies).toEqual(pkg.devDependencies);
  });
});
