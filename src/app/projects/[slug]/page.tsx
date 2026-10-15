import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Check } from "@/components/icons";
import { StatusBadge } from "@/components/Portfolio";
import { Accent, Container, Eyebrow, Logo } from "@/components/ui";
import {
  formatDate,
  liveFacts,
  projectBySlug,
  projectPath,
  projects,
  type Project,
} from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

// Only the projects in data/projects.json exist; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  if (!project) return {};
  const title = `${project.name}: ${project.tagline}`;
  return {
    title,
    description: project.problem,
    alternates: { canonical: projectPath(project) },
    openGraph: { title, description: project.problem, url: projectPath(project) },
  };
}

/** Live facts read from the sync snapshot, never typed into projects.json. */
function repoFacts(project: Project) {
  const live = liveFacts(project);
  const rows: { label: string; value: string }[] = [
    { label: "Platform", value: project.platform },
  ];
  if (live.lastCommitAt) rows.push({ label: "Last commit", value: formatDate(live.lastCommitAt) });
  if (live.latestTag) rows.push({ label: "Latest tag", value: live.latestTag });
  if (live.ciPassing !== null) {
    const branch = live.defaultBranch ? ` on ${live.defaultBranch}` : "";
    const when = live.ciAt ? ` (${formatDate(live.ciAt)})` : "";
    rows.push({ label: "CI", value: `${live.ciPassing ? "Passing" : "Failing"}${branch}${when}` });
  }
  if (live.npmVersion) rows.push({ label: "npm", value: `v${live.npmVersion}` });
  return rows;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-bold tracking-[-0.4px] xl:text-[30px]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 font-sans text-base leading-[1.6] text-body xl:text-[17px]">
          <span className="mt-1 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
            <Check size={12} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

const prose = "font-sans text-base leading-[1.7] text-body xl:text-[17px]";

export default async function ProjectPage({ params }: Params) {
  const project = projectBySlug((await params).slug);
  if (!project) notFound();

  return (
    <>
      <header className="bg-surface-alt pb-14 pt-[18px] xl:pb-20">
        <Container>
          <Link href="/" aria-label="Alpha Guyasa — home" className="inline-block">
            <Logo />
          </Link>
          <Link
            href="/#projects"
            className="mt-10 flex w-fit items-center gap-2 font-sans text-base font-semibold text-accent hover:text-ink"
          >
            <ArrowRight size={16} className="rotate-180" />
            All projects
          </Link>
          <div className="mt-6">
            <StatusBadge status={project.status} />
          </div>
          <h1 className="mt-4 font-display text-[34px] font-bold leading-[1.15] tracking-[-0.8px] sm:text-[44px] xl:text-[58px] xl:tracking-[-1.4px]">
            {project.name} – <Accent>{project.tagline}</Accent>
          </h1>
          <p className="mt-4 max-w-[760px] font-sans text-base leading-[1.6] text-muted2 xl:text-[17px]">
            {project.statusNote}
          </p>
        </Container>
      </header>

      <main id="main" className="pb-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
          <div>
            {project.images.map((image) => (
              <figure key={image.src} className="mt-12">
                {/* Screenshots differ in shape: a fixed frame with object-contain avoids layout shift. */}
                <div className="relative aspect-[14/9] overflow-hidden rounded-2xl bg-surface-alt">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 800px"
                    className="object-contain"
                  />
                </div>
                <figcaption className="mt-2 font-sans text-sm text-muted">Source: {image.source}</figcaption>
              </figure>
            ))}

            <Section title="The problem">
              <p className={prose}>{project.problem}</p>
            </Section>
            <Section title="The approach">
              <p className={prose}>{project.approach}</p>
            </Section>
            {project.results.length > 0 && (
              <Section title="Results">
                <CheckList items={project.results} />
              </Section>
            )}
            {project.learned.length > 0 && (
              <Section title="What broke and what I learned">
                <CheckList items={project.learned} />
              </Section>
            )}
          </div>

          <aside className="lg:pt-12">
            <div className="rounded-3xl bg-surface-alt p-5.5 lg:sticky lg:top-6">
              <Eyebrow>From the repository</Eyebrow>
              <dl className="mt-4 rounded-[14px] bg-white px-5">
                {repoFacts(project).map((row, i, rows) => (
                  <div
                    key={row.label}
                    className={`flex flex-wrap justify-between gap-2 py-3.5 font-sans text-[15px] ${
                      i < rows.length - 1 ? "border-b border-hairline2" : ""
                    }`}
                  >
                    <dt>{row.label}</dt>
                    <dd className="text-muted">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <h2 className="mt-6 font-display text-lg font-bold">Stack</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li key={tech} className="rounded-[40px] bg-white px-3.5 py-1.5 font-sans text-sm ring-1 ring-hairline">
                    {tech}
                  </li>
                ))}
              </ul>
              <h2 className="mt-6 font-display text-lg font-bold">Links</h2>
              <ul className="mt-3 flex flex-col gap-2.5">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="border-b-[1.5px] border-accent font-sans text-base font-semibold text-accent transition-colors duration-200 hover:border-ink hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </main>

      <Footer basePath="/" />
    </>
  );
}
