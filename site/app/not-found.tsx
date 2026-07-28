import Link from "next/link";

export const metadata = {
  title: "Not found — Alpha Guyasa",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1180px] flex-col justify-center px-7 py-24">
      <div className="flex items-center gap-[14px] font-mono text-[11.5px] tracking-[0.14em] uppercase text-muted">
        <span className="text-accent">404</span>
        <span className="h-px flex-1 bg-rule" />
        <span className="whitespace-nowrap">Nothing here</span>
      </div>

      <h1 className="mt-[34px] text-[clamp(52px,10.5vw,148px)] leading-[0.86] font-semibold tracking-[-0.045em]">
        Lost the
        <br />
        <span className="inline-flex items-baseline">
          thread<span className="text-accent">.</span>
        </span>
      </h1>

      <p className="mt-8 max-w-[44ch] font-serif text-xl leading-[1.55] text-muted text-pretty">
        That page doesn&apos;t exist — or it never did. The work, the record, and a way to get in
        touch are all on the front page.
      </p>

      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-4 rounded-[2px] bg-ink px-[18px] py-[15px] text-[15px] font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-on-accent"
        >
          <span>Back to the portfolio</span>
          <span className="font-mono">→</span>
        </Link>
      </div>
    </main>
  );
}
