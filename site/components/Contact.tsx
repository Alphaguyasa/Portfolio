import ContactForm from "./ContactForm";
import Eyebrow from "./Eyebrow";
import { contactLinks } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="mt-[120px] bg-ink text-bg">
      <div className="mx-auto max-w-[1180px] px-7 pt-[88px] pb-16">
        <Eyebrow index="06" label="Contact" onInk />

        <h2 className="mt-[30px] max-w-[16ch] text-[clamp(38px,7.6vw,104px)] leading-[0.92] font-semibold tracking-[-0.045em] text-balance">
          Hiring, or just curious?
        </h2>

        <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-10">
          <div>
            <p className="max-w-[40ch] font-serif text-[21px] leading-[1.55] text-bg/82 text-pretty">
              I&apos;m looking for a frontend or full-stack role where security isn&apos;t an
              afterthought. Freelance and contract work welcome too. I reply within a day.
            </p>

            <div className="mt-7 flex flex-col gap-px overflow-hidden rounded-[3px] border border-bg/22 bg-bg/22">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  className="flex items-center justify-between gap-4 bg-ink px-[18px] py-4 text-bg transition-colors duration-260 hover:bg-accent hover:text-on-accent"
                >
                  <span className="font-mono text-[11px] tracking-[0.12em] uppercase opacity-65">
                    {link.label}
                  </span>
                  <span className="text-base font-medium">{link.value}</span>
                </a>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </div>

      <div className="border-t border-bg/20">
        <div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-4 px-7 py-[22px] font-mono text-[11px] tracking-[0.1em] uppercase text-bg/58">
          <span>© 2026 Alpha Guyasa</span>
          <span>Built by hand · Addis Ababa, Ethiopia</span>
          <a href="#top" className="transition-colors duration-240 hover:text-accent">
            Back to top ↑
          </a>
        </div>
      </div>
    </section>
  );
}
