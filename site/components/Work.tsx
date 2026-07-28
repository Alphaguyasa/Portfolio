"use client";

import { useState } from "react";
import Eyebrow from "./Eyebrow";
import { CATEGORIES, Category, GITHUB, projects } from "@/lib/data";

export default function Work() {
  const [filter, setFilter] = useState<Category>("All");

  const shown = projects.filter((p) => filter === "All" || p.cats.includes(filter));

  return (
    <section id="work" className="mx-auto max-w-[1180px] scroll-mt-20 px-7 pt-24">
      <div data-reveal="hidden">
        <Eyebrow index="02" label="Selected work" />

        <div className="mt-[26px] flex flex-wrap items-end justify-between gap-[22px]">
          <h2 className="max-w-[20ch] text-[clamp(34px,5.4vw,62px)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance">
            Things I&apos;ve shipped, and how they were made.
          </h2>

          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={cat === filter}
                className={`cursor-pointer rounded-[2px] border px-[13px] py-2 font-mono text-[11.5px] tracking-[0.09em] whitespace-nowrap uppercase transition-all duration-240 ${
                  cat === filter
                    ? "border-ink bg-ink text-bg"
                    : "border-rule bg-transparent text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-[34px] grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[18px]">
        {shown.map((project, i) => (
          <a
            key={project.title}
            href={project.href}
            target="_blank"
            rel="noopener"
            className="flex min-h-[280px] flex-col justify-between rounded-[3px] border border-rule bg-bg2 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-[3px] hover:border-accent"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent">
                  {project.tag}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-[18px] text-2xl leading-[1.15] font-semibold tracking-[-0.02em]">
                {project.title}
              </h3>

              <p className="mt-3 font-serif text-[17px] leading-[1.5] text-muted text-pretty">
                {project.body}
              </p>
            </div>

            <div className="mt-[22px] flex items-center justify-between border-t border-rule pt-4 font-mono text-[11.5px] tracking-[0.08em] uppercase text-muted">
              <span>{project.meta}</span>
              <span className="whitespace-nowrap text-accent">View repo ↗</span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-[18px] flex justify-end">
        <a
          href={GITHUB}
          target="_blank"
          rel="noopener"
          className="border-b border-rule pb-[3px] font-mono text-xs tracking-[0.1em] uppercase text-muted transition-colors duration-240 hover:border-accent hover:text-accent"
        >
          All repositories on GitHub ↗
        </a>
      </div>
    </section>
  );
}
