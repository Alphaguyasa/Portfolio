#!/usr/bin/env node
/**
 * GitHub sync: reads Alpha's repos (read-only) and writes a snapshot that every
 * claim on the site is checked against.
 *
 *   node scripts/sync-github.mjs            # writes data/sync/
 *
 * Output
 *   data/sync/index.json            one entry per included repo: metadata, CI, tags,
 *                                   last commit, recent merged PRs
 *   data/sync/docs/<repo>/<path>    the repo's README / ROADMAP / docs, verbatim
 *
 * Rules (see CLAUDE.md):
 *   - Public repos are included unless listed in portfolio.config.json "skip".
 *   - A private repo is included ONLY if listed in "include", and then nothing is
 *     fetched from it: only the public summary written in the config is recorded.
 *   - Forks and archived repos are skipped.
 *   - Read-only. This script never writes to GitHub.
 *
 * Auth: GITHUB_TOKEN / GH_TOKEN, else `gh auth token`, else unauthenticated
 * (60 requests/hour, which is not enough for a full run).
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { selectRepos } from "./lib/repos.mjs";

// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY is set. Behind a proxy
// (the scheduled cloud run) a direct request never gets the proxy's credentials, so
// re-run this script once with the variable set. No-op without a proxy.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const child = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: "inherit",
    env: { ...process.env, NODE_USE_ENV_PROXY: "1" },
  });
  process.exit(child.status ?? 1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "data", "sync");
const API = "https://api.github.com";

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  try {
    return execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

const auth = token();
let requests = 0;

async function fetchWithRetry(url, init, attempts = 4) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, init);
      if (res.status < 500 || i >= attempts) return res;
    } catch (err) {
      if (i >= attempts) throw err;
    }
    await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
  }
}

async function gh(pathname, { raw = false, allow404 = false } = {}) {
  requests++;
  const res = await fetchWithRetry(`${API}${pathname}`, {
    headers: {
      Accept: raw ? "application/vnd.github.raw" : "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "alpha-portfolio-sync",
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
  });
  if (res.status === 404 && allow404) return null;
  if (!res.ok) {
    const err = new Error(`GitHub ${res.status} for ${pathname}: ${await res.text()}`);
    err.status = res.status;
    throw err;
  }
  return raw ? res.text() : res.json();
}

/** Published version from the public npm registry (free, unauthenticated). */
async function npmInfo(name) {
  const res = await fetchWithRetry(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const meta = await res.json();
  const latest = meta["dist-tags"]?.latest ?? null;
  return { name, latest, publishedAt: latest ? (meta.time?.[latest] ?? null) : null };
}

async function listDocs(full, branch, config) {
  const docs = {};
  const wanted = new Set(config.docPaths);
  const top = (await gh(`/repos/${full}/contents?ref=${branch}`, { allow404: true })) ?? [];
  const files = top.filter((f) => f.type === "file" && wanted.has(f.name)).map((f) => f.path);

  for (const dir of config.docDirs) {
    if (!top.some((f) => f.type === "dir" && f.name === dir)) continue;
    const entries = (await gh(`/repos/${full}/contents/${dir}?ref=${branch}`, { allow404: true })) ?? [];
    for (const e of entries) {
      if (e.type === "file" && e.name.toLowerCase().endsWith(".md")) files.push(e.path);
    }
  }

  for (const file of files.sort()) {
    const text = await gh(`/repos/${full}/contents/${encodeURI(file)}?ref=${branch}`, {
      raw: true,
      allow404: true,
    });
    if (text == null) continue;
    docs[file] =
      text.length > config.maxDocBytes ? text.slice(0, config.maxDocBytes) : text;
  }
  return { docs, rootFiles: top.map((f) => f.name).sort() };
}

async function syncRepo(repo, config) {
  const full = repo.full_name;
  const branch = repo.default_branch;

  const [languages, release, tags, commits, runs, pulls] = await Promise.all([
    gh(`/repos/${full}/languages`),
    gh(`/repos/${full}/releases/latest`, { allow404: true }),
    gh(`/repos/${full}/tags?per_page=10`),
    gh(`/repos/${full}/commits?sha=${branch}&per_page=1`, { allow404: true }),
    gh(`/repos/${full}/actions/runs?branch=${branch}&per_page=1&exclude_pull_requests=true`, {
      allow404: true,
    }),
    gh(`/repos/${full}/pulls?state=closed&sort=updated&direction=desc&per_page=30`),
  ]);

  const lastRun = runs?.workflow_runs?.[0];
  const { docs, rootFiles } = await listDocs(full, branch, config);
  const npmName = config.npmPackages?.[repo.name];
  const npm = npmName ? await npmInfo(npmName) : null;

  return {
    entry: {
      name: repo.name,
      fullName: full,
      url: repo.html_url,
      private: false,
      description: repo.description ?? "",
      homepage: repo.homepage || "",
      topics: repo.topics ?? [],
      license: repo.license?.spdx_id ?? null,
      primaryLanguage: repo.language ?? null,
      languages: Object.keys(languages ?? {}),
      defaultBranch: branch,
      createdAt: repo.created_at,
      pushedAt: repo.pushed_at,
      lastCommitAt: commits?.[0]?.commit?.committer?.date ?? null,
      latestRelease: release ? { tag: release.tag_name, publishedAt: release.published_at } : null,
      tags: (tags ?? []).map((t) => t.name),
      ci: lastRun
        ? {
            workflow: lastRun.name,
            status: lastRun.status,
            conclusion: lastRun.conclusion,
            at: lastRun.created_at,
          }
        : null,
      mergedPulls: (pulls ?? [])
        .filter((p) => p.merged_at)
        .sort((a, b) => b.merged_at.localeCompare(a.merged_at))
        .slice(0, 10)
        .map((p) => ({ number: p.number, title: p.title, mergedAt: p.merged_at, url: p.html_url })),
      npm,
      rootFiles,
      docs: Object.keys(docs),
    },
    docs,
  };
}

async function main() {
  const config = JSON.parse(await readFile(path.join(root, "portfolio.config.json"), "utf8"));
  // /users/:user/repos lists public repos only, which is what we want: private
  // repos come in through config.include and are never read.
  const { repos } = await selectRepos(gh, config, (msg) => console.warn(msg));

  // Empty data/sync/docs rather than deleting it: on Windows a directory that is
  // some process's cwd cannot be removed, and the result is the same.
  const docsDir = path.join(outDir, "docs");
  await mkdir(docsDir, { recursive: true });
  for (const child of await readdir(docsDir)) {
    await rm(path.join(docsDir, child), { recursive: true, force: true, maxRetries: 5 });
  }

  const index = { owner: config.owner, syncedAt: new Date().toISOString(), repos: [] };
  for (const repo of repos.sort((a, b) => a.full_name.localeCompare(b.full_name))) {
    const { entry, docs } = await syncRepo(repo, config);
    index.repos.push(entry);
    for (const [file, text] of Object.entries(docs)) {
      const dest = path.join(outDir, "docs", repo.full_name, file);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, text);
    }
    console.log(`synced ${repo.full_name} (${entry.docs.length} docs)`);
  }

  for (const [name, summary] of Object.entries(config.include ?? {})) {
    index.repos.push({ name, fullName: `${config.owner}/${name}`, private: true, publicSummary: summary });
    console.log(`included private ${name} from config summary only`);
  }

  await writeFile(path.join(outDir, "index.json"), JSON.stringify(index, null, 2) + "\n");
  console.log(`done: ${index.repos.length} repos, ${requests} API requests`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
