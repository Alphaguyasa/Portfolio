import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ArrowRight, ArrowUpRight, Check } from "@/components/icons";
import { Accent, Container, Logo } from "@/components/ui";
import { servicesPage } from "@/data/site";
import { personJsonLd } from "@/lib/structured-data";
import { projectPath, proofProjects } from "@/lib/projects";

const description =
  "What you can hire Alpha Guyasa for: business web apps, offline Android apps and security reviews, each quoted after a short call.";

export const metadata: Metadata = {
  title: "Services",
  description,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services: what you can hire Alpha Guyasa for",
    description,
    url: "/services",
    // An openGraph object on a page replaces the root one, and with it the root image.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Alpha Guyasa · Full Stack Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services: what you can hire Alpha Guyasa for",
    description,
    images: [{ url: "/opengraph-image", alt: "Alpha Guyasa · Full Stack Engineer" }],
  },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <header className="bg-surface-alt pb-14 pt-[18px] xl:pb-20">
        <Container>
          <Link href="/" aria-label="Alpha Guyasa, home" className="inline-block">
            <Logo />
          </Link>
          <Link
            href="/#services"
            className="mt-10 flex w-fit items-center gap-2 font-sans text-base font-semibold text-accent hover:text-ink"
          >
            <ArrowRight size={16} className="rotate-180" />
            Back to home
          </Link>
          <h1 className="mt-6 font-display text-[34px] font-bold leading-[1.15] tracking-[-0.8px] sm:text-[44px] xl:text-[58px] xl:tracking-[-1.4px]">
            What you can <Accent>hire me for</Accent>
          </h1>
          <p className="mt-4 max-w-[760px] font-sans text-base leading-[1.6] text-muted2 xl:text-[17px]">
            {servicesPage.intro}
          </p>
        </Container>
      </header>

      <main id="main" className="pb-20">
        <Container>
          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {servicesPage.packages.map((pkg) => {
              const headingId = `package-${pkg.id}`;
              return (
                <li key={pkg.id} className="flex">
                  <article
                    aria-labelledby={headingId}
                    className="flex w-full flex-col rounded-3xl bg-surface-alt2 p-5.5"
                  >
                    <div className="rounded-2xl bg-ink px-6 py-6 text-white">
                      <h2 id={headingId} className="font-display text-[22px] font-semibold xl:text-[26px]">
                        {pkg.title}
                      </h2>
                      <p className="mt-3 font-sans text-base leading-[1.55] text-on-dark">{pkg.summary}</p>
                      <p className="mt-5 font-display text-2xl font-bold text-accent-bright">{servicesPage.price}</p>
                    </div>

                    <h3 className="mt-6 px-2 font-sans text-sm font-semibold uppercase tracking-[1px] text-muted">
                      What it covers
                    </h3>
                    <ul className="mt-3 flex flex-col gap-3.5 px-2">
                      {pkg.scope.map((item) => (
                        <li key={item} className="flex items-start gap-3.5 font-sans text-base text-ink">
                          <span className="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                            <Check size={12} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <h3 className="mt-6 px-2 font-sans text-sm font-semibold uppercase tracking-[1px] text-muted">
                      Work that shows it
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-2 px-2">
                      {proofProjects(pkg.proof).map((project) => (
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

                    {pkg.more && (
                      <Link
                        href={pkg.more.href}
                        className="mt-4 flex w-fit items-center gap-2 px-2 font-sans text-sm font-semibold text-accent hover:text-ink"
                      >
                        {pkg.more.label}
                        <ArrowRight size={14} />
                      </Link>
                    )}

                    <div className="mt-auto px-2 pt-7">
                      <p className="font-sans text-sm text-muted">{servicesPage.timeline}</p>
                      <Link
                        href={`/?package=${pkg.id}#contact`}
                        className="mt-4 flex w-fit items-center gap-2 rounded-[40px] bg-accent px-6 py-3.5 font-sans text-base font-semibold text-white transition-colors duration-200 hover:bg-ink"
                      >
                        Ask for a quote
                        <span className="sr-only">: {pkg.title}</span>
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </Container>
      </main>
      <Footer basePath="/" />
    </>
  );
}
