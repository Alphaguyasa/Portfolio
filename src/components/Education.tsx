import type { ReactNode } from "react";
import { Briefcase, GraduationCap } from "@/components/icons";
import { Accent, Container, Eyebrow, SectionTitle } from "@/components/ui";
import { education, work, type TimelineRow } from "@/data/site";

function TimelineCard({
  icon,
  title,
  rows,
}: {
  icon: ReactNode;
  title: string;
  rows: TimelineRow[];
}) {
  return (
    <div className="rounded-3xl bg-white px-7 py-8 xl:px-9 xl:py-[34px]">
      <div className="flex items-center gap-4.5 border-b border-hairline pb-[22px]">
        <span className="flex size-13 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          {icon}
        </span>
        <h3 className="font-display text-2xl font-bold xl:text-[30px]">
          {title}
        </h3>
      </div>

      <ul>
        {rows.map((row, i) => (
          <li
            key={row.title}
            className={`flex flex-wrap items-center justify-between gap-4 py-6 sm:flex-nowrap ${
              i > 0 ? "border-t border-hairline" : ""
            } ${i === rows.length - 1 ? "pb-0" : ""}`}
          >
            <div>
              <p className="font-display text-xl font-bold xl:text-2xl">
                {row.title}
              </p>
              <p className="mt-1 font-sans text-base text-muted xl:text-[17px]">
                {row.subtitle}
              </p>
            </div>
            <span
              className={`whitespace-nowrap rounded-[40px] px-6 py-3 font-sans text-[15px] font-medium text-white xl:text-base ${
                row.pillTone === "accent" ? "bg-accent" : "bg-ink"
              }`}
            >
              {row.pill}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Education() {
  return (
    <section className="bg-surface-alt py-20 xl:py-25">
      <Container className="text-center">
        <div className="inline-block">
          <Eyebrow center>Education &amp; Work</Eyebrow>
        </div>
        <SectionTitle>
          My <Accent>Education</Accent> &amp; <Accent>Work Experience</Accent>
        </SectionTitle>

        <div className="mt-10 grid gap-8 text-left lg:grid-cols-2 xl:mt-12">
          <TimelineCard
            icon={<GraduationCap size={24} />}
            title="Education"
            rows={education}
          />
          <TimelineCard
            icon={<Briefcase size={24} />}
            title="Work Experience"
            rows={work}
          />
        </div>
      </Container>
    </section>
  );
}
