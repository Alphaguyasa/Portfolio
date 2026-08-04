import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";
import { Accent, Container, CtaPill, Eyebrow, SectionTitle } from "@/components/ui";
import { notes, site } from "@/data/site";

export default function Notes() {
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

        {/* Notes are not published yet, so the cards are unlinked rather than
            pointing somewhere that 404s. */}
        <ul className="mt-10 grid gap-6.5 sm:grid-cols-2 lg:grid-cols-3 xl:mt-11">
          {notes.map((note) => (
            <li key={note.title} className="rounded-[22px] bg-white p-4.5">
              <div className="relative h-[230px] overflow-hidden rounded-[14px]">
                <Image
                  src={note.image.src}
                  alt={note.image.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 370px"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3.5 top-3.5 flex size-10 items-center justify-center rounded-full bg-accent text-white"
                >
                  <ArrowUpRight size={17} />
                </span>
              </div>
              <ul className="mt-4.5 flex flex-wrap gap-2">
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
                {note.title}
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
