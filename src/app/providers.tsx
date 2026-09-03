"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

export type ThemePref = "light" | "dark" | "auto";
type Resolved = "light" | "dark";

type ThemeContextValue = {
  /** The theme currently applied (auto resolved against the local clock). */
  theme: Resolved;
  /** Flip to the opposite of the current theme, as an explicit override. */
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_CHANGE_EVENT = "portfolio-theme-change";

function readThemePreference(): ThemePref {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark" || saved === "auto") {
      return saved;
    }
  } catch {}
  return "auto";
}

function subscribeToThemePreference(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

function saveThemePreference(pref: ThemePref) {
  try {
    localStorage.setItem("theme", pref);
  } catch {}
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

// Dark between 7pm and 7am local time, light otherwise. Kept in sync with the
// inline FOUC script in layout.tsx — change both together.
export function timeBasedTheme(d = new Date()): Resolved {
  const h = d.getHours();
  return h >= 19 || h < 7 ? "dark" : "light";
}

export function Providers({
  children,
  initialPref,
}: {
  children: React.ReactNode;
  initialPref: ThemePref;
}) {
  // Preference is light/dark/auto; the default is auto, which follows the clock
  // until the visitor picks a theme with the toggle.
  const pref = useSyncExternalStore(
    subscribeToThemePreference,
    readThemePreference,
    () => initialPref
  );
  const [autoTick, setAutoTick] = useState(0);

  const resolved = useMemo((): Resolved => {
    if (pref !== "auto") return pref;
    void autoTick;
    return timeBasedTheme();
  }, [pref, autoTick]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [resolved]);

  useEffect(() => {
    if (pref !== "auto") return;
    const id = setInterval(() => setAutoTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, [pref]);

  const value: ThemeContextValue = {
    theme: resolved,
    // Picking a theme exits auto and locks to the chosen one.
    toggle: () => saveThemePreference(resolved === "dark" ? "light" : "dark"),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: "dark" as Resolved, toggle: () => {} };
  }
  return ctx;
}
