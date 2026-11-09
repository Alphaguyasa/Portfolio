/**
 * Which repos the sync reads. Pure apart from the injected `gh` reader, so the
 * selection rules are unit-tested without the network.
 */

/**
 * The owner's public repos, plus config.extraPublicRepos, minus forks, archived,
 * private and skip-listed repos.
 *
 * Listing the owner's repos is the normal path: it also finds new repos. Some
 * environments (the scheduled cloud run) refuse that endpoint with 403 but can
 * read named repos, so on 403 the sync falls back to config.knownPublicRepos.
 * It then asks the search API for the owner's repos, only to log any public one
 * the config does not list yet: a repo found that way is never synced silently,
 * because adding a project to the site is a decision made in the config.
 *
 * @param {(path: string, opts?: object) => Promise<any>} gh
 * @param {object} config portfolio.config.json
 * @param {(message: string) => void} [log]
 * A repo that does not exist (404) is an error. One this token is refused (403) is
 * returned in `refused`, and the caller keeps its last saved details (carryOver), so
 * one out-of-reach repo cannot stop every other project from updating.
 */
export async function selectRepos(gh, config, log = () => {}) {
  const skip = new Set((config.skip ?? []).map((s) => s.toLowerCase()));
  let owned;
  let source = "listing";
  const refused = [];
  try {
    owned = await gh(`/users/${config.owner}/repos?type=owner&per_page=100`);
  } catch (err) {
    if (err?.status !== 403 || !(config.knownPublicRepos ?? []).length) throw err;
    source = "knownPublicRepos";
    log(
      `listing ${config.owner}'s repos was refused (403); reading the ${config.knownPublicRepos.length} repos in portfolio.config.json knownPublicRepos instead. New repos are not discovered this way.`,
    );
    const known = await readNamed(gh, config.knownPublicRepos);
    owned = known.repos;
    refused.push(...known.refused);
    await searchUnlisted(gh, config, log);
  }
  const extraRead = await readNamed(gh, config.extraPublicRepos ?? []);
  const extra = extraRead.repos;
  refused.push(...extraRead.refused);

  const seen = new Set();
  const repos = [...owned, ...extra].filter((r) => {
    const key = r.full_name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return !r.fork && !r.archived && !r.private && !skip.has(r.name.toLowerCase());
  });
  return { repos, source, refused };
}

/**
 * Public, non-fork, non-archived, non-skipped repos in `found` that neither
 * knownPublicRepos nor extraPublicRepos lists, as full names.
 */
export function unlistedRepos(found, config) {
  const skip = new Set((config.skip ?? []).map((s) => s.toLowerCase()));
  const listed = new Set(
    [...(config.knownPublicRepos ?? []), ...(config.extraPublicRepos ?? [])].map((r) => r.toLowerCase()),
  );
  return found
    .filter((r) => !r.fork && !r.archived && !r.private && !skip.has(r.name.toLowerCase()))
    .map((r) => r.full_name)
    .filter((full) => !listed.has(full.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

// Best effort: the search only informs, so any failure (the cloud run refuses
// this endpoint too) is logged and the sync goes on with the configured list.
async function searchUnlisted(gh, config, log) {
  let found;
  try {
    const res = await gh(`/search/repositories?q=${encodeURIComponent(`user:${config.owner} fork:false`)}&per_page=100`);
    found = res?.items ?? [];
  } catch (err) {
    log(`searching ${config.owner}'s repos failed too (${err?.status ?? err?.message ?? err}); new public repos still need adding to knownPublicRepos by hand.`);
    return;
  }
  for (const full of unlistedRepos(found, config)) {
    log(`found public repo ${full} that is not in portfolio.config.json knownPublicRepos; it was NOT synced. Add it to the config to include it.`);
  }
}

async function readNamed(gh, names) {
  const repos = [];
  const refused = [];
  const unreadable = [];
  for (const full of names) {
    try {
      const r = await gh(`/repos/${full}`, { allow404: true });
      if (r) repos.push(r);
      else unreadable.push(`${full} (404)`);
    } catch (err) {
      if (err?.status === 403) refused.push(full);
      else unreadable.push(`${full} (${err?.status ?? err?.message ?? err})`);
    }
  }
  if (unreadable.length) {
    const err = new Error(`cannot read: ${unreadable.join(", ")}`);
    err.unreadable = unreadable;
    throw err;
  }
  return { repos, refused };
}

/**
 * The saved snapshot entries for repos this token was refused, each marked with the
 * date its details are from. A refused repo with nothing saved is an error, because
 * it would silently drop a project.
 */
export function carryOver(previous, refused) {
  const saved = new Map((previous?.repos ?? []).map((r) => [r.fullName?.toLowerCase(), r]));
  const missing = refused.filter((full) => !saved.has(full.toLowerCase()));
  if (missing.length) throw new Error(`cannot read and nothing saved: ${missing.join(", ")}`);
  return refused.map((full) => {
    const entry = saved.get(full.toLowerCase());
    return { ...entry, carriedOverFrom: entry.carriedOverFrom ?? previous.syncedAt };
  });
}
