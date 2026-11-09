import { describe, expect, it } from "vitest";
import { carryOver, selectRepos, unlistedRepos } from "../scripts/lib/repos.mjs";
import { readJson } from "./helpers";

const repo = (full: string, extra: Record<string, unknown> = {}) => ({
  full_name: full,
  name: full.split("/")[1],
  fork: false,
  archived: false,
  private: false,
  ...extra,
});

const denied = () => Object.assign(new Error("GitHub 403"), { status: 403 });

/** A fake GitHub reader: `listing` is the /users/:u/repos answer, `named` the readable repos. */
function fakeGh({
  listing,
  named,
  search = "403",
}: {
  listing: unknown[] | "403";
  named: Record<string, unknown>;
  search?: unknown[] | "403";
}) {
  return async (pathname: string) => {
    if (pathname.startsWith("/search/")) {
      if (search === "403") throw denied();
      return { items: search };
    }
    if (pathname.startsWith("/users/")) {
      if (listing === "403") throw denied();
      return listing;
    }
    const full = pathname.replace(/^\/repos\//, "");
    if (full in named) return named[full];
    throw denied();
  };
}

const config = {
  owner: "me",
  skip: ["me", "Portfolio"],
  knownPublicRepos: ["me/app", "me/lib"],
  extraPublicRepos: ["org/team"],
};

describe("selectRepos", () => {
  it("uses the owner listing, adds extra repos, drops forks, archived, private and skipped", async () => {
    const gh = fakeGh({
      listing: [
        repo("me/app"),
        repo("me/me"),
        repo("me/Portfolio"),
        repo("me/fork", { fork: true }),
        repo("me/old", { archived: true }),
        repo("me/secret", { private: true }),
        repo("me/new"),
      ],
      named: { "org/team": repo("org/team") },
    });
    const { repos, source } = await selectRepos(gh, config);
    expect(source).toBe("listing");
    expect(repos.map((r) => r.full_name)).toEqual(["me/app", "me/new", "org/team"]);
  });

  it("falls back to knownPublicRepos when the listing is refused", async () => {
    const gh = fakeGh({
      listing: "403",
      named: { "me/app": repo("me/app"), "me/lib": repo("me/lib"), "org/team": repo("org/team") },
    });
    const log: string[] = [];
    const { repos, source } = await selectRepos(gh, config, (m) => log.push(m));
    expect(source).toBe("knownPublicRepos");
    expect(repos.map((r) => r.full_name)).toEqual(["me/app", "me/lib", "org/team"]);
    expect(log[0]).toMatch(/refused \(403\)/);
  });

  it("still never includes a private repo from the fallback list", async () => {
    const gh = fakeGh({
      listing: "403",
      named: { "me/app": repo("me/app", { private: true }), "me/lib": repo("me/lib"), "org/team": repo("org/team") },
    });
    const { repos } = await selectRepos(gh, config);
    expect(repos.map((r) => r.full_name)).toEqual(["me/lib", "org/team"]);
  });

  it("reports a refused repo and still returns the rest", async () => {
    const gh = fakeGh({ listing: "403", named: { "me/app": repo("me/app"), "org/team": repo("org/team") } });
    const { repos, refused } = await selectRepos(gh, config);
    expect(repos.map((r) => r.full_name)).toEqual(["me/app", "org/team"]);
    expect(refused).toEqual(["me/lib"]);
  });

  it("still fails, naming the repo, when a listed repo does not exist", async () => {
    const inner = fakeGh({ listing: "403", named: { "me/app": repo("me/app"), "org/team": repo("org/team") } });
    const gh = async (pathname: string) => (pathname === "/repos/me/lib" ? null : inner(pathname));
    await expect(selectRepos(gh, config)).rejects.toThrow(/cannot read: me\/lib \(404\)/);
  });

  it("logs, but does not sync, a public repo the search finds outside the config", async () => {
    const gh = fakeGh({
      listing: "403",
      named: { "me/app": repo("me/app"), "me/lib": repo("me/lib"), "org/team": repo("org/team") },
      search: [repo("me/app"), repo("me/new"), repo("me/Portfolio"), repo("me/fork", { fork: true })],
    });
    const log: string[] = [];
    const { repos } = await selectRepos(gh, config, (m) => log.push(m));
    expect(repos.map((r) => r.full_name)).toEqual(["me/app", "me/lib", "org/team"]);
    expect(log.slice(1)).toHaveLength(1);
    expect(log[1]).toMatch(/found public repo me\/new .*NOT synced/);
  });

  it("goes on with the configured list when the search is refused too", async () => {
    const gh = fakeGh({
      listing: "403",
      named: { "me/app": repo("me/app"), "me/lib": repo("me/lib"), "org/team": repo("org/team") },
    });
    const log: string[] = [];
    const { repos } = await selectRepos(gh, config, (m) => log.push(m));
    expect(repos).toHaveLength(3);
    expect(log[1]).toMatch(/searching me's repos failed too \(403\)/);
  });

  it("does not search when the owner listing works", async () => {
    const paths: string[] = [];
    const inner = fakeGh({ listing: [repo("me/app")], named: { "org/team": repo("org/team") } });
    await selectRepos(async (p: string) => (paths.push(p), inner(p)), config);
    expect(paths.some((p) => p.startsWith("/search/"))).toBe(false);
  });

  it("rethrows other listing errors instead of falling back", async () => {
    const gh = async () => {
      throw Object.assign(new Error("GitHub 401"), { status: 401 });
    };
    await expect(selectRepos(gh, config)).rejects.toThrow(/401/);
  });
});

describe("unlistedRepos", () => {
  it("keeps only public, non-fork, non-archived, unskipped repos the config does not list", () => {
    const found = [
      repo("me/APP"),
      repo("org/team"),
      repo("me/Portfolio"),
      repo("me/fork", { fork: true }),
      repo("me/old", { archived: true }),
      repo("me/secret", { private: true }),
      repo("me/zeta"),
      repo("me/beta"),
    ];
    expect(unlistedRepos(found, config)).toEqual(["me/beta", "me/zeta"]);
  });
});

describe("portfolio.config.json knownPublicRepos", () => {
  it("covers every public repo in the current snapshot", () => {
    const cfg = readJson<{ knownPublicRepos: string[]; extraPublicRepos: string[] }>("portfolio.config.json");
    const sync = readJson<{ repos: { fullName: string; private: boolean }[] }>("data/sync/index.json");
    const listed = new Set([...cfg.knownPublicRepos, ...cfg.extraPublicRepos].map((r) => r.toLowerCase()));
    for (const r of sync.repos.filter((r) => !r.private)) expect(listed.has(r.fullName.toLowerCase())).toBe(true);
  });
});

describe("carryOver", () => {
  const previous = {
    syncedAt: "2026-11-06T00:00:00Z",
    repos: [{ fullName: "me/lib", docs: ["README.md"] }, { fullName: "me/old", carriedOverFrom: "2026-10-01T00:00:00Z" }],
  };

  it("keeps a refused repo's saved entry and dates it, matching the name in any case", () => {
    expect(carryOver(previous, ["Me/Lib"])).toEqual([
      { fullName: "me/lib", docs: ["README.md"], carriedOverFrom: "2026-11-06T00:00:00Z" },
    ]);
  });

  it("keeps the original date through later syncs", () => {
    expect(carryOver(previous, ["me/old"])[0].carriedOverFrom).toBe("2026-10-01T00:00:00Z");
  });

  it("fails rather than drop a project with nothing saved", () => {
    expect(() => carryOver(previous, ["me/new"])).toThrow(/nothing saved: me\/new/);
    expect(() => carryOver(null, ["me/new"])).toThrow(/nothing saved/);
  });
});
