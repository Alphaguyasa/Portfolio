import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, GitHub, LinkedIn, Envelope } from "@/components/icons";
import { site } from "@/data/site";

/** 1240px content container with the design's 24px side padding. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1240px] px-6 ${className}`}>
      {children}
    </div>
  );
}

/** The label that opens every section. */
export function Eyebrow({
  children,
  center = false,
  large = false,
}: {
  children: ReactNode;
  center?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}
    >
      <span
        className={`font-sans font-medium ${large ? "text-lg xl:text-[22px]" : "text-[15px] xl:text-[17px]"}`}
      >
        {children}
      </span>
    </div>
  );
}

/** Section H2 — Archivo 700 52px at desktop, stepped down below. */
export function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`mt-2 font-display text-[30px] font-bold tracking-[-0.6px] sm:text-[36px] md:text-[42px] xl:text-[52px] xl:tracking-[-1.2px] ${className}`}
    >
      {children}
    </h2>
  );
}

/** Orange italic run used inside headings. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="italic text-accent">{children}</span>;
}

/**
 * The repeating CTA: black shell, orange inner pill, white arrow circle.
 * Used in Services, Portfolio, Pricing, Notes and the Footer with different labels.
 */
export function CtaPill({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const inner = (
    <>
      <span className="rounded-[60px] bg-accent px-6 py-[15px] font-sans text-[15px] font-semibold text-white xl:px-[30px] xl:text-base">
        {label}
      </span>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-200 group-hover:rotate-45">
        <ArrowRight size={18} />
      </span>
    </>
  );
  const classes = `group inline-flex shrink-0 items-center gap-3.5 rounded-[60px] bg-ink py-[7px] pl-0 pr-[7px] transition-shadow duration-200 hover:shadow-[0_10px_28px_rgba(0,0,0,.18)] ${className}`;

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

type SocialTone = "ink" | "accent" | "white";

const socialToneClass: Record<SocialTone, string> = {
  ink: "bg-ink text-white",
  accent: "bg-accent text-white",
  white: "bg-white text-accent",
};

/**
 * LinkedIn / GitHub / LeetCode / Email circles. LeetCode has no glyph in the design —
 * it is an "LC" text lockup.
 */
export function SocialLinks({
  tone,
  size,
  iconSize = 20,
  includeEmail = true,
  className = "",
}: {
  tone: SocialTone;
  size: number;
  iconSize?: number;
  includeEmail?: boolean;
  className?: string;
}) {
  const circle = `flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 ${socialToneClass[tone]}`;
  const style = { width: size, height: size };

  return (
    <div className={`flex gap-3 ${className}`}>
      <a
        href={site.linkedin}
        target="_blank"
        rel="noreferrer noopener"
        className={circle}
        style={style}
        aria-label="Alpha Guyasa on LinkedIn"
      >
        <LinkedIn size={iconSize} />
      </a>
      <a
        href={site.github}
        target="_blank"
        rel="noreferrer noopener"
        className={circle}
        style={style}
        aria-label="Alpha Guyasa on GitHub"
      >
        <GitHub size={iconSize} />
      </a>
      <a
        href={site.leetcode}
        target="_blank"
        rel="noreferrer noopener"
        className={`${circle} font-display font-bold`}
        style={{ ...style, fontSize: Math.round(size * 0.31) }}
        aria-label="Alpha Guyasa on LeetCode"
      >
        LC
      </a>
      {includeEmail && (
        <a
          href={`mailto:${site.email}`}
          className={circle}
          style={style}
          aria-label={`Email ${site.email}`}
        >
          <Envelope size={iconSize} />
        </a>
      )}
    </div>
  );
}

/** The "A" circle + "Alpha." wordmark used in the nav and footer. */
export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent font-display text-[22px] font-extrabold text-white">
        A
      </span>
      <span className="font-display text-[26px] font-bold tracking-[-0.5px]">
        Alpha<span className="text-accent">.</span>
      </span>
    </div>
  );
}
