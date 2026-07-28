"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "ag-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  // The pre-paint script in layout.tsx already set the attribute; adopt it here.
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — theme just won't persist */
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour scheme"
      className="ml-2 grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-[2px] border border-rule bg-transparent font-mono text-xs transition-colors duration-240 hover:border-accent hover:text-accent"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
