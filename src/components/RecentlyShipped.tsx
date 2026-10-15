import Link from "next/link";
import { Accent, Container, Eyebrow, SectionTitle } from "@/components/ui";
import { formatDate } from "@/lib/projects";
import { KIND_LABEL, shipped } from "@/lib/shipped";

const SHOWN = 8;

export default function RecentlyShipped() {
  const items = shipped.slice(0, SHOWN);
  if (items.length === 0) return null;

  return (
    <section id="shipped" aria-labelledby="shipped-title" className="bg-surface pb-20 xl:pb-25">
      <Container>
        <Eyebrow>Recently Shipped</Eyebrow>
        <SectionTitle className="max-w-[760px]">
          <span id="shipped-title">
            What I Merged <Accent>Lately</Accent>
          </span>
        </SectionTitle>
        <p className="mt-4 max-w-[680px] font-sans text-base leading-[1.6] text-body xl:text-[17px]">
          Merged pull requests and release tags from the public repositories, refreshed by the
          daily sync.
        </p>

        <ol className="mt-8 divide-y divide-hairline rounded-3xl bg-surface-alt px-5.5 xl:px-8">
          {items.map((item) => (
            <li
              key={item.url}
              className="grid gap-1.5 py-4.5 font-sans sm:grid-cols-[120px_180px_minmax(0,1fr)] sm:items-baseline sm:gap-5"
            >
              <time dateTime={item.date} className="text-sm text-muted">
                {formatDate(item.date)}
              </time>
              <Link
                href={`/projects/${item.slug}`}
                className="text-[15px] font-semibold text-ink hover:text-accent"
              >
                {item.project}
              </Link>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[15px] leading-[1.5] text-body hover:text-accent xl:text-base"
              >
                <span className="mr-2 inline-block rounded-[40px] bg-white px-2.5 py-0.5 text-xs font-semibold text-muted2 ring-1 ring-hairline">
                  {KIND_LABEL[item.kind]}
                </span>
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
