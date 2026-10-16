/**
 * Screenshots copied from a project's own public repo. A project image with
 * `from: { repo, path }` is fetched read-only from raw.githubusercontent.com by
 * scripts/fetch-screenshots.mjs and served from a path derived from `from`, so the
 * file on the site can always be traced back to the file in the repo.
 */

export const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;

/** Where a fetched screenshot lives under public/. */
export function screenshotSrc(slug, from) {
  const base = from.path.split("/").pop().replace(IMAGE_EXT, "");
  return `/assets/projects/${slug}/${base}.webp`;
}

export function rawUrl(from) {
  const path = from.path.split("/").map(encodeURIComponent).join("/");
  return `https://raw.githubusercontent.com/${from.repo}/HEAD/${path}`;
}

/** Problems with one image's `from`; empty when it may be fetched and shown. */
export function checkFrom(project, img) {
  const { from } = img;
  if (!from) return [];
  const errors = [];
  if (from.repo !== project.repo) errors.push(`from.repo "${from.repo}" is not this project's repo "${project.repo}"`);
  if (typeof from.path !== "string" || !IMAGE_EXT.test(from.path)) {
    errors.push("from.path must be a .png, .jpg or .webp file");
  } else {
    if (from.path.startsWith("/") || from.path.split("/").includes("..")) errors.push("from.path must be relative to the repo root");
    if (img.src !== screenshotSrc(project.slug, from)) errors.push(`src must be ${screenshotSrc(project.slug, from)}`);
    if (!img.source?.includes(from.path)) errors.push(`source must name ${from.path}`);
  }
  return errors;
}

/** Everything the fetch script has to download, for all projects. */
export function screenshotPlan(data) {
  return data.projects.flatMap((project) =>
    project.images
      .filter((img) => img.from)
      .map((img) => ({ slug: project.slug, src: img.src, url: rawUrl(img.from), errors: checkFrom(project, img) })),
  );
}
