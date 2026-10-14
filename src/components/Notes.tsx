import { ArrowUpRight } from "@/components/icons";
import { Accent, Container, CtaPill, Eyebrow, SectionTitle } from "@/components/ui";
import { publishedNotes, site } from "@/data/site";

export default function Notes() {
  // Only published posts are listed; until one exists there is no section.
  if (publishedNotes.length === 0) return null;
  return (
    <section id="blogs" className="bg-surface-alt py-20 xl:py-25">
      <Container>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between xl:gap-10">
          <div>
            <Eyebrow>Notes &amp; Writing</Eyebrow>
            <SectionTitle>
              My Latest <Accent>Engineering Notes</Accent>
            </SectionTitle>
          </div>
          <CtaPill href={site.github} label="Read All" className="self-start" />
        </div>

        <ul className="mt-10 grid gap-6.5 sm:grid-cols-2 lg:grid-cols-3 xl:mt-11">
          {publishedNotes.map((note) => (
            <li key={note.title} className="relative rounded-[22px] bg-white p-6">
              <span
                aria-hidden
                className="pointer-events-none absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-accent text-white"
              >
                <ArrowUpRight size={17} />
              </span>
              <ul className="flex flex-wrap gap-2 pr-12">
                {note.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-[40px] bg-accent px-3.5 py-1.5 font-sans text-[13px] font-medium text-white"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <h3 className="mt-3.5 font-display text-xl font-bold leading-[1.3] xl:text-[23px]">
                <a href={note.href ?? undefined} className="after:absolute after:inset-0 hover:text-accent">
                  {note.title}
                </a>
              </h3>
              <p className="mt-2.5 font-sans text-[15px] leading-[1.55] text-muted xl:text-base">
                {note.excerpt}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
