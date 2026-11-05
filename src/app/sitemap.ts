import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { liveFacts, projectPath, projects, syncedAt } from "@/lib/projects";

/**
 * lastModified is a real change date, not the build time: with new Date() every deploy
 * told crawlers that every page had changed. A project page changes with its repo, so it
 * takes the synced last commit; / and /about are rebuilt from each sync, so they take
 * syncedAt (also the fallback when a repo has no commit date).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: syncedAt,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/about`,
      lastModified: syncedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: `${site.url}${projectPath(project)}`,
      lastModified: liveFacts(project).lastCommitAt ?? syncedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
