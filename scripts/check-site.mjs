#!/usr/bin/env node
/**
 * Post-build checks against the real production server:
 *   - link check: crawls every same-origin page from "/", fails on any non-2xx
 *     response and on any "#fragment" link with no matching id on its page
 *   - accessibility: runs axe-core (WCAG 2.1 A/AA rules) on every page and fails
 *     on serious or critical violations, at desktop and phone widths
 *   - security headers: every page must carry a Content-Security-Policy, and no
 *     page may log a CSP violation (a blocked script, style, font or image)
 *   - page errors: no uncaught exception and no console error (a failed hydration
 *     or a missing script shows up as one of these, not as a broken link)
 *   - 404 page: an unknown path must answer 404 with the not-found page, which no
 *     link reaches, so the crawl alone would never check it
 *   - no horizontal scroll: at both widths, no page may be wider than the viewport
 *   - search metadata: every page has one title, one meta description and one
 *     canonical link to its own path on the site URL, none shared between pages
 *
 *   npm run build && npm run check:site
 *
 * External links are not fetched: third-party sites (LinkedIn especially) block
 * bots, which would make CI fail for reasons outside this repo.
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { measureOverflow, overflowProblem } from "./lib/overflow.mjs";
import { classifyConsole, isOwnNotFound } from "./lib/page-errors.mjs";
import { duplicateProblems, metaProblems, readPageMeta, siteUrlFrom } from "./lib/page-meta.mjs";

const PORT = Number(process.env.PORT ?? 3123);
const BASE = `http://127.0.0.1:${PORT}`;
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 375, height: 800 },
];

const NOT_FOUND_PATH = "/check-site-unknown-page";

const SITE_URL = siteUrlFrom(readFileSync(new URL("../src/data/site.ts", import.meta.url), "utf8"));
if (!SITE_URL) throw new Error("check-site: no `url` found in src/data/site.ts");

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

/** Serious or critical WCAG 2.1 A/AA violations on the loaded page. */
async function axeProblems(page, label) {
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  return axe.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => {
      const where = v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ");
      return `${label} a11y ${v.impact}: ${v.id} (${v.help}) at ${where}`;
    });
}

/**
 * Opens an unknown path: it must answer 404 (not a 200 soft-404) with the
 * not-found page, carry the CSP header, pass axe, log no errors other than its
 * own 404, and link back home.
 */
async function checkNotFound(vp) {
  const label = `${NOT_FOUND_PATH} [${vp.name}] 404 page`;
  const found = [];
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  const url = BASE + NOT_FOUND_PATH;
  page.on("console", (msg) => {
    const kind = classifyConsole(msg.type(), msg.text());
    if (kind === "csp") found.push(`${label}: CSP violation: ${msg.text()}`);
    else if (kind === "error" && !isOwnNotFound(msg.text(), msg.location().url, url)) {
      found.push(`${label}: console error: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => found.push(`${label}: uncaught: ${err.message}`));
  try {
    const res = await page.goto(url, { waitUntil: "networkidle" });
    if (res?.status() !== 404) found.push(`${label}: HTTP ${res?.status() ?? "no response"}, expected 404`);
    if (!res?.headers()["content-security-policy"]) found.push(`${label}: no Content-Security-Policy header`);
    const heading = await page.getByRole("heading", { level: 1 }).textContent();
    if (!heading?.includes("doesn’t exist")) found.push(`${label}: heading "${heading}" is not the not-found page`);
    if ((await page.locator('a[href="/"]').count()) === 0) found.push(`${label}: no link back to /`);
    const overflow = overflowProblem(await page.evaluate(measureOverflow));
    if (overflow) found.push(`${label}: ${overflow}`);
    found.push(...(await axeProblems(page, label)));
  } catch (err) {
    found.push(`${label}: ${String(err?.message ?? err).split("\n")[0]}`);
  } finally {
    await context.close();
  }
  return found;
}

/**
 * Clicks through the contact form on "/": an empty submit must show the errors and
 * move focus to the first field; a valid one, with /api/contact stubbed to answer
 * `unconfigured`, must reach "Message sent" with the mail-app notice. The stub
 * means no email can be sent, even where a provider key is set. Headless Chromium
 * has no mail app, so the form's mailto hand-off is a no-op there (checked: no
 * navigation, no console error).
 */
async function checkContactForm(vp) {
  const found = [];
  const fail = (msg) => found.push(`/ [${vp.name}] contact form: ${msg}`);
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  let posted = null;
  await page.route("**/api/contact", async (route) => {
    posted = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true, delivery: "unconfigured" } });
  });
  try {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Send Message" }) });
    const submit = form.getByRole("button", { name: "Send Message" });

    await submit.click();
    const alerts = await form.getByRole("alert").count();
    if (alerts < 7) fail(`empty submit showed ${alerts} error(s), expected 7`);
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
    if (focused !== "name") fail(`empty submit left focus on "${focused}", expected the name field`);
    if (posted) fail("empty submit reached /api/contact");

    await form.getByLabel("Your Name").fill("Check Site");
    await form.getByLabel("Email").fill("check@example.com");
    await form.getByLabel("Phone").fill("+251 900 000 000");
    await form.getByLabel("I’m Interested in").selectOption({ index: 1 });
    await form.getByLabel("Budget Range (USD)").selectOption({ index: 1 });
    await form.getByLabel("Country").fill("Ethiopia");
    await form.getByLabel("Your Message").fill("An automated check of the contact form.");
    await submit.click();

    const sent = page.getByRole("status").filter({ hasText: "Message sent" });
    await sent.waitFor({ timeout: 10_000 });
    if (!(await sent.textContent())?.includes("mail app")) fail("the sent state did not show the mail-app notice");
    if (new URL(page.url()).pathname !== "/") fail(`the mailto hand-off navigated to ${page.url()}`);
    if (!posted || posted.name !== "Check Site") fail("the valid submit did not post the form fields");
    if (posted && posted.company !== "") fail("the honeypot field was not posted empty");
  } catch (err) {
    fail(String(err?.message ?? err).split("\n")[0]);
  } finally {
    await context.close();
  }
  return found;
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
  const pageMeta = {};

  while (queue.length) {
    const pathname = queue.shift();
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const cspViolations = [];
      const pageErrors = [];
      page.on("console", (msg) => {
        const kind = classifyConsole(msg.type(), msg.text());
        if (kind === "csp") cspViolations.push(msg.text());
        else if (kind === "error") pageErrors.push(`console error: ${msg.text()}`);
      });
      page.on("pageerror", (err) => pageErrors.push(`uncaught: ${err.message}`));
      const res = await page.goto(BASE + pathname, { waitUntil: "networkidle" });
      if (!res || !res.ok()) {
        problems.push(`${pathname}: HTTP ${res?.status() ?? "no response"}`);
        await context.close();
        break;
      }

      if (!res.headers()["content-security-policy"]) problems.push(`${pathname}: no Content-Security-Policy header`);

      problems.push(...(await axeProblems(page, `${pathname} [${vp.name}]`)));

      const overflow = overflowProblem(await page.evaluate(measureOverflow));
      if (overflow) problems.push(`${pathname} [${vp.name}] ${overflow}`);

      if (vp.name === "desktop") {
        const meta = await page.evaluate(readPageMeta);
        pageMeta[pathname] = meta;
        for (const m of metaProblems(meta, pathname, SITE_URL)) problems.push(`${pathname}: ${m}`);

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
      for (const e of pageErrors) problems.push(`${pathname} [${vp.name}] ${e}`);
      await context.close();
    }
  }

  problems.push(...duplicateProblems(pageMeta));

  for (const vp of VIEWPORTS) problems.push(...(await checkContactForm(vp)));
  for (const vp of VIEWPORTS) problems.push(...(await checkNotFound(vp)));

  console.log(
    `check-site: ${seen.size} page(s), ${checkedAssets.size} asset(s) checked, contact form clicked, 404 page checked, no sideways scroll, titles, descriptions and canonicals checked`,
  );
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
console.log("check-site: all links resolve, no page errors and no serious accessibility violations");
