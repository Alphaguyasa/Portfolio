import { Sparkle4 } from "@/components/icons";

/**
 * Two identical tracks side by side, both sliding 0 → -100%; the duplicate is what
 * makes the loop seamless. `overflow-hidden` belongs on the band, never the page.
 * The copy is decorative repetition, so the second track is hidden from a11y tree.
 */
export default function Marquee({ items }: { items: readonly string[] }) {
  const track = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="animate-marquee flex shrink-0 items-center gap-8 pr-8 xl:gap-14 xl:pr-14"
    >
      {items.map((item) => (
        <span key={item} className="flex items-center gap-8 xl:gap-14">
          <span className="whitespace-nowrap font-display text-xl font-bold text-white xl:text-[28px]">
            {item}
          </span>
          <Sparkle4 className="shrink-0 text-accent" size={22} />
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex overflow-hidden bg-ink py-6">
      {track(false)}
      {track(true)}
    </div>
  );
}
