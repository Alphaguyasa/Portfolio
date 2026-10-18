/**
 * Typed access to data/projects.json (claims, checked by verify-facts) and
 * data/sync/index.json (live repo facts). Components read projects only through here.
 */
import projectsData from "../../data/projects.json";
import syncData from "../../data/sync/index.json";

export type Status = "idea" | "building" | "shipped" | "maintained" | "completed" | "paused";

export type ProjectImage = {
  src: string;
  alt: string;
  source: string;
  /** Set when the file was copied from the repo by scripts/fetch-screenshots.mjs. */
  from?: { repo: string; path: string };
  /** Phone screenshots are shown side by side in a grid on the project page. */
  shape?: "phone";
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  repo: string;
  status: Status;
  statusNote: string;
  featured: boolean;
  platform: string;
  stack: string[];
  problem: string;
  approach: string;
  results: string[];
  learned: string[];
  images: ProjectImage[];
  links: { label: string; href: string }[];
  facts: { path: string; quote: string }[];
  /** "Alpha, YYYY-MM-DD": required for statuses a repo cannot show, such as completed. */
  statusConfirmed?: string;
};

type SyncRepo = {
  name: string;
  fullName: string;
  url?: string;
  private: boolean;
  defaultBranch?: string;
  lastCommitAt?: string | null;
  latestRelease?: { tag: string; publishedAt: string } | null;
  tags?: string[];
  ci?: { workflow: string; status: string; conclusion: string | null; at: string } | null;
  npm?: { name: string; latest: string | null; publishedAt: string | null } | null;
  rootFiles?: string[];
};

export const projects = projectsData.projects as Project[];
const repos = syncData.repos as SyncRepo[];
export const syncedAt: string = syncData.syncedAt;

export const STATUS_LABEL: Record<Status, string> = {
  idea: "Idea",
  building: "In development",
  shipped: "Shipped",
  maintained: "Maintained",
  completed: "Completed",
  paused: "Paused",
};

export type LiveFacts = {
  lastCommitAt: string | null;
  latestTag: string | null;
  ciPassing: boolean | null;
  ciAt: string | null;
  defaultBranch: string | null;
  npmVersion: string | null;
};

export function liveFacts(project: Project): LiveFacts {
  const repo = repos.find((r) => r.fullName === project.repo);
  return {
    lastCommitAt: repo?.lastCommitAt ?? null,
    latestTag: repo?.latestRelease?.tag ?? repo?.tags?.[0] ?? null,
    ciPassing: repo?.ci ? repo.ci.conclusion === "success" : null,
    ciAt: repo?.ci?.at ?? null,
    defaultBranch: repo?.defaultBranch ?? null,
    npmVersion: repo?.npm?.latest ?? null,
  };
}

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectPath(project: Project): string {
  return `/projects/${project.slug}`;
}

/** "14 Oct 2026", in UTC so the build machine's timezone cannot shift the day. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Counts shown on the page, derived from the data rather than typed in. */
export function portfolioStats() {
  const owner = syncData.owner;
  return {
    shipped: projects.filter((p) => p.status === "shipped" || p.status === "maintained").length,
    inDevelopment: projects.filter((p) => p.status === "building").length,
    publicRepos: repos.filter((r) => !r.private && r.fullName.startsWith(`${owner}/`)).length,
  };
}

/**
 * Evidence for the development method, read from the sync: which listed projects
 * keep a written roadmap (ROADMAP.md) and which have CI. Mirrors methodEvidence in
 * scripts/lib/copy.mjs, so the site and PORTFOLIO_COPY.md give the same counts.
 */
export function methodEvidence() {
  const listed = projects
    .map((project) => ({ project, repo: repos.find((r) => r.fullName === project.repo) }))
    .filter((entry): entry is { project: Project; repo: SyncRepo } => Boolean(entry.repo));
  return {
    total: listed.length,
    withRoadmap: listed.filter(({ repo }) => (repo.rootFiles ?? []).includes("ROADMAP.md")).map(({ project }) => project),
    withCi: listed.filter(({ repo }) => repo.ci).map(({ project }) => project),
  };
}
