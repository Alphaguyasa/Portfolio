import { Bulb, Person, Star } from "@/components/icons";
import { Accent, Container, Eyebrow, SectionTitle } from "@/components/ui";
import { recognitions } from "@/data/site";

const glyphs = {
  star: Star,
  bulb: Bulb,
  person: Person,
};

export default function Recognitions() {
  return (
    <section className="overflow-hidden bg-surface-alt py-20 xl:py-25">
      <Container className="text-center">
        <div className="inline-block">
          <Eyebrow center>Achievements</Eyebrow>
        </div>
        <SectionTitle>
          My <Accent>Recognitions</Accent> So Far
        </SectionTitle>

        <ul className="mt-10 grid gap-6.5 text-left sm:grid-cols-2 lg:grid-cols-3 xl:mt-12">
          {recognitions.map((item, i) => {
            const Glyph = glyphs[item.icon];
            return (
              <li
                key={item.title}
                className="relative overflow-hidden rounded-[22px] bg-white p-7.5"
              >
                {/* Ghost numeral sits behind the content. It is decorative, so it is
                    drawn as generated content rather than as text a contrast
                    checker or screen reader would read. */}
                <span
                  aria-hidden
                  data-numeral={String(i + 1).padStart(2, "0")}
                  className="absolute right-3.5 top-4.5 font-display text-8xl font-extrabold leading-none text-ghost before:content-[attr(data-numeral)]"
                />
                <span
                  className={`relative flex size-23 items-center justify-center rounded-full text-white ${
                    item.tone === "accent" ? "bg-accent" : "bg-ink"
                  }`}
                >
                  <Glyph size={item.icon === "star" ? 44 : 42} />
                </span>
                <h3 className="relative mt-6.5 font-display text-xl font-bold xl:text-2xl">
                  {item.title}
                </h3>
                <p className="relative mt-2.5 font-sans text-base leading-[1.55] text-muted xl:text-[17px]">
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
