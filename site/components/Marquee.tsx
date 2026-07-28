import { marqueeItems } from "@/lib/data";

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex gap-11 px-[22px] py-[13px] font-mono text-xs tracking-[0.1em] whitespace-nowrap uppercase text-muted"
    >
      {marqueeItems.map((item) => (
        <span key={item} className="contents">
          <span>{item}</span>
          <span className="text-accent">◆</span>
        </span>
      ))}
    </div>
  );
}

/** Doubled track translated -50% — the seam is invisible because both halves match. */
export default function Marquee() {
  return (
    <div className="mt-16 overflow-hidden border-y border-rule bg-bg2">
      <div className="flex w-max animate-ticker">
        <Track />
        <Track hidden />
      </div>
    </div>
  );
}
