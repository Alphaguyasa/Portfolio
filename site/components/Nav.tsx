"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#craft", label: "Craft" },
  { href: "#record", label: "Record" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-bg/82 backdrop-blur-[14px]">
      <nav className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-6 px-7">
        <a
          href="#top"
          onClick={() => setOpen(false)}
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

          <button
            type="button"
            onClick={() => setOpen((wasOpen) => !wasOpen)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-[2px] border border-rule font-mono text-xs transition-colors duration-240 hover:border-accent hover:text-accent sm:hidden"
          >
            {open ? "✕" : "☰"}
          </button>

          <ThemeToggle />

          {/* Below sm this lives in the panel instead, so the bar stays uncramped. */}
          <a
            href="#contact"
            className="ml-1.5 hidden rounded-[2px] bg-ink px-[15px] py-[9px] text-[13px] font-medium text-bg transition-colors duration-240 hover:bg-accent hover:text-on-accent sm:block"
          >
            Get in touch
          </a>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-rule bg-bg sm:hidden">
          <div className="mx-auto flex max-w-[1180px] flex-col px-7 py-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-rule py-[14px] font-mono text-[13px] tracking-[0.1em] uppercase transition-colors duration-240 hover:text-accent"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="my-3 rounded-[2px] bg-ink px-[15px] py-[13px] text-center text-[14px] font-medium text-bg transition-colors duration-240 hover:bg-accent hover:text-on-accent"
            >
              Get in touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
