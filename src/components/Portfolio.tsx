import Image from "next/image";
import { Check } from "@/components/icons";
import { Accent, Container, CtaPill, Eyebrow, SectionTitle } from "@/components/ui";
import { site } from "@/data/site";
import {
  STATUS_LABEL,
  formatDate,
  liveFacts,
  projects,
  type Project,
  type Status,
} from "@/lib/projects";

const statusClass: Record<Status, string> = {
  idea: "bg-white text-ink ring-1 ring-hairline",
  building: "bg-accent text-white",
  shipped: "bg-ink text-white",
  maintained: "bg-ink text-white",
  paused: "bg-white text-muted ring-1 ring-hairline",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block rounded-[40px] px-3.5 py-1.5 font-sans text-[13px] font-semibold ${statusClass[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function specsOf(project: Project) {
  const live = liveFacts(project);
  const specs = [
    { label: "Platform", value: project.platform },
    { label: "Stack", value: project.stack.slice(0, 3).join(", ") },
  ];
  if (live.npmVersion) specs.push({ label: "npm", value: `v${live.npmVersion}` });
  if (live.lastCommitAt) specs.push({ label: "Last commit", value: formatDate(live.lastCommitAt) });
  return specs;
}

function SpecTable({ project, compact = false }: { project: Project; compact?: boolean }) {
  const specs = specsOf(project);
  return (
    <dl className={`rounded-[14px] bg-white px-5 xl:px-[22px] ${compact ? "mt-4.5" : "mt-5.5"}`}>
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

function Results({ project }: { project: Project }) {
  if (project.results.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {project.results.slice(0, 2).map((result) => (
        <li key={result} className="flex gap-3 font-sans text-[15px] leading-[1.5] text-body xl:text-base">
          <span className="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
            <Check size={12} />
          </span>
          {result}
        </li>
      ))}
    </ul>
  );
}

function Heading({ project, large }: { project: Project; large: boolean }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={project.status} />
      </div>
      <h3
        className={`mt-3.5 font-display font-bold leading-[1.25] ${
          large ? "text-2xl xl:text-[30px]" : "text-xl xl:text-[26px]"
        }`}
      >
        {project.name} – <Accent>{project.tagline}</Accent>
      </h3>
      <p className="mt-3 font-sans text-base leading-[1.6] text-body xl:text-[17px]">{project.problem}</p>
    </>
  );
}

function SourceLink({ project }: { project: Project }) {
  const link = project.links[0];
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
      className="mt-5 inline-block border-b-[1.5px] border-accent font-sans text-base font-semibold text-accent transition-colors duration-200 hover:border-ink hover:text-ink xl:text-[17px]"
    >
      {link.label}
      <span className="sr-only"> for {project.name}</span>
    </a>
  );
}

function StatusNote({ project }: { project: Project }) {
  return <p className="mt-3 font-sans text-sm leading-[1.5] text-muted">{project.statusNote}</p>;
}

/**
 * Full-width row. With a real screenshot the image alternates sides at desktop;
 * without one there is no picture at all (honesty rules: no stand-ins), and the
 * specs take the image's column instead.
 */
function FeaturedRow({ project, imageFirst }: { project: Project; imageFirst: boolean }) {
  const image = project.images[0];
  return (
    <article className="grid items-center gap-6 rounded-3xl bg-surface-alt p-5.5 lg:grid-cols-2 lg:gap-[34px]">
      {image ? (
        <div
          className={`relative h-[260px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-[420px] ${
            imageFirst ? "" : "lg:order-2"
          }`}
        >
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 1023px) 100vw, 560px" className="object-cover" />
        </div>
      ) : null}

      <div className={image ? (imageFirst ? "lg:pr-4" : "lg:order-1 lg:pl-4") : "lg:p-4"}>
        <Heading project={project} large />
        <Results project={project} />
        {image ? <SpecTable project={project} /> : null}
        <StatusNote project={project} />
        <SourceLink project={project} />
      </div>

      {image ? null : (
        <div className="lg:p-4">
          <SpecTable project={project} />
        </div>
      )}
    </article>
  );
}

function HalfCard({ project }: { project: Project }) {
  const image = project.images[0];
  return (
    <article className="flex flex-col rounded-3xl bg-surface-alt p-5.5">
      {image ? (
        <div className="relative mb-5.5 h-[240px] overflow-hidden rounded-2xl xl:h-[280px]">
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 1023px) 100vw, 560px" className="object-cover" />
        </div>
      ) : null}
      <Heading project={project} large={false} />
      <Results project={project} />
      <SpecTable project={project} compact />
      <StatusNote project={project} />
      <div className="mt-auto">
        <SourceLink project={project} />
      </div>
    </article>
  );
}

export default function Portfolio() {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="bg-surface py-20 xl:py-25">
      <Container>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between xl:gap-10">
          <div>
            <Eyebrow>My Portfolio</Eyebrow>
            <SectionTitle>
              Let’s Have a <Accent>Look at My Portfolio</Accent>
            </SectionTitle>
            <p className="mt-4 max-w-[680px] font-sans text-base leading-[1.6] text-body xl:text-[17px]">
              Every project links to its code. Status, dates and numbers come from the repositories
              themselves and are re-checked every day.
            </p>
          </div>
          <CtaPill href={site.github} label="View All Projects" className="self-start" />
        </div>

        <div className="mt-10 flex flex-col gap-7 xl:mt-11">
          {featured.map((project, i) => (
            <FeaturedRow key={project.slug} project={project} imageFirst={i % 2 === 0} />
          ))}

          <div className="grid gap-7 lg:grid-cols-2">
            {others.map((project) => (
              <HalfCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
