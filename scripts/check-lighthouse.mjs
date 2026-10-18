#!/usr/bin/env node
/**
 * Lighthouse against the real production server, at Lighthouse's default mobile
 * settings (emulated phone, throttled network and CPU). Fails when any of the four
 * categories has a median under 90 over three runs, on the home page or a project
 * page. Runs locally in the CI runner: nothing is uploaded.
 *
 *   npm run build && npm run check:lighthouse
 *
 * Uses the Chromium that check:site already installs; CHROME_PATH overrides it.
 */
import { spawn } from "node:child_process";
import lighthouse from "lighthouse";
import { chromium } from "playwright";
import { RUNS, failures, medianScores, scoresOf } from "./lib/lighthouse.mjs";

const PORT = Number(process.env.PORT ?? 3124);
const DEBUG_PORT = 9223;
const BASE = `http://127.0.0.1:${PORT}`;
const PAGES = ["/", "/projects/mezgeb"];

async function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not start at ${url}`);
}

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
  stdio: ["ignore", "ignore", "inherit"],
});

const problems = [];
let browser;

try {
  await waitForServer(BASE);
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: [`--remote-debugging-port=${DEBUG_PORT}`],
  });
  for (const pathname of PAGES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      const result = await lighthouse(BASE + pathname, { port: DEBUG_PORT, logLevel: "error" });
      if (!result) throw new Error(`${pathname}: Lighthouse returned no result`);
      runs.push(scoresOf(result.lhr));
    }
    const scores = medianScores(runs);
    console.log(`check-lighthouse: ${pathname} median of ${RUNS} ${JSON.stringify(scores)}`);
    problems.push(...failures(pathname, scores));
  }
} catch (error) {
  problems.push(String(error?.stack ?? error));
} finally {
  await browser?.close();
  server.kill();
}

if (problems.length) {
  console.error(`check-lighthouse: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("check-lighthouse: every category is 90+ on every checked page");
