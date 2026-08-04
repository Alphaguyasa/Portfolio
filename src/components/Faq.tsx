"use client";

import { useState } from "react";
import { Phone, SpeechBubble } from "@/components/icons";
import { Accent, Container, Eyebrow, SectionTitle } from "@/components/ui";
import { faqs, site } from "@/data/site";

export default function Faq() {
  // Item 02 open by default, matching the design; -1 closes all.
  const [open, setOpen] = useState(1);

  return (
    <section className="bg-surface py-20 xl:py-25">
      <Container>
        <div className="text-center">
          <div className="inline-block">
            <Eyebrow center>FAQs</Eyebrow>
          </div>
          <SectionTitle>
            Questions? <Accent>Look here.</Accent>
          </SectionTitle>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr] xl:mt-11">
          <div className="flex flex-col gap-3.5">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              const panelId = `faq-panel-${i}`;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl transition-colors duration-300 ${
                    isOpen ? "bg-accent text-white" : "bg-surface-alt text-ink"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full cursor-pointer items-center justify-between gap-5 px-6 py-6 text-left xl:px-7"
                    >
                      <span className="font-display text-lg font-semibold xl:text-xl">
                        {faq.q}
                      </span>
                      <span
                        aria-hidden
                        className="shrink-0 font-sans text-[26px] leading-none"
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                  </h3>
                  <div id={panelId} hidden={!isOpen} className="px-6 pb-6 xl:px-7">
                    <p className="font-sans text-base leading-[1.6] opacity-85 xl:text-[17px]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div className="overflow-hidden rounded-[22px]">
              <div className="bg-ink px-7 pb-8.5 pt-9.5 text-center">
                <span className="mx-auto flex size-[62px] items-center justify-center rounded-full bg-accent text-white">
                  <SpeechBubble size={30} />
                </span>
                <p className="mt-4.5 font-display text-[22px] font-bold leading-[1.35] text-white">
                  You have a different question? Ask away!
                </p>
                <p className="mt-2.5 font-sans text-base leading-[1.55] text-on-dark3">
                  Straight answers, usually the same day.
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-5 inline-block rounded-[40px] bg-accent px-7 py-3.5 font-sans text-base font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Contact Me
                </a>
              </div>
              <div className="h-11 bg-accent" />
            </div>

            <div className="mt-5.5 flex items-center gap-4.5 rounded-[22px] bg-surface-alt p-6.5">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-accent">
                <Phone size={26} />
              </span>
              <div className="min-w-0">
                <p className="font-sans text-[15px] text-muted">
                  Your Vision, My Craft
                </p>
                <p className="font-display text-[22px] font-bold">
                  Reach me anytime
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="break-all font-sans text-base text-muted transition-colors duration-200 hover:text-accent"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
