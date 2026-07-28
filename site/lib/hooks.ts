"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ag-theme";

/*
 * Both of these read state that lives outside React — a media query and an
 * attribute on <html>. useSyncExternalStore is the right tool: it gives a
 * correct server snapshot and avoids the cascading render that a
 * setState-in-an-effect would cause.
 */

let motionQuery: MediaQueryList | null = null;

function getMotionQuery() {
  if (typeof window === "undefined") return null;
  motionQuery ??= window.matchMedia("(prefers-reduced-motion: reduce)");
  return motionQuery;
}

function subscribeMotion(onChange: () => void) {
  const query = getMotionQuery();
  query?.addEventListener("change", onChange);
  return () => query?.removeEventListener("change", onChange);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => getMotionQuery()?.matches ?? false,
    () => false,
  );
}

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/** Reads the attribute the pre-paint script in layout.tsx set. */
export function useTheme(): Theme {
  return useSyncExternalStore(
    subscribeTheme,
    () => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"),
    () => "light",
  );
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private mode — theme just won't persist */
  }
}
