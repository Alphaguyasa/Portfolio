import Eyebrow from "./Eyebrow";
import { timeline } from "@/lib/data";

export default function Record() {
  return (
    <section id="record" className="mx-auto max-w-[1180px] scroll-mt-20 px-7 pt-[110px]">
      <div data-reveal="hidden">
        <Eyebrow index="05" label="Record" />
        <h2 className="mt-[26px] max-w-[24ch] text-[clamp(30px,4.4vw,50px)] leading-[1.02] font-semibold tracking-[-0.035em]">
          Experience, study, and one trophy.
        </h2>
      </div>

      <div className="mt-10 flex flex-col">
        {timeline.map((entry) => (
          <div
            key={entry.role}
            className="grid grid-cols-[minmax(96px,132px)_1fr] items-start gap-6 border-t border-rule py-[26px] transition-[padding-left] duration-300 hover:pl-2"
          >
            <div className="pt-[5px] font-mono text-xs tracking-[0.08em] text-muted">
              {entry.when}
            </div>
            <div>
              <div className="flex flex-wrap items-baseline gap-[10px]">
                <h3 className="text-[23px] font-semibold tracking-[-0.02em]">{entry.role}</h3>
                <span className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-accent">
                  {entry.org}
                </span>
              </div>
              <p className="mt-[10px] max-w-[66ch] font-serif text-lg leading-[1.55] text-muted text-pretty">
                {entry.body}
              </p>
            </div>
          </div>
        ))}
        <div className="border-t border-rule" />
      </div>
    </section>
  );
}
