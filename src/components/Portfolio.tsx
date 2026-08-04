import Image from "next/image";
import { Accent, Container, CtaPill, Eyebrow, SectionTitle } from "@/components/ui";
import { featuredProjects, secondaryProjects, site, type Project } from "@/data/site";

function SpecTable({
  specs,
  compact = false,
}: {
  specs: Project["specs"];
  compact?: boolean;
}) {
  return (
    <dl
      className={`rounded-[14px] bg-white px-5 xl:px-[22px] ${compact ? "mt-4.5" : "mt-5.5"}`}
    >
      {specs.map((spec, i) => (
        <div
          key={spec.label}
          className={`flex flex-wrap justify-between gap-2 font-sans text-[15px] xl:text-[17px] ${
            compact ? "py-3.5" : "py-[15px]"
          } ${i < specs.length - 1 ? "border-b border-hairline2" : ""}`}
        >
          <dt>{spec.label}</dt>
          <dd className="text-muted">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ViewDetails({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="mt-5 inline-block border-b-[1.5px] border-accent font-sans text-base font-semibold text-accent transition-colors duration-200 hover:border-ink hover:text-ink xl:text-[17px]"
    >
      View Details
      <span className="sr-only"> for {name}</span>
    </a>
  );
}

/** Full-width row; the image alternates sides on odd rows at desktop. */
function FeaturedRow({
  project,
  imageFirst,
}: {
  project: Project;
  imageFirst: boolean;
}) {
  return (
    <article className="grid items-center gap-6 rounded-3xl bg-surface-alt p-5.5 lg:grid-cols-2 lg:gap-[34px]">
      <div
        className={`relative h-[260px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-[420px] ${
          imageFirst ? "" : "lg:order-2"
        }`}
      >
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes="(max-width: 1023px) 100vw, 560px"
          className="object-cover"
        />
      </div>

      <div className={imageFirst ? "lg:pr-4" : "lg:order-1 lg:pl-4"}>
        <h3 className="font-display text-2xl font-bold leading-[1.25] xl:text-[30px]">
          {project.name} – <Accent>{project.descriptor}</Accent>
        </h3>
        <p className="mt-3.5 font-sans text-base leading-[1.6] text-body xl:text-[17px]">
          {project.body}
        </p>
        <SpecTable specs={project.specs} />
        <ViewDetails href={project.href} name={project.name} />
      </div>
    </article>
  );
}

function HalfCard({ project }: { project: Project }) {
  return (
    <article className="rounded-3xl bg-surface-alt p-5.5">
      <div className="relative h-[240px] overflow-hidden rounded-2xl xl:h-[280px]">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes="(max-width: 1023px) 100vw, 560px"
          className="object-cover"
        />
      </div>
      <h3 className="mt-5.5 font-display text-xl font-bold leading-[1.25] xl:text-[26px]">
        {project.name} – <Accent>{project.descriptor}</Accent>
      </h3>
      <p className="mt-3 font-sans text-base leading-[1.6] text-body xl:text-[17px]">
        {project.body}
      </p>
      <SpecTable specs={project.specs} compact />
      <ViewDetails href={project.href} name={project.name} />
    </article>
  );
}

export default function Portfolio() {
  return (
    <section id="projects" className="bg-surface py-20 xl:py-25">
      <Container>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between xl:gap-10">
          <div>
            <Eyebrow>My Portfolio</Eyebrow>
            <SectionTitle>
              Let’s Have a <Accent>Look at My Portfolio</Accent>
            </SectionTitle>
          </div>
          <CtaPill
            href={site.github}
            label="View All Projects"
            className="self-start"
          />
        </div>

        <div className="mt-10 flex flex-col gap-7 xl:mt-11">
          {featuredProjects.map((project, i) => (
            <FeaturedRow
              key={project.name}
              project={project}
              imageFirst={i % 2 === 0}
            />
          ))}

          <div className="grid gap-7 lg:grid-cols-2">
            {secondaryProjects.map((project) => (
              <HalfCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
