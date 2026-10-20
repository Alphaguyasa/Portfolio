/**
 * Two identical tracks side by side, both sliding 0 → -100%; the duplicate is what
 * makes the loop seamless. `overflow-hidden` belongs on the band, never the page.
 * The copy is decorative repetition, so the second track is hidden from a11y tree.
 * The sparkle after each item is drawn by CSS (`.marquee-item`), not an inline SVG,
 * which keeps about a hundred elements out of the home page's hydration.
 */
export default function Marquee({ items }: { items: readonly string[] }) {
  const track = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="animate-marquee flex shrink-0 items-center gap-8 pr-8 xl:gap-14 xl:pr-14"
    >
      {items.map((item) => (
        <span
          key={item}
          className="marquee-item flex items-center gap-8 whitespace-nowrap font-display text-xl font-bold text-white xl:gap-14 xl:text-[28px]"
        >
          {item}
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
