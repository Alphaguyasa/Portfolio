#!/usr/bin/env node
/**
 * Post-build checks against the real production server:
 *   - link check: crawls every same-origin page from "/", fails on any non-2xx
 *     response and on any "#fragment" link with no matching id on its page
 *   - accessibility: runs axe-core (WCAG 2.1 A/AA rules) on every page and fails
 *     on serious or critical violations, at desktop and phone widths
 *   - security headers: every page must carry a Content-Security-Policy, and no
 *     page may log a CSP violation (a blocked script, style, font or image)
 *
 *   npm run build && npm run check:site
 *
 * External links are not fetched: third-party sites (LinkedIn especially) block
 * bots, which would make CI fail for reasons outside this repo.
 */
import { spawn } from "node:child_process";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const PORT = Number(process.env.PORT ?? 3123);
const BASE = `http://127.0.0.1:${PORT}`;
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 375, height: 800 },
];

async function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not start at ${url}`);
}

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
  stdio: ["ignore", "inherit", "inherit"],
});

const problems = [];
let browser;

try {
  await waitForServer(BASE);
  browser = await chromium.launch();

  const queue = ["/"];
  const seen = new Set(queue);
  const checkedAssets = new Set();

  while (queue.length) {
    const pathname = queue.shift();
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const cspViolations = [];
      page.on("console", (msg) => {
        if (/Content Security Policy/i.test(msg.text())) cspViolations.push(msg.text());
      });
      const res = await page.goto(BASE + pathname, { waitUntil: "networkidle" });
      if (!res || !res.ok()) {
        problems.push(`${pathname}: HTTP ${res?.status() ?? "no response"}`);
        await context.close();
        break;
      }

      if (!res.headers()["content-security-policy"]) problems.push(`${pathname}: no Content-Security-Policy header`);

      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      for (const v of axe.violations) {
        if (v.impact === "serious" || v.impact === "critical") {
          const where = v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ");
          problems.push(`${pathname} [${vp.name}] a11y ${v.impact}: ${v.id} (${v.help}) at ${where}`);
        }
      }

      if (vp.name === "desktop") {
        const { links, ids } = await page.evaluate(() => ({
          links: [...document.querySelectorAll("a[href], link[href], img[src]")].map(
            (el) => el.getAttribute("href") ?? el.getAttribute("src"),
          ),
          ids: [...document.querySelectorAll("[id]")].map((el) => el.id),
        }));
        for (const href of links) {
          if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("data:")) continue;
          const url = new URL(href, BASE + pathname);
          if (url.origin !== BASE) continue;
          if (url.hash && url.pathname === pathname && !ids.includes(decodeURIComponent(url.hash.slice(1)))) {
            problems.push(`${pathname}: link to missing anchor ${url.hash}`);
          }
          const target = url.pathname + url.search;
          const isPage = !/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.startsWith("/_next/");
          if (isPage) {
            if (!seen.has(url.pathname)) {
              seen.add(url.pathname);
              queue.push(url.pathname);
            }
          } else if (!checkedAssets.has(target)) {
            checkedAssets.add(target);
            const r = await fetch(BASE + target);
            if (!r.ok) problems.push(`${pathname}: broken asset ${target} (HTTP ${r.status})`);
          }
        }
      }
      for (const v of cspViolations) problems.push(`${pathname} [${vp.name}] CSP violation: ${v}`);
      await context.close();
    }
  }

  console.log(`check-site: ${seen.size} page(s), ${checkedAssets.size} asset(s) checked`);
} catch (err) {
  problems.push(String(err?.stack ?? err));
} finally {
  await browser?.close();
  server.kill();
}

if (problems.length) {
  console.error(`check-site: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("check-site: all links resolve and no serious accessibility violations");
