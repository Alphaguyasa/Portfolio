import Image from "next/image";
import Eyebrow from "./Eyebrow";
import { stats } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-[1180px] scroll-mt-20 px-7 pt-[110px]">
      <div data-reveal="hidden">
        <Eyebrow index="03" label="About" />

        <div className="mt-[34px] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-12">
          <figure className="group relative m-0">
            <div className="overflow-hidden rounded-[3px] border border-rule bg-bg2">
              <Image
                src="/alpha-guyasa.jpg"
                alt="Portrait of Alpha Guyasa"
                width={900}
                height={1125}
                priority
                className="block aspect-4/5 w-full object-cover object-[50%_22%] grayscale contrast-[1.06] transition-[filter] duration-600 group-hover:grayscale-0 group-hover:contrast-100"
              />
            </div>
            <figcaption className="mt-[10px] font-mono text-[11px] tracking-[0.1em] uppercase text-muted">
              Alpha Guyasa — Addis Ababa, 2026
            </figcaption>
          </figure>

          <div>
            <h2 className="max-w-[22ch] text-[clamp(30px,4.4vw,50px)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
              I came to the web through breaking things.
            </h2>

            <div className="mt-6 flex max-w-[52ch] flex-col gap-[18px] font-serif text-[19.5px] leading-[1.6]">
              <p className="text-pretty">
                Capture-the-flag taught me how software actually fails: in the gap between what a
                developer assumed and what a user can do. Winning first place at Haramaya
                University&apos;s CTF — run with INSA, Ethiopia&apos;s national cyber authority —
                changed how I write code, not just how I read it.
              </p>
              <p className="text-pretty">
                Now I build the other side. Frontends that validate before they trust, components
                that behave the same on the tenth interaction as the first, and interfaces that stay
                legible on a slow connection in Harar as well as a fibre line in Addis.
              </p>
              <p className="text-pretty">
                Alongside that I led the university&apos;s Cyber Club — teaching, running sessions,
                keeping a group of people curious — and worked as the focal person for Leyu data
                collection at Gheero, which is where I learned that clean data is a design problem
                before it&apos;s an engineering one.
              </p>
            </div>

            {/* 1px gaps over a --rule background draw the hairlines between cells. */}
            <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px rounded-[3px] border border-rule bg-rule">
              {stats.map((stat) => (
                <div key={stat.v} className="bg-bg px-4 py-[18px]">
                  <div className="text-[32px] leading-none font-semibold tracking-[-0.03em]">
                    {stat.k}
                  </div>
                  <div className="mt-2 font-mono text-[11px] leading-[1.5] tracking-[0.1em] uppercase text-muted">
                    {stat.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
