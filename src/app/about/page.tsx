import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowRight } from "@/components/icons";
import JsonLd from "@/components/JsonLd";
import { StatusBadge } from "@/components/Portfolio";
import { Accent, Container, Eyebrow, Logo } from "@/components/ui";
import { aboutPage } from "@/data/site";
import { personJsonLd } from "@/lib/structured-data";
import { ciWall, formatDate, methodEvidence, projectPath, projects, syncedAt, type Project } from "@/lib/projects";

const description =
  "Alpha Guyasa, full-stack and Android developer in Addis Ababa: what he builds and how: written plans, documented rules, tested changes and CI.";

export const metadata: Metadata = {
  title: "About and how I work",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Alpha Guyasa and how he works",
    description,
    url: "/about",
    // An openGraph object on a page replaces the root one, and with it the root image.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Alpha Guyasa · Full Stack Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Alpha Guyasa and how he works",
    description,
    images: [{ url: "/opengraph-image", alt: "Alpha Guyasa · Full Stack Engineer" }],
  },
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

function CiWall() {
  const rows = ciWall();
  const failing = rows.filter((row) => row.state === "failing").length;
  const known = rows.filter((row) => row.state !== "unknown").length;
  const label = { passing: "Passing", failing: "Failing", unknown: "No result" };
  return (
    <section className="mt-14" aria-labelledby="ci-wall">
      <h2 id="ci-wall" className="font-display text-2xl font-bold tracking-[-0.4px] xl:text-[30px]">
        Every build, as it stands
      </h2>
      <p className={`mt-4 max-w-[760px] ${prose}`}>
        The newest settled CI result on each repo&apos;s default branch, from the same sync.{" "}
        {failing ? `Failing: ${failing} of ${known}, listed first.` : `All ${known} with a result are passing.`}
        {known < rows.length &&
          ` ${rows.length - known} had only dependency-update jobs on their newest commit in the sync, so no build result is shown for them.`}
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <li
            key={row.project.slug}
            data-ci={row.state}
            className={`flex flex-col gap-1.5 rounded-2xl bg-surface-alt p-4 ring-1 ${row.state === "failing" ? "ring-accent" : "ring-hairline"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <Link href={projectPath(row.project)} className="font-display text-base font-bold hover:text-accent">
                {row.project.name}
              </Link>
              <span
                className={`shrink-0 rounded-[40px] px-3 py-1 font-sans text-[13px] font-semibold ${
                  row.state === "passing"
                    ? "bg-ink text-white"
                    : row.state === "failing"
                      ? "bg-accent text-white"
                      : "bg-white text-muted ring-1 ring-hairline"
                }`}
              >
                {label[row.state]}
              </span>
            </div>
            <p className="font-sans text-sm leading-[1.5] text-muted">
              {row.branch ? `${row.branch}, ` : ""}
              {formatDate(row.at)}
              {row.workflows.length > 0 && ` · ${row.workflows.join(", ")}`}
            </p>
            {row.failing.length > 0 && (
              <p className="font-sans text-sm leading-[1.5] text-body">Failing: {row.failing.join(", ")}</p>
            )}
            <a
              href={row.runsUrl}
              className="w-fit font-sans text-sm font-medium text-accent underline-offset-2 hover:underline"
            >
              See the runs<span className="sr-only"> for {row.project.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AboutPage() {
  const evidence = methodEvidence();

  return (
    <>
      <JsonLd data={personJsonLd()} />
      <header className="bg-surface-alt pb-14 pt-[18px] xl:pb-20">
        <Container>
          <Link href="/" aria-label="Alpha Guyasa, home" className="inline-block">
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
                <Eyebrow>Written roadmaps</Eyebrow>
                <p className="mt-3 font-sans text-base xl:text-[17px]">
                  <strong className="font-display text-3xl font-bold">{evidence.withRoadmap.length}</strong> of{" "}
                  {evidence.total} listed projects keep a written roadmap
                </p>
                <ProjectList items={evidence.withRoadmap} />
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

          <CiWall />

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
