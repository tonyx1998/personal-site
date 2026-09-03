"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type ThemePref = "light" | "dark" | "auto";
type Resolved = "light" | "dark";

type ThemeContextValue = {
  /** The theme currently applied. "auto" resolves to the system preference. */
  theme: Resolved;
  /** Flip to the opposite of the current theme, saved as an explicit choice. */
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_CHANGE_EVENT = "portfolio-theme-change";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readThemePreference(): ThemePref {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return "auto";
}

function subscribeToThemePreference(onStoreChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  media.addEventListener("change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    media.removeEventListener("change", onStoreChange);
  };
}

function readResolvedTheme(): Resolved {
  const pref = readThemePreference();
  if (pref !== "auto") return pref;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function saveThemePreference(pref: ThemePref) {
  try {
    localStorage.setItem("theme", pref);
  } catch {}
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Server snapshot is "light", matching the un-classed <html> the server
  // sends. The bootstrap script in layout.tsx has already applied the real
  // theme before hydration, so the class is correct even before this runs.
  const theme = useSyncExternalStore(
    subscribeToThemePreference,
    readResolvedTheme,
    () => "light" as Resolved
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    toggle: () => saveThemePreference(theme === "dark" ? "light" : "dark"),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: "light" as Resolved, toggle: () => {} };
  }
  return ctx;
}
