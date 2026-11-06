/**
 * schema.org JSON-LD for search engines. Every value is read from data the page
 * already shows (site.ts, projects.json, the sync snapshot), so structured data can
 * never claim more than the visible page does. tests/structured-data.test.tsx checks
 * each value against the rendered page.
 */
import syncData from "../../data/sync/index.json";
import { site } from "@/data/site";
import { liveFacts, projectPath, type Project } from "@/lib/projects";

export const personName = "Alpha Guyasa";
/** As the footer, on every page, words it ("Full stack engineer in Addis Ababa"). */
export const personJobTitle = "Full stack engineer";

/**
 * For `/` and `/about`. The email is the public one in site.ts that the footer links
 * to; the profiles are the footer's social links.
 */
export function personJsonLd() {
  const [locality, country] = site.location.split(", ");
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personName,
    jobTitle: personJobTitle,
    email: `mailto:${site.email}`,
    url: site.url,
    address: { "@type": "PostalAddress", addressLocality: locality, addressCountry: country },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Haramaya University" },
    sameAs: [site.linkedin, site.github, site.leetcode],
  };
}

const syncedLanguages = new Map(
  (syncData.repos as { fullName: string; languages?: string[] }[]).map((r) => [r.fullName, r.languages ?? []]),
);

/**
 * Languages GitHub reports for the repo that the page also lists in its stack. A
 * language only GitHub sees (a build script, a generated file) is left out.
 */
export function projectLanguages(project: Project): string[] {
  return (syncedLanguages.get(project.repo) ?? []).filter((lang) => project.stack.includes(lang));
}

/** The repo link the page shows, if it shows one. */
export function projectRepoUrl(project: Project): string | undefined {
  const repoUrl = `https://github.com/${project.repo}`.toLowerCase();
  return project.links.find((link) => link.href.toLowerCase() === repoUrl)?.href;
}

export function projectJsonLd(project: Project) {
  const languages = projectLanguages(project);
  const repoUrl = projectRepoUrl(project);
  const { lastCommitAt } = liveFacts(project);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.problem,
    url: `${site.url}${projectPath(project)}`,
    ...(repoUrl ? { codeRepository: repoUrl } : {}),
    ...(languages.length ? { programmingLanguage: languages } : {}),
    ...(lastCommitAt ? { dateModified: lastCommitAt } : {}),
    author: { "@type": "Person", name: personName, url: site.url },
  };
}

/**
 * JSON for a `<script type="application/ld+json">`. `<` is escaped so no value can
 * close the script tag; the browser never runs this type, so the CSP is unaffected.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
