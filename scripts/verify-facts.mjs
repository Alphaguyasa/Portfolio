#!/usr/bin/env node
/**
 * CI gate: fails if data/projects.json claims anything the GitHub sync snapshot
 * (data/sync/) cannot back. See scripts/lib/facts.mjs for the rules.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verifyProjects } from "./lib/facts.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(path.join(root, p), "utf8"));

const errors = verifyProjects(
  read("data/projects.json"),
  read("data/sync/index.json"),
  (repo, file) => {
    const p = path.join(root, "data/sync/docs", repo, file);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  },
  (src) => existsSync(path.join(root, "public", src)),
);

if (errors.length) {
  console.error(`verify-facts: ${errors.length} unbacked claim(s)\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("verify-facts: every claim in data/projects.json is backed by the sync snapshot");
