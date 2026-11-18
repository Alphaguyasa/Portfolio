import { describe, expect, it } from "vitest";
import { isDependabotJobName, summariseCi, withoutDependabot } from "../scripts/lib/ci.mjs";

let id = 0;
const run = (
  name: string,
  sha: string,
  conclusion: string | null,
  extra: Record<string, unknown> = {},
) => ({
  name,
  workflow_id: name.length,
  head_sha: sha,
  status: conclusion === null ? "in_progress" : "completed",
  conclusion,
  created_at: `2026-11-02T0${(id++ % 9) + 1}:00:00Z`,
  ...extra,
});

describe("summariseCi", () => {
  it("is null with no runs", () => {
    expect(summariseCi([])).toBeNull();
    expect(summariseCi(undefined as never)).toBeNull();
  });

  it("tag job green, build red on the same commit is failing", () => {
    const ci = summariseCi([run("Release tag", "b", "success"), run("Android CI", "b", "failure")]);
    expect(ci).toMatchObject({ conclusion: "failure", failing: ["Android CI"], headSha: "b" });
    expect(ci?.workflows).toEqual(["Android CI", "Release tag"]);
    expect(ci?.workflow).toBe("Android CI, Release tag");
  });

  it("is passing only when every run on the commit passed", () => {
    const ci = summariseCi([run("deploy", "b", "success"), run("ci", "b", "success"), run("ci", "a", "failure")]);
    expect(ci).toMatchObject({ conclusion: "success", failing: [], headSha: "b", status: "completed" });
  });

  it("ignores cancelled and skipped runs, falling back to an older commit", () => {
    const ci = summariseCi([
      run("CI", "c", "cancelled"),
      run("deploy", "c", "skipped"),
      run("CI", "b", "success"),
    ]);
    expect(ci).toMatchObject({ conclusion: "success", headSha: "b", workflows: ["CI"] });
  });

  it("skips a commit that is still running for the newest settled one", () => {
    const ci = summariseCi([run("ci", "c", null), run("ci", "b", "failure")]);
    expect(ci).toMatchObject({ conclusion: "failure", headSha: "b" });
  });

  it("a failure settles the commit even while another run is going", () => {
    const ci = summariseCi([run("deploy", "c", null), run("ci", "c", "failure"), run("ci", "b", "success")]);
    expect(ci).toMatchObject({ conclusion: "failure", headSha: "c", failing: ["ci"] });
  });

  it("counts only the newest run of a workflow on one commit", () => {
    const ci = summariseCi([
      run("ci", "b", "success", { created_at: "2026-11-02T09:00:00Z" }),
      run("ci", "b", "failure", { created_at: "2026-11-02T08:00:00Z" }),
    ]);
    expect(ci).toMatchObject({ conclusion: "success", at: "2026-11-02T09:00:00Z" });
  });

  it("treats timed_out and startup_failure as failing", () => {
    expect(summariseCi([run("ci", "b", "timed_out")])?.conclusion).toBe("failure");
    expect(summariseCi([run("ci", "b", "startup_failure")])?.conclusion).toBe("failure");
  });

  it("is null when nothing has settled", () => {
    expect(summariseCi([run("ci", "b", null), run("ci", "a", "cancelled")])).toBeNull();
  });

  it("ignores Dependabot's update jobs, which say nothing about the code", () => {
    const dependabot = { path: "dynamic/dependabot/dependabot-updates" };
    const ci = summariseCi([
      run("npm_and_yarn in /. - Update #1685258065", "b", "failure", dependabot),
      run("CI", "b", "success", { path: ".github/workflows/ci.yml" }),
    ]);
    expect(ci).toMatchObject({ conclusion: "success", failing: [], workflows: ["CI"], headSha: "b" });
  });

  it("still counts other GitHub-managed runs, such as CodeQL default setup", () => {
    const ci = summariseCi([
      run("CodeQL", "b", "failure", { path: "dynamic/github-code-scanning/codeql" }),
      run("CI", "b", "success"),
    ]);
    expect(ci).toMatchObject({ conclusion: "failure", failing: ["CodeQL"] });
  });

  it("a commit with only a Dependabot job falls back to the older build", () => {
    const ci = summariseCi([
      run("pip in /. - Update #1", "b", "failure", { path: "dynamic/dependabot/dependabot-updates" }),
      run("CI", "a", "success"),
    ]);
    expect(ci).toMatchObject({ conclusion: "success", headSha: "a" });
  });
});

describe("withoutDependabot", () => {
  const base = { status: "completed", at: "2026-11-06T00:00:00Z", headSha: "b" };

  it("recognises Dependabot's job names and nothing else", () => {
    expect(isDependabotJobName("npm_and_yarn in /. - Update #1685258065")).toBe(true);
    expect(isDependabotJobName("github_actions in /. - Update #1684918551")).toBe(true);
    expect(isDependabotJobName("gradle in / for com.google.devtools.ksp - Update #1688197104")).toBe(true);
    expect(isDependabotJobName("gradle in / for gradle-wrapper, androidx.core:core-ktx, androidx.wo...")).toBe(true);
    for (const name of ["CI", "Android CI", "Release tag", "deploy-not-alone", "CodeQL"]) {
      expect(isDependabotJobName(name)).toBe(false);
    }
  });

  it("is null when only Dependabot ran on the commit", () => {
    const only = { ...base, workflow: "x", workflows: ["npm_and_yarn in /. - Update #1"], failing: ["npm_and_yarn in /. - Update #1"], conclusion: "failure" };
    expect(withoutDependabot(only)).toBeNull();
    expect(withoutDependabot(null)).toBeNull();
  });

  it("passes when only a Dependabot job had failed", () => {
    const ci = withoutDependabot({ ...base, workflow: "x", workflows: ["CI", "pip in / - Update #2"], failing: ["pip in / - Update #2"], conclusion: "failure" });
    expect(ci).toMatchObject({ conclusion: "success", failing: [], workflows: ["CI"], workflow: "CI" });
  });

  it("keeps a real failure failing", () => {
    const ci = withoutDependabot({ ...base, workflow: "x", workflows: ["ci", "deploy", "pip in / - Update #2"], failing: ["deploy", "pip in / - Update #2"], conclusion: "failure" });
    expect(ci).toMatchObject({ conclusion: "failure", failing: ["deploy"], workflows: ["ci", "deploy"] });
  });
});
