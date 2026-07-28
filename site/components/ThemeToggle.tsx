"use client";

import { setTheme, useTheme } from "@/lib/hooks";

export default function ThemeToggle() {
  const theme = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle colour scheme"
      className="ml-2 grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-[2px] border border-rule bg-transparent font-mono text-xs transition-colors duration-240 hover:border-accent hover:text-accent"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
