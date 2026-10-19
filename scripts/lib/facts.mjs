/**
 * Honesty checks for data/projects.json against the GitHub sync snapshot.
 * Pure functions: callers pass the parsed data and a doc reader, so the same
 * rules run in CI (scripts/verify-facts.mjs) and in the unit tests.
 */

import { checkFrom } from "./screenshots.mjs";

export const STATUSES = ["idea", "building", "shipped", "maintained", "completed", "paused"];

/**
 * Cover images from the design handoff that are illustrations, not product
 * screenshots. They must never be presented as a project's screens. The files
 * were deleted from public/assets (ROADMAP item 9); the list stays so that
 * copying them back from the handoff bundle still fails verify-facts.
 */
export const STAND_IN_IMAGES = [
  "/assets/proj-suq.png",
  "/assets/proj-docsearch.png",
  "/assets/proj-scanner.png",
  "/assets/proj-hunews.png",
  "/assets/proj-alphacoin.png",
  "/assets/proj-nullchat.png",
  "/assets/note-sync.png",
  "/assets/note-sms.png",
  "/assets/note-eval.png",
];

const SHAPES = ["phone"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Collapse whitespace and drop markdown emphasis so prose quotes match the source. */
export function normalize(text) {
  return text
    .replace(/[*`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every number written in a piece of text, e.g. "375", "3.07", "100.00", "1,190". */
export function numbersIn(text) {
  return (text.match(/\d+(?:[.,]\d+)*/g) ?? []).map((n) => n.replace(/,/g, ""));
}

/** Years and "since <Month> <Year>" are checked separately against synced dates. */
function isYear(n) {
  return /^20\d\d$/.test(n);
}

/** All prose fields of a project that a reader sees. */
export function proseOf(project) {
  return [
    ["tagline", project.tagline],
    ["statusNote", project.statusNote],
    ["problem", project.problem],
    ["approach", project.approach],
    ["platform", project.platform],
    ...project.stack.map((s, i) => [`stack[${i}]`, s]),
    ...project.results.map((s, i) => [`results[${i}]`, s]),
    ...project.learned.map((s, i) => [`learned[${i}]`, s]),
    ...project.images.map((img, i) => [`images[${i}].alt`, img.alt]),
  ].filter(([, v]) => typeof v === "string");
}

/**
 * @param {{projects: any[]}} data      parsed data/projects.json
 * @param {{repos: any[]}} sync         parsed data/sync/index.json
 * @param {(repo: string, path: string) => string | null} readDoc
 * @param {(publicPath: string) => boolean} assetExists
 * @returns {string[]} problems; empty means every claim is backed
 */
export function verifyProjects(data, sync, readDoc, assetExists) {
  const errors = [];
  const repos = new Map(sync.repos.map((r) => [r.fullName, r]));
  const slugs = new Set();

  for (const p of data.projects) {
    const at = `projects/${p.slug ?? "?"}`;
    const fail = (msg) => errors.push(`${at}: ${msg}`);

    if (!p.slug || !/^[a-z0-9-]+$/.test(p.slug)) fail("slug must be lowercase letters, digits and dashes");
    if (slugs.has(p.slug)) fail("duplicate slug");
    slugs.add(p.slug);
    if (!STATUSES.includes(p.status)) fail(`status "${p.status}" is not one of ${STATUSES.join(", ")}`);

    const repo = repos.get(p.repo);
    if (!repo) {
      fail(`repo "${p.repo}" is not in the sync snapshot (private, skipped, renamed or missing)`);
      continue;
    }
    if (repo.private) fail(`repo "${p.repo}" is private; only its config publicSummary may be shown`);

    // Every quote must exist verbatim in the synced source.
    const quotes = [];
    for (const [i, fact] of (p.facts ?? []).entries()) {
      const source =
        fact.path === "@description" ? repo.description : readDoc(p.repo, fact.path);
      if (source == null) {
        fail(`facts[${i}] cites ${fact.path}, which is not in the sync snapshot`);
        continue;
      }
      if (!normalize(source).includes(normalize(fact.quote))) {
        fail(`facts[${i}] quote not found in ${p.repo}/${fact.path}: "${fact.quote}"`);
        continue;
      }
      quotes.push(normalize(fact.quote));
    }

    // Every number a reader sees must come from a verified quote.
    const backed = new Set(quotes.flatMap(numbersIn));
    for (const [field, text] of proseOf(p)) {
      for (const n of numbersIn(text)) {
        if (isYear(n)) continue;
        if (!backed.has(n)) fail(`${field} states "${n}", which no verified fact quotes`);
      }
      for (const m of text.matchAll(/since (\w+) (20\d\d)/g)) {
        const month = MONTHS.indexOf(m[1]);
        const last = repo.lastCommitAt ? new Date(repo.lastCommitAt) : null;
        if (
          month < 0 ||
          !last ||
          last.getUTCFullYear() !== Number(m[2]) ||
          last.getUTCMonth() !== month
        ) {
          fail(`${field} says "since ${m[1]} ${m[2]}" but the last commit is ${repo.lastCommitAt}`);
        }
      }
    }

    // Shipped means there is a published artifact the sync can see.
    if (p.status === "shipped" || p.status === "maintained") {
      const evidence =
        repo.latestRelease || repo.npm?.latest || quotes.some((q) => /release apk|signed production build/i.test(q));
      if (!evidence) fail(`status "${p.status}" needs a release, an npm version or a documented release build`);
    }

    // "Completed" cannot be seen in a repo, so it needs Alpha's dated confirmation.
    if (p.status === "completed" && !/^Alpha, \d{4}-\d{2}-\d{2}$/.test(p.statusConfirmed ?? "")) {
      fail('status "completed" needs statusConfirmed: "Alpha, YYYY-MM-DD"');
    }

    // Only real screenshots, each with a stated source.
    for (const [i, img] of p.images.entries()) {
      if (STAND_IN_IMAGES.includes(img.src)) fail(`images[${i}] ${img.src} is a stand-in illustration, not a screenshot`);
      if (!img.source) fail(`images[${i}] needs a "source" saying where the screenshot came from`);
      if (!img.alt) fail(`images[${i}] needs alt text`);
      if (!assetExists(img.src)) fail(`images[${i}] ${img.src} does not exist in public/`);
      if (img.shape !== undefined && !SHAPES.includes(img.shape)) fail(`images[${i}] shape must be one of ${SHAPES.join(", ")}`);
      for (const problem of checkFrom(p, img)) fail(`images[${i}] ${problem}`);
    }

    for (const [i, link] of p.links.entries()) {
      if (!/^https:\/\//.test(link.href)) fail(`links[${i}] must be an https URL`);
    }
  }

  return errors;
}
