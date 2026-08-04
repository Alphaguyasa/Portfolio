"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Accent, Container, CtaPill, Eyebrow, SectionTitle } from "@/components/ui";
import { services } from "@/data/site";

export default function Services() {
  // Item 02 is open by default; -1 means all closed, which is a valid state.
  const [open, setOpen] = useState(1);

  return (
    <section id="services" className="bg-surface py-20 xl:py-25">
      <Container>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between xl:gap-15">
          <div>
            <Eyebrow>My Specialization</Eyebrow>
            <SectionTitle>
              <Accent>Services</Accent> I Provide
            </SectionTitle>
          </div>
          <p className="max-w-[460px] font-sans text-base leading-[1.5] text-muted xl:pb-2 xl:text-lg">
            Five things I get asked for most — from a first Flutter build to a
            sync layer that survives a week offline.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3.5 xl:mt-11">
          {services.map((service, i) => {
            const isOpen = open === i;
            const index = String(i + 1).padStart(2, "0");
            const panelId = `service-panel-${i}`;

            return (
              <div
                key={service.title}
                className={`rounded-[22px] transition-colors duration-300 ${
                  isOpen ? "bg-ink text-white" : "bg-surface-alt text-ink"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full cursor-pointer items-center gap-5 px-6 py-6 text-left xl:gap-13 xl:px-[34px] xl:py-[30px]"
                >
                  <span className="font-display text-xl font-bold xl:min-w-12 xl:text-[26px]">
                    {index}.
                  </span>
                  <span className="flex-1 font-display text-lg font-semibold sm:text-xl xl:text-[28px]">
                    {service.title}
                  </span>
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      isOpen ? "bg-accent text-white" : "bg-white text-ink"
                    }`}
                  >
                    <ArrowUpRight size={18} />
                  </span>
                </button>

                <div
                  id={panelId}
                  hidden={!isOpen}
                  className="px-6 pb-7 xl:pb-[30px] xl:pl-25 xl:pr-[34px]"
                >
                  <ul className="flex max-w-[560px] flex-wrap gap-2.5">
                    {service.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-[40px] border border-tag-border px-4 py-2 font-sans text-[15px] xl:px-[18px] xl:text-base"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 max-w-[520px] font-sans text-base leading-[1.55] text-on-dark xl:text-[17px]">
                    {service.body}
                  </p>
                  {service.image && (
                    <div className="relative mt-6 aspect-[560/230] w-full max-w-[560px] overflow-hidden rounded-2xl">
                      <Image
                        src={service.image.src}
                        alt={service.image.alt}
                        fill
                        sizes="560px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <CtaPill href="#contact" label="View All Services" />
        </div>
      </Container>
    </section>
  );
}
