import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowRight } from "@/components/icons";
import { StatusBadge } from "@/components/Portfolio";
import { Accent, Container, Eyebrow, Logo } from "@/components/ui";
import { aboutPage } from "@/data/site";
import { formatDate, methodEvidence, projectPath, projects, syncedAt, type Project } from "@/lib/projects";

const description =
  "Alpha Guyasa, full-stack and Android developer in Addis Ababa: what he builds and how, with context files, planned prompts, verified AI-assisted work and CI.";

export const metadata: Metadata = {
  title: "About and how I work",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About Alpha Guyasa and how he works", description, url: "/about" },
};

const prose = "font-sans text-base leading-[1.7] text-body xl:text-[17px]";

function ProjectList({ items }: { items: Project[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map((project) => (
        <li key={project.slug}>
          <Link
            href={projectPath(project)}
            className="block rounded-[40px] bg-white px-3.5 py-1.5 font-sans text-sm font-medium ring-1 ring-hairline transition-colors duration-200 hover:text-accent"
          >
            {project.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  const evidence = methodEvidence();

  return (
    <>
      <header className="bg-surface-alt pb-14 pt-[18px] xl:pb-20">
        <Container>
          <Link href="/" aria-label="Alpha Guyasa — home" className="inline-block">
            <Logo />
          </Link>
          <Link
            href="/#about"
            className="mt-10 flex w-fit items-center gap-2 font-sans text-base font-semibold text-accent hover:text-ink"
          >
            <ArrowRight size={16} className="rotate-180" />
            Back to home
          </Link>
          <h1 className="mt-6 font-display text-[34px] font-bold leading-[1.15] tracking-[-0.8px] sm:text-[44px] xl:text-[58px] xl:tracking-[-1.4px]">
            About me and <Accent>how I work</Accent>
          </h1>
          <div className="mt-4 flex max-w-[760px] flex-col gap-3">
            {aboutPage.intro.map((paragraph) => (
              <p key={paragraph} className="font-sans text-base leading-[1.6] text-muted2 xl:text-[17px]">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </header>

      <main id="main" className="pb-20">
        <Container>
          <section className="mt-12" aria-labelledby="what-i-build">
            <h2 id="what-i-build" className="font-display text-2xl font-bold tracking-[-0.4px] xl:text-[30px]">
              What I build
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={projectPath(project)}
                    className="flex h-full flex-col items-start gap-2.5 rounded-3xl bg-surface-alt p-5.5 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <StatusBadge status={project.status} />
                    <span className="font-display text-lg font-bold">{project.name}</span>
                    <span className="font-sans text-[15px] leading-[1.5] text-muted">{project.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="how-i-work">
            <h2 id="how-i-work" className="font-display text-2xl font-bold tracking-[-0.4px] xl:text-[30px]">
              How I work
            </h2>
            <ol className="mt-5 grid gap-4 lg:grid-cols-2">
              {aboutPage.method.map((step, i) => (
                <li key={step.title} className="flex gap-4 rounded-3xl bg-surface-alt p-5.5">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent font-display text-lg font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{step.title}</h3>
                    <p className={`mt-1.5 ${prose}`}>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14" aria-labelledby="evidence">
            <h2 id="evidence" className="font-display text-2xl font-bold tracking-[-0.4px] xl:text-[30px]">
              The evidence, from the repos
            </h2>
            <p className={`mt-4 max-w-[760px] ${prose}`}>
              Counted from the GitHub sync of {formatDate(syncedAt)}, not typed in.
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl bg-surface-alt p-5.5">
                <Eyebrow>Context files</Eyebrow>
                <p className="mt-3 font-sans text-base xl:text-[17px]">
                  <strong className="font-display text-3xl font-bold">{evidence.withContext.length}</strong> of{" "}
                  {evidence.total} listed projects carry a CLAUDE.md
                </p>
                <ProjectList items={evidence.withContext} />
              </div>
              <div className="rounded-3xl bg-surface-alt p-5.5">
                <Eyebrow>Continuous integration</Eyebrow>
                <p className="mt-3 font-sans text-base xl:text-[17px]">
                  <strong className="font-display text-3xl font-bold">{evidence.withCi.length}</strong> of{" "}
                  {evidence.total} listed projects have CI on GitHub Actions
                </p>
                <ProjectList items={evidence.withCi} />
              </div>
            </div>
          </section>

          <section className="mt-14" aria-labelledby="this-site">
            <h2 id="this-site" className="font-display text-2xl font-bold tracking-[-0.4px] xl:text-[30px]">
              A worked example: this site
            </h2>
            <p className={`mt-4 max-w-[760px] ${prose}`}>{aboutPage.thisSite}</p>
          </section>
        </Container>
      </main>
      <Footer basePath="/" />
    </>
  );
}
