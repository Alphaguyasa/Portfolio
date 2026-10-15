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
 *
 * @param {(path: string, opts?: object) => Promise<any>} gh
 * @param {object} config portfolio.config.json
 * @param {(message: string) => void} [log]
 * Any repo that cannot be read is an error: a partial snapshot would silently
 * drop projects, so the caller keeps the previous snapshot instead.
 */
export async function selectRepos(gh, config, log = () => {}) {
  const skip = new Set((config.skip ?? []).map((s) => s.toLowerCase()));
  let owned;
  let source = "listing";
  try {
    owned = await gh(`/users/${config.owner}/repos?type=owner&per_page=100`);
  } catch (err) {
    if (err?.status !== 403 || !(config.knownPublicRepos ?? []).length) throw err;
    source = "knownPublicRepos";
    log(
      `listing ${config.owner}'s repos was refused (403); reading the ${config.knownPublicRepos.length} repos in portfolio.config.json knownPublicRepos instead. New repos are not discovered this way.`,
    );
    owned = await readNamed(gh, config.knownPublicRepos);
  }
  const extra = await readNamed(gh, config.extraPublicRepos ?? []);

  const seen = new Set();
  const repos = [...owned, ...extra].filter((r) => {
    const key = r.full_name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return !r.fork && !r.archived && !r.private && !skip.has(r.name.toLowerCase());
  });
  return { repos, source };
}

async function readNamed(gh, names) {
  const repos = [];
  const unreadable = [];
  for (const full of names) {
    try {
      const r = await gh(`/repos/${full}`, { allow404: true });
      if (r) repos.push(r);
      else unreadable.push(`${full} (404)`);
    } catch (err) {
      unreadable.push(`${full} (${err?.status ?? err?.message ?? err})`);
    }
  }
  if (unreadable.length) {
    const err = new Error(`cannot read: ${unreadable.join(", ")}`);
    err.unreadable = unreadable;
    throw err;
  }
  return repos;
}
