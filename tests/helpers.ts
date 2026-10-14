import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const root = path.resolve(__dirname, "..");

export function readJson<T = unknown>(rel: string): T {
  return JSON.parse(readFileSync(path.join(root, rel), "utf8")) as T;
}

export function readDoc(repo: string, file: string): string | null {
  const p = path.join(root, "data/sync/docs", repo, file);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

export function assetExists(src: string): boolean {
  return existsSync(path.join(root, "public", src));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Data = { projects: any[] };
export type Sync = { syncedAt: string; repos: any[] };

/** A minimal, self-contained fixture so rule tests do not depend on live data. */
export function fixture() {
  const sync: Sync = {
    syncedAt: "2026-10-14T12:00:00Z",
    repos: [
      {
        name: "app",
        fullName: "me/app",
        url: "https://github.com/me/app",
        private: false,
        description: "An offline app. 12 screens.",
        lastCommitAt: "2026-10-14T10:00:00Z",
        latestRelease: null,
        tags: ["v2026-10-14-1", "v2026-10-14-2", "v2026-10-13-1"],
        npm: null,
        rootFiles: ["CLAUDE.md", "README.md"],
        ci: { conclusion: "success" },
        mergedPulls: [
          { number: 3, title: "Add the ledger", mergedAt: "2026-10-14T09:00:00Z", url: "https://github.com/me/app/pull/3" },
          { number: 2, title: "docs: log the run", mergedAt: "2026-10-14T08:00:00Z", url: "https://github.com/me/app/pull/2" },
          { number: 1, title: "Old work", mergedAt: "2026-06-01T08:00:00Z", url: "https://github.com/me/app/pull/1" },
        ],
      },
      { name: "secret", fullName: "me/secret", private: true, publicSummary: "x" },
    ],
  };
  const docs: Record<string, string> = {
    "me/app/README.md": "# App\n\nIt has **375 unit tests** and a\n`3.07 MB` APK.\n",
  };
  const project = () => ({
    slug: "app",
    name: "App",
    tagline: "An offline app",
    repo: "me/app",
    status: "building",
    statusNote: "Active.",
    featured: true,
    platform: "Android",
    stack: ["Kotlin"],
    problem: "Problem.",
    approach: "Approach.",
    results: ["375 unit tests."],
    learned: [],
    images: [] as any[],
    links: [{ label: "Code", href: "https://github.com/me/app" }],
    facts: [{ path: "README.md", quote: "375 unit tests" }],
  });
  return {
    sync,
    project,
    readDoc: (repo: string, file: string) => docs[`${repo}/${file}`] ?? null,
    assetExists: (src: string) => src === "/assets/real.png",
  };
}
