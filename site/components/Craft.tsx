import Eyebrow from "./Eyebrow";
import { craft } from "@/lib/data";

export default function Craft() {
  return (
    <section id="craft" className="mx-auto max-w-[1180px] scroll-mt-20 px-7 pt-[110px]">
      <div data-reveal="hidden">
        <Eyebrow index="04" label="Craft" />
        <h2 className="mt-[26px] max-w-[24ch] text-[clamp(30px,4.4vw,50px)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
          What I reach for, and why.
        </h2>
        <p className="mt-4 max-w-[56ch] font-serif text-lg leading-[1.6] text-muted text-pretty">
          No percentage bars. A number next to &ldquo;React&rdquo; tells you nothing — here&apos;s
          the honest grouping instead, with the depth stated in words.
        </p>
      </div>

      <div className="mt-[34px] grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-px overflow-hidden rounded-[3px] border border-rule bg-rule">
        {craft.map((group) => (
          <div
            key={group.title}
            className="flex flex-col gap-4 bg-bg px-6 py-[26px] transition-colors duration-300 hover:bg-bg2"
          >
            <div className="flex items-baseline justify-between gap-[10px]">
              <h3 className="text-[19px] font-semibold tracking-[-0.015em]">{group.title}</h3>
              <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-accent">
                {group.level}
              </span>
            </div>

            <p className="font-serif text-[16.5px] leading-[1.5] text-muted text-pretty">
              {group.note}
            </p>

            <div className="mt-auto flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-[2px] border border-rule px-[9px] py-[5px] font-mono text-[11.5px] tracking-[0.02em] whitespace-nowrap"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
