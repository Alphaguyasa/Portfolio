import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  QuoteMark,
  Sparkle2,
  Sparkle4,
  Star,
} from "@/components/icons";
import { Container, SocialLinks } from "@/components/ui";
import { heroChips } from "@/data/site";

/** 124px white disc with a rotating "HIRE ME" text ring; the arrow stays upright. */
function HireBadge() {
  return (
    <a
      href="#contact"
      aria-label="Hire me — go to contact"
      className="absolute right-6 top-2 hidden size-[100px] items-center justify-center rounded-full bg-white shadow-[0_6px_24px_rgba(0,0,0,.06)] lg:flex xl:size-[124px]"
    >
      <svg
        viewBox="0 0 124 124"
        className="animate-badge absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          <path
            id="hire-ring"
            d="M62,62 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
          />
        </defs>
        <text className="fill-ink font-display text-[13px] font-bold tracking-[2.5px]">
          <textPath href="#hire-ring">
            HIRE ME &#8226; HIRE ME &#8226; HIRE ME &#8226;{" "}
          </textPath>
        </text>
      </svg>
      <span className="flex size-11 items-center justify-center rounded-full bg-accent text-white">
        <ArrowUpRight size={20} />
      </span>
    </a>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-surface-alt pt-10 xl:pt-[52px]">
      <Container className="relative">
        <HireBadge />

        <div className="text-center">
          <div className="inline-flex items-center gap-3">
            <span className="font-sans text-lg font-medium xl:text-[22px]">
              Hello There!
            </span>
          </div>
          <h1 className="mt-1.5 font-display text-[40px] font-bold leading-[1.05] tracking-[-1px] sm:text-5xl md:text-[56px] lg:text-[66px] xl:text-[78px] xl:tracking-[-2px]">
            I’m <span className="italic text-accent">Alpha Guyasa</span>
            <span className="ml-1.5 inline-block align-top">
              <Sparkle2 className="text-ink" size={26} />
            </span>
          </h1>
          <p className="mt-2.5 font-sans text-lg text-body xl:text-[22px]">
            Full Stack Engineer based in Addis Ababa
          </p>
        </div>

        {/* Below 1290px the three columns stack; at 1290px+ they take the exact
            absolute positions from the design. */}
        <div className="relative mt-10 flex flex-col items-center gap-12 xl:mt-[26px] xl:block xl:h-[560px] xl:gap-0">
          {/* Centre — portrait over the orange arch */}
          <div className="relative order-1 aspect-[47/56] w-full max-w-[420px] xl:absolute xl:bottom-0 xl:left-1/2 xl:order-none xl:h-[560px] xl:w-[470px] xl:max-w-none xl:-translate-x-1/2">
            <div className="absolute inset-x-[7.4%] bottom-0 h-[82.1%] rounded-t-[200px] bg-accent" />
            <div className="absolute inset-x-[9.6%] bottom-0 z-2 h-[78.6%] overflow-hidden rounded-t-[190px]">
              <Image
                src="/assets/hero-portrait.jpg"
                alt="Alpha Guyasa"
                fill
                // The image box is 80.8% of the portrait column (max 420px, 470px at xl).
                sizes="(max-width: 467px) calc(81vw - 39px), (max-width: 1289px) 340px, 380px"
                className="object-cover object-top"
                // The LCP element: load it eagerly at high priority (`priority` is deprecated in Next 16).
                loading="eager"
                fetchPriority="high"
              />
            </div>
            {/* w-max is required: an absolutely-positioned box with only `left`
                set shrinks to the space left of the container edge, which wraps
                the labels. */}
            <div className="absolute bottom-[22px] left-1/2 z-3 flex w-max -translate-x-1/2 gap-2 rounded-[60px] bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,.10)]">
              <a
                href="#projects"
                className="group flex items-center gap-2 whitespace-nowrap rounded-[40px] bg-ink py-2.5 pl-4 pr-2.5 font-display text-base font-medium text-white sm:gap-3 sm:pl-5 sm:text-lg xl:gap-4 xl:pl-7 xl:text-[22px]"
              >
                Portfolio
                <span className="flex size-8 items-center justify-center rounded-full bg-accent text-white transition-transform duration-200 group-hover:rotate-45 sm:size-[38px]">
                  <ArrowRight size={17} />
                </span>
              </a>
              <a
                href="#contact"
                className="flex items-center whitespace-nowrap rounded-[40px] px-4 py-2.5 font-display text-base font-medium text-ink transition-colors duration-200 hover:text-accent sm:px-6 sm:text-lg xl:px-[34px] xl:text-[22px]"
              >
                Hire Me
              </a>
            </div>
          </div>

          {/* Left — pull quote and the CTF result */}
          <div className="order-2 w-full max-w-[420px] text-center xl:absolute xl:left-0 xl:top-[52px] xl:order-none xl:w-[330px] xl:max-w-none xl:text-left">
            <QuoteMark className="mx-auto text-accent xl:mx-0" />
            <p className="mt-4 font-sans text-lg leading-[1.45] text-[#3A3A3A] xl:text-[22px]">
              Ships offline-first systems that keep working when the network
              doesn’t.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3.5 xl:mt-[58px] xl:justify-start">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-ink">
                <Star className="text-accent" size={26} />
              </span>
              <div className="text-left">
                <p className="font-display text-xl font-bold text-accent">
                  1st Place{" "}
                  <span className="font-semibold text-ink">University CTF</span>
                </p>
                <p className="font-sans text-[15px] text-muted">
                  Haramaya University × INSA
                </p>
              </div>
            </div>
          </div>

          {/* Right — stack chips and the social row */}
          <div className="order-3 w-full max-w-[520px] xl:absolute xl:right-0 xl:top-10 xl:order-none xl:w-[340px] xl:max-w-none">
            <ul className="flex flex-wrap justify-center gap-2.5 xl:justify-end">
              {heroChips.map((chip) =>
                chip.tone === "star" ? (
                  <li
                    key="star"
                    aria-hidden
                    className="flex size-[34px] items-center justify-center self-center rounded-full bg-accent text-white"
                  >
                    <Sparkle4 size={16} />
                  </li>
                ) : (
                  <li
                    key={chip.label}
                    className={`rounded-[40px] px-5 py-3 font-sans text-[15px] font-semibold text-white xl:px-[22px] ${
                      chip.tone === "accent" ? "bg-accent" : "bg-ink"
                    }`}
                  >
                    {chip.label}
                  </li>
                ),
              )}
            </ul>
            <div className="mt-10 text-center xl:mt-[180px] xl:text-right">
              <p className="font-sans text-base text-muted">Find Me On</p>
              <SocialLinks
                tone="ink"
                size={48}
                className="mt-3 justify-center xl:justify-end"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
