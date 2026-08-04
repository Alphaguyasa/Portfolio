"use client";

import { useEffect, useState } from "react";
import { Close, Menu } from "@/components/icons";
import { Container, Logo } from "@/components/ui";
import { navLinks } from "@/data/site";

const sectionIds = navLinks.map((l) => l.href.slice(1));

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section currently owns the top third of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: [0.15, 0.5, 0.9] },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    // At rest the bar sits on the hero's grey, as designed. Once scrolled it has to
    // go transparent, or the grey band travels down over the white sections.
    <div
      className={`sticky top-0 z-50 pb-3 pt-[18px] transition-colors duration-300 ${
        // The blur softens content sliding through the strips above and below the pill.
        scrolled ? "bg-transparent backdrop-blur-md" : "bg-surface-alt"
      }`}
    >
      <Container>
        <nav
          aria-label="Primary"
          className="flex items-center justify-between rounded-[60px] bg-white p-3.5 shadow-[0_2px_18px_rgba(0,0,0,.05)]"
        >
          <a href="#home" className="pl-1.5" aria-label="Alpha Guyasa — home">
            <Logo />
          </a>

          <div className="hidden items-center gap-[34px] font-sans text-base font-medium xl:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`border-b-[1.5px] pb-0.5 transition-colors duration-200 ${
                    isActive
                      ? "border-accent text-accent"
                      : "border-transparent text-ink hover:text-accent"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-[40px] bg-ink px-8 py-4 font-sans text-base font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:block"
            >
              Contact Me
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex size-11 items-center justify-center rounded-full bg-ink text-white xl:hidden"
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="absolute inset-x-0 top-full px-6 pt-3 xl:hidden"
      >
        <div className="rounded-[28px] bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,.14)]">
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3.5 font-sans text-lg font-medium text-ink hover:bg-surface-alt"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-[40px] bg-ink px-6 py-4 text-center font-sans text-base font-semibold text-white"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
