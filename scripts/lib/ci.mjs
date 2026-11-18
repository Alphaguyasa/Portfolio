/**
 * A repo's CI status from its workflow runs on the default branch. Pure, so the
 * rules are unit-tested without the network.
 *
 * The newest run of *any* workflow is not the build: on some repos it is a tagging
 * or deploy job, so a red build could show as passing. Instead this looks at every
 * run on one head commit and reports the safer claim: failing if any run failed,
 * passing only if all of them passed.
 *
 * Which commit: the newest one whose result is settled. Cancelled and skipped runs
 * say nothing about the code (a newer push cancels them), so they are ignored. A
 * commit whose runs are still going is skipped for an older settled one, because
 * "in progress" would otherwise read as failing on the site; a run that has already
 * failed settles the commit as failing even while others still run.
 *
 * Dependabot's own update jobs ("npm_and_yarn in /. - Update #...") also run on the
 * default branch. They report whether Dependabot could open a pull request, not
 * whether the code builds, so they are not counted; their pull requests run the real
 * CI on their own branches. Other GitHub-managed runs (CodeQL default setup) do check
 * the code and still count.
 */

const IGNORED = new Set(["cancelled", "skipped"]);

/** Dependabot's update job: GitHub-managed, and it says nothing about the code. */
export function isDependabotUpdate(run) {
  return String(run?.path ?? "").startsWith("dynamic/dependabot/");
}

/**
 * @param {Array<{ name: string, workflow_id?: number, head_sha: string, status: string,
 *   conclusion: string | null, created_at: string, path?: string }>} runs newest first, as the API lists them
 * @returns {{ workflow: string, workflows: string[], failing: string[], status: "completed",
 *   conclusion: string, at: string, headSha: string } | null}
 */
export function summariseCi(runs) {
  const order = [];
  const bySha = new Map();
  for (const run of runs ?? []) {
    if (!run?.head_sha || isDependabotUpdate(run)) continue;
    if (!bySha.has(run.head_sha)) {
      bySha.set(run.head_sha, []);
      order.push(run.head_sha);
    }
    bySha.get(run.head_sha).push(run);
  }

  for (const sha of order) {
    // A workflow can run more than once on one commit; its newest run counts.
    const latest = new Map();
    for (const run of bySha.get(sha)) {
      if (run.status === "completed" && IGNORED.has(run.conclusion)) continue;
      const key = run.workflow_id ?? run.name;
      const seen = latest.get(key);
      if (!seen || run.created_at > seen.created_at) latest.set(key, run);
    }
    const relevant = [...latest.values()];
    if (!relevant.length) continue;

    const done = relevant.filter((r) => r.status === "completed");
    const failed = done.filter((r) => r.conclusion !== "success" && r.conclusion !== "neutral");
    if (!failed.length && done.length < relevant.length) continue;

    let conclusion = "success";
    if (failed.length) conclusion = "failure";
    else if (done.some((r) => r.conclusion !== "success")) conclusion = "neutral";

    const names = (list) => [...new Set(list.map((r) => r.name))].sort();
    const workflows = names(relevant);
    return {
      workflow: workflows.join(", "),
      workflows,
      failing: names(failed),
      status: "completed",
      conclusion,
      at: relevant.map((r) => r.created_at).sort().at(-1),
      headSha: sha,
    };
  }
  return null;
}

/**
 * Dependabot names its update jobs "<ecosystem> in <dir> [for <deps>] - Update #<n>";
 * GitHub cuts a long dependency list short with "...", dropping the "- Update" part.
 */
const DEPENDABOT_JOB = /^\S+ in \S+( for .+)? - Update #\d+$|^\S+ in \S+ for .+(\.\.\.|…)$/;

export function isDependabotJobName(name) {
  return DEPENDABOT_JOB.test(name);
}

/**
 * A saved CI summary without Dependabot's update jobs, for snapshots taken before
 * summariseCi ignored them (only the job names were saved, so the name is the test).
 * Null when nothing else ran on that commit: the snapshot then has no build result.
 * When only Dependabot jobs had failed, every other run on the commit passed.
 *
 * @param {{ workflow: string, workflows?: string[], failing?: string[], conclusion: string | null } | null | undefined} ci
 */
export function withoutDependabot(ci) {
  if (!ci) return null;
  const workflows = (ci.workflows ?? [ci.workflow]).filter((n) => !isDependabotJobName(n));
  if (!workflows.length) return null;
  const failing = (ci.failing ?? []).filter((n) => !isDependabotJobName(n));
  const droppedOnlyDependabot = (ci.failing ?? []).length > 0 && failing.length === 0;
  return {
    ...ci,
    workflow: workflows.join(", "),
    workflows,
    failing,
    conclusion: failing.length ? "failure" : droppedOnlyDependabot ? "success" : ci.conclusion,
  };
}
