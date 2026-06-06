"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemePref = "light" | "dark" | "auto";
type Resolved = "light" | "dark";

type ThemeContextValue = {
  /** The theme currently applied (auto resolved against the local clock). */
  theme: Resolved;
  /** Flip to the opposite of the current theme, as an explicit override. */
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

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
  const [pref, setPref] = useState<ThemePref>(initialPref);
  const [autoTick, setAutoTick] = useState(0);

  const resolved = useMemo((): Resolved => {
    if (pref !== "auto") return pref;
    void autoTick;
    return timeBasedTheme();
  }, [pref, autoTick]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.cookie = `theme=${pref}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    try {
      localStorage.setItem("theme", pref);
    } catch {}
  }, [pref, resolved]);

  useEffect(() => {
    if (pref !== "auto") return;
    const id = setInterval(() => setAutoTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, [pref]);

  const value: ThemeContextValue = {
    theme: resolved,
    // Picking a theme exits auto and locks to the chosen one.
    toggle: () => setPref(resolved === "dark" ? "light" : "dark"),
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
