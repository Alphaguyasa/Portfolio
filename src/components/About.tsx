import Image from "next/image";
import { Envelope, MapPin, Shield, Star } from "@/components/icons";
import { Accent, Container, Eyebrow, SectionTitle } from "@/components/ui";
import { site, stats } from "@/data/site";

export default function About() {
  return (
    <section id="about" className="bg-surface-alt py-20 xl:py-25">
      <Container className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        {/* Photo over the orange arch, with two floating cards */}
        <div className="relative mx-auto h-[420px] w-full max-w-[420px] lg:mx-0 lg:h-[500px] lg:max-w-none">
          <div className="absolute inset-y-0 inset-x-[14%] rounded-t-[200px] rounded-b-3xl bg-accent" />
          <div className="absolute inset-x-[17%] bottom-0 top-3.5 z-2 overflow-hidden rounded-t-[188px] rounded-b-[18px]">
            <Image
              src="/assets/about-portrait.jpg"
              alt="Alpha Guyasa in graduation dress"
              fill
              sizes="(max-width: 1023px) 420px, 500px"
              className="object-cover object-top"
            />
          </div>

          <div className="absolute left-0 top-14 z-3 rounded-[22px] bg-white px-6 py-4 text-center shadow-[0_10px_30px_rgba(0,0,0,.08)]">
            <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-accent text-white">
              <Shield size={20} />
            </span>
            <p className="mt-2 font-sans text-sm text-muted">Public Repos</p>
            <p className="font-display text-[26px] font-bold">8</p>
          </div>

          <div className="absolute bottom-8 left-[12%] z-3 flex items-center gap-3 rounded-[40px] bg-white py-2.5 pl-3 pr-5 shadow-[0_10px_30px_rgba(0,0,0,.08)]">
            <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-ink text-white">
              <Star size={16} />
            </span>
            <span className="whitespace-nowrap font-sans text-[15px] font-semibold xl:text-[17px]">
              BSc Computer Science
            </span>
          </div>
        </div>

        <div>
          <Eyebrow>About Me</Eyebrow>
          <SectionTitle>
            Who is <Accent>Alpha Guyasa?</Accent>
          </SectionTitle>
          <p className="mt-4.5 max-w-[620px] text-pretty font-sans text-[17px] leading-[1.6] text-body xl:text-[19px]">
            A full-stack engineer in Addis Ababa working across web, Android and
            AI retrieval. Most of my work targets one constraint: bad
            connectivity. Offline-first ledgers, point-of-sale that keeps
            selling through a blackout, and retrieval systems that cite their
            sources or say nothing.
          </p>

          <dl className="mt-8 flex flex-wrap gap-10 xl:gap-15">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-3xl font-bold xl:text-[38px]">
                  {stat.value}
                </dd>
                <dt className="font-sans text-base text-muted xl:text-[17px]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3.5 rounded-[40px] bg-white py-3 pl-3 pr-6 font-sans text-[15px] font-medium text-ink transition-transform duration-200 hover:-translate-y-0.5 xl:text-[17px]"
            >
              <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <Envelope size={19} />
              </span>
              {site.email}
            </a>
            <p className="flex items-center gap-3.5 rounded-[40px] bg-white py-3 pl-3 pr-6 font-sans text-[15px] font-medium xl:text-[17px]">
              <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <MapPin size={19} />
              </span>
              {site.location}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
