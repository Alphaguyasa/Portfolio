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
 */

const IGNORED = new Set(["cancelled", "skipped"]);

/**
 * @param {Array<{ name: string, workflow_id?: number, head_sha: string, status: string,
 *   conclusion: string | null, created_at: string }>} runs newest first, as the API lists them
 * @returns {{ workflow: string, workflows: string[], failing: string[], status: "completed",
 *   conclusion: string, at: string, headSha: string } | null}
 */
export function summariseCi(runs) {
  const order = [];
  const bySha = new Map();
  for (const run of runs ?? []) {
    if (!run?.head_sha) continue;
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
