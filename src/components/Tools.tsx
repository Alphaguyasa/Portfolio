import { BrandLogo } from "@/components/brand-logos";
import { Accent, Container, Eyebrow, SectionTitle } from "@/components/ui";
import { tools } from "@/data/site";
import { projects } from "@/lib/projects";

/** Listed projects whose stack names this tool. */
export function projectsUsing(matches: readonly string[]): number {
  return projects.filter((p) =>
    p.stack.some((s) => matches.some((m) => s.toLowerCase().includes(m.toLowerCase()))),
  ).length;
}

export default function Tools() {
  return (
    <section className="bg-surface py-20 xl:py-25">
      <Container className="text-center">
        <div className="inline-block">
          <Eyebrow center>My Daily Stack</Eyebrow>
        </div>
        <SectionTitle>
          The Tools That <Accent>Power My Work</Accent>
        </SectionTitle>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:mt-12 xl:grid-cols-6 xl:gap-[22px]">
          {tools.map((tool) => {
            const used = projectsUsing(tool.matches);
            return (
            <li
              key={tool.name}
              className="rounded-b-[22px] rounded-t-[90px] bg-surface-alt px-2.5 pb-[22px] pt-[26px]"
            >
              <span className="mx-auto flex size-24 items-center justify-center rounded-full bg-white">
                <BrandLogo name={tool.logo} size={44} />
              </span>
              <p className="mt-4 font-display text-xl font-bold xl:text-[22px]">
                {tool.name}
              </p>
              {used > 0 ? (
                <p className="mt-0.5 font-sans text-base text-muted">
                  {used} listed project{used === 1 ? "" : "s"}
                </p>
              ) : null}
            </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
