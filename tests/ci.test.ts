import { describe, expect, it } from "vitest";
import { summariseCi } from "../scripts/lib/ci.mjs";

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
});
