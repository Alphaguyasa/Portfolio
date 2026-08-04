import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "@/components/icons";
import { Container, Logo } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-surface-alt">
      <Container className="pt-[18px]">
        <Link href="/" aria-label="Alpha Guyasa — home" className="inline-block">
          <Logo />
        </Link>
      </Container>

      <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-[92px] font-extrabold leading-none tracking-[-3px] text-accent sm:text-[140px]">
          404
        </p>
        <h1 className="mt-4 font-display text-[30px] font-bold tracking-[-0.6px] sm:text-[42px]">
          This page doesn’t exist
        </h1>
        <p className="mt-4 max-w-[460px] font-sans text-[17px] leading-[1.6] text-body">
          The portfolio is a single page — whatever you were after is most likely
          somewhere on it.
        </p>
        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-3.5 rounded-[60px] bg-ink py-[7px] pl-0 pr-[7px] transition-shadow duration-200 hover:shadow-[0_10px_28px_rgba(0,0,0,.18)]"
        >
          <span className="rounded-[60px] bg-accent px-[30px] py-[15px] font-sans text-base font-semibold text-white">
            Back to the portfolio
          </span>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-200 group-hover:rotate-45">
            <ArrowRight size={18} />
          </span>
        </Link>
      </Container>
    </main>
  );
}
