#!/usr/bin/env node
/**
 * Copies the screenshots listed in data/projects.json (images with `from`) from the
 * projects' public repos into public/assets/projects/<slug>/, downscaled to WebP.
 * Read-only: it only downloads from raw.githubusercontent.com. Run it after adding
 * or changing a `from`, then commit the files: the build never fetches.
 */
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { screenshotPlan } from "./lib/screenshots.mjs";

// Same as sync-github.mjs: Node's fetch only uses HTTPS_PROXY with NODE_USE_ENV_PROXY.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const child = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: "inherit",
    env: { ...process.env, NODE_USE_ENV_PROXY: "1" },
  });
  process.exit(child.status ?? 1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(await readFile(path.join(root, "data/projects.json"), "utf8"));
const plan = screenshotPlan(data);

const invalid = plan.filter((s) => s.errors.length);
if (invalid.length) {
  for (const s of invalid) console.error(`${s.slug} ${s.url}: ${s.errors.join("; ")}`);
  process.exit(1);
}

// Phone screens are shown at most ~260px wide, desktop screens at ~800px; 2x for retina.
const MAX_WIDTH = { portrait: 540, landscape: 1600 };

for (const shot of plan) {
  const res = await fetch(shot.url);
  if (!res.ok) {
    console.error(`${shot.url}: HTTP ${res.status}`);
    process.exit(1);
  }
  const input = Buffer.from(await res.arrayBuffer());
  const { width, height } = await sharp(input).metadata();
  const max = height > width ? MAX_WIDTH.portrait : MAX_WIDTH.landscape;
  const out = await sharp(input).resize({ width: max, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  const dest = path.join(root, "public", shot.src);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, out);
  console.log(`${shot.src}: ${(input.length / 1024).toFixed(0)}KB -> ${(out.length / 1024).toFixed(0)}KB`);
}
console.log(`fetch-screenshots: ${plan.length} screenshot(s) up to date`);
