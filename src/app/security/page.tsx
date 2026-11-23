import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowRight, ArrowUpRight, Check } from "@/components/icons";
import JsonLd from "@/components/JsonLd";
import { Accent, Container, Logo } from "@/components/ui";
import { securityPage } from "@/data/site";
import { personJsonLd } from "@/lib/structured-data";
import { projectPath, proofProjects } from "@/lib/projects";

const description =
  "Threat models and hardening work from Alpha Guyasa's own projects: what each protects, from whom, and what is still open.";

export const metadata: Metadata = {
  title: "Security work",
  description,
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Security work by Alpha Guyasa",
    description,
    url: "/security",
    // An openGraph object on a page replaces the root one, and with it the root image.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Alpha Guyasa — Full Stack Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Security work by Alpha Guyasa",
    description,
    images: [{ url: "/opengraph-image", alt: "Alpha Guyasa — Full Stack Engineer" }],
  },
};

const prose = "font-sans text-base leading-[1.7] text-body xl:text-[17px]";

export default function SecurityPage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <header className="bg-surface-alt pb-14 pt-[18px] xl:pb-20">
        <Container>
          <Link href="/" aria-label="Alpha Guyasa — home" className="inline-block">
            <Logo />
          </Link>
          <Link
            href="/services"
            className="mt-10 flex w-fit items-center gap-2 font-sans text-base font-semibold text-accent hover:text-ink"
          >
            <ArrowRight size={16} className="rotate-180" />
            Back to services
          </Link>
          <h1 className="mt-6 font-display text-[34px] font-bold leading-[1.15] tracking-[-0.8px] sm:text-[44px] xl:text-[58px] xl:tracking-[-1.4px]">
            Security <Accent>work</Accent>
          </h1>
          <p className="mt-4 max-w-[760px] font-sans text-base leading-[1.6] text-muted2 xl:text-[17px]">
            {securityPage.intro}
          </p>
        </Container>
      </header>

      <main id="main" className="pb-20">
        <Container>
          <div className="mt-12 flex max-w-[820px] flex-col gap-14">
            {securityPage.cases.map((item) => {
              const [project] = proofProjects([item.slug]);
              const headingId = `security-${item.slug}`;
              return (
                <section key={item.slug} aria-labelledby={headingId}>
                  <p className="font-sans text-sm font-semibold uppercase tracking-[1px] text-accent">
                    <Link href={projectPath(project)} className="hover:text-ink">
                      {project.name}
                    </Link>
                  </p>
                  <h2 id={headingId} className="mt-2 font-display text-2xl font-bold tracking-[-0.4px] xl:text-[30px]">
                    {item.heading}
                  </h2>
                  <p className={`mt-3 ${prose}`}>{item.summary}</p>
                  <ul className="mt-5 flex flex-col gap-3.5">
                    {item.points.map((point) => (
                      <li key={point} className={`flex items-start gap-3.5 ${prose}`}>
                        <span className="mt-1 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                          <Check size={12} />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className={`mt-5 rounded-2xl bg-surface-alt px-5 py-4 ${prose}`}>
                    <strong className="font-semibold text-ink">Still open: </strong>
                    {item.limits}
                  </p>
                  <a
                    href={`https://github.com/${project.repo}/blob/main/${item.doc.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-fit items-center gap-2 font-sans text-base font-semibold text-accent hover:text-ink"
                  >
                    Read the {item.doc.label.toLowerCase()} on GitHub
                    <span className="sr-only"> (opens in a new tab)</span>
                    <ArrowUpRight size={16} />
                  </a>
                </section>
              );
            })}
          </div>

          <Link
            href="/?package=security-review#contact"
            className="mt-16 flex w-fit items-center gap-2 rounded-[40px] bg-accent px-6 py-3.5 font-sans text-base font-semibold text-white transition-colors duration-200 hover:bg-ink"
          >
            Ask for a security review quote
            <ArrowUpRight size={16} />
          </Link>
        </Container>
      </main>
      <Footer basePath="/" />
    </>
  );
}
