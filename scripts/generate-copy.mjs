#!/usr/bin/env node
/**
 * Regenerates, from verified data only:
 *   PORTFOLIO_COPY.md     ready-to-paste text for Upwork, LinkedIn and a CV
 *   data/shipped.json     the "Recently shipped" feed (merged PRs + release tags)
 *
 * Inputs: data/projects.json (claims already checked by verify-facts),
 * data/sync/index.json (live repo facts) and data/certificates.json. Run after
 * scripts/sync-github.mjs.
 * Output is deterministic for a given input, so an unchanged sync is an empty diff.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCopy, buildShipped } from "./lib/copy.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(path.join(root, p), "utf8"));

const projects = read("data/projects.json").projects;
const sync = read("data/sync/index.json");
const certificates = read("data/certificates.json").certificates;

writeFileSync(path.join(root, "PORTFOLIO_COPY.md"), buildCopy(projects, sync, certificates));
writeFileSync(
  path.join(root, "data/shipped.json"),
  JSON.stringify(buildShipped(projects, sync), null, 2) + "\n",
);
console.log("wrote PORTFOLIO_COPY.md and data/shipped.json");
