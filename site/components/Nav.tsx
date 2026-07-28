import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#craft", label: "Craft" },
  { href: "#record", label: "Record" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-bg/82 backdrop-blur-[14px]">
      <nav className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-6 px-7">
        <a
          href="#top"
          className="flex items-baseline gap-[9px] font-mono text-[12.5px] tracking-[0.1em] uppercase"
        >
          <span className="inline-block h-[7px] w-[7px] rounded-full bg-accent" />
          <span className="font-medium">A. Guyasa</span>
          <span className="text-muted">/ eng</span>
        </a>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-[2px] text-[13.5px] sm:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-[2px] px-[11px] py-2 transition-colors duration-240 hover:bg-bg2 hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>

          <ThemeToggle />

          <a
            href="#contact"
            className="ml-1.5 rounded-[2px] bg-ink px-[15px] py-[9px] text-[13px] font-medium text-bg transition-colors duration-240 hover:bg-accent hover:text-on-accent"
          >
            Get in touch
          </a>
        </div>
      </nav>
    </header>
  );
}
