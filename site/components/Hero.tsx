import Eyebrow from "./Eyebrow";
import Typewriter from "./Typewriter";
import { EMAIL, GITHUB, LINKEDIN, PHONE_HREF, PHONE_LABEL, RESUME, roles } from "@/lib/data";

const pill =
  "flex items-center justify-between gap-4 rounded-[2px] px-[18px] py-[15px] text-[15px] font-medium transition-colors duration-300";

const smallLink =
  "border-b border-rule pb-[2px] text-muted transition-colors duration-240 hover:border-accent hover:text-accent";

export default function Hero() {
  return (
    <section className="mx-auto max-w-[1180px] px-7 pt-[76px]">
      <Eyebrow index="01" label="Addis Ababa, Ethiopia · UTC+3" />

      <h1 className="mt-[34px] text-[clamp(52px,10.5vw,148px)] leading-[0.86] font-semibold tracking-[-0.045em] text-balance">
        Alpha
        <br />
        <span className="inline-flex items-baseline">
          Guyasa<span className="text-accent">.</span>
        </span>
      </h1>

      <div className="mt-[30px] border-t border-rule pt-[26px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-[34px]">
          <div>
            <div className="mb-3 font-mono text-xs tracking-[0.12em] uppercase text-muted">
              Currently
            </div>
            <div className="flex min-h-[52px] items-baseline gap-[2px] text-[19px] leading-[1.35] tracking-[-0.01em]">
              <Typewriter phrases={roles} />
            </div>
          </div>

          <p className="max-w-[44ch] font-serif text-xl leading-[1.55] text-pretty">
            I build web interfaces the way a security person would — small surface area, no loose
            ends, everything accounted for. Computer science graduate, Haramaya University. First
            place at the university&apos;s INSA-backed capture-the-flag.
          </p>

          <div className="flex flex-col gap-[10px]">
            <a href="#work" className={`${pill} bg-ink text-bg hover:bg-accent hover:text-on-accent`}>
              <span>See selected work</span>
              <span className="font-mono">→</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className={`${pill} border border-rule hover:border-accent hover:text-accent`}
            >
              <span>{EMAIL}</span>
              <span className="font-mono">↗</span>
            </a>
            <a
              href={RESUME}
              download="Alpha-Guyasa-Resume.pdf"
              className={`${pill} border border-rule hover:border-accent hover:text-accent`}
            >
              <span>Download résumé</span>
              <span className="font-mono">⭳</span>
            </a>

            <div className="flex gap-[18px] pt-1 font-mono text-xs tracking-[0.08em] uppercase">
              <a href={GITHUB} target="_blank" rel="noopener" className={smallLink}>
                GitHub
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener" className={smallLink}>
                LinkedIn
              </a>
              <a href={PHONE_HREF} className={smallLink}>
                {PHONE_LABEL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
