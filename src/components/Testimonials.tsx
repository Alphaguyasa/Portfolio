import Image from "next/image";
import { QuoteMark, Star } from "@/components/icons";
import { Accent, Container, Eyebrow, SectionTitle } from "@/components/ui";
import { testimonials } from "@/data/site";

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-surface py-20 xl:py-25">
      <Container className="text-center">
        <div className="inline-block">
          <Eyebrow center>Client Testimonials</Eyebrow>
        </div>
        <SectionTitle>
          What My <Accent>Clients Are Saying</Accent>
        </SectionTitle>

        {/* The mock shows three pagination bars for two quotes and wires none of
            them; dead controls are worse than none, so they are dropped. */}
        <ul className="mt-10 grid gap-7 text-left lg:grid-cols-2 xl:mt-12">
          {testimonials.map((person) => (
            <li
              key={person.name}
              className="rounded-[22px] bg-surface-alt px-8 py-7.5"
            >
              <figure>
                <div className="flex items-center gap-5">
                  <Image
                    src={person.photo}
                    alt={person.name}
                    width={88}
                    height={88}
                    className="size-22 shrink-0 rounded-full object-cover"
                  />
                  <figcaption className="flex-1">
                    <p className="font-display text-lg font-bold xl:text-[22px]">
                      {person.name}
                    </p>
                    <p className="mt-0.5 font-sans text-base text-muted">
                      {person.role}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5">
                      <span className="flex gap-1.5" aria-hidden>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className="text-accent" size={19} />
                        ))}
                      </span>
                      <span className="ml-1.5 font-display text-[17px] font-bold">
                        5.0
                      </span>
                      <span className="sr-only">out of 5</span>
                    </p>
                  </figcaption>
                  <span className="hidden size-[58px] shrink-0 items-center justify-center rounded-full bg-white sm:flex">
                    <QuoteMark className="text-accent" width={24} />
                  </span>
                </div>
                <blockquote className="mt-5.5 font-sans text-base leading-[1.6] text-body xl:text-lg">
                  {person.quote}
                </blockquote>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
