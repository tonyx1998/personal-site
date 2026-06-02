"use client";

import { createContext, useContext, useEffect, useState } from "react";

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

function resolve(pref: ThemePref): Resolved {
  return pref === "auto" ? timeBasedTheme() : pref;
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
  const [resolved, setResolved] = useState<Resolved>(() => resolve(initialPref));

  // Apply + persist whenever the preference changes.
  useEffect(() => {
    const next = resolve(pref);
    setResolved(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.cookie = `theme=${pref}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    try {
      localStorage.setItem("theme", pref);
    } catch {}
  }, [pref]);

  // In auto mode, re-check the clock every minute so the theme flips at the
  // 7am / 7pm boundary while the tab stays open.
  useEffect(() => {
    if (pref !== "auto") return;
    const id = setInterval(() => {
      const next = timeBasedTheme();
      setResolved(next);
      document.documentElement.classList.toggle("dark", next === "dark");
    }, 60_000);
    return () => clearInterval(id);
  }, [pref]);

  const value: ThemeContextValue = {
    theme: resolved,
    // Picking a theme exits auto and locks to the chosen one.
    toggle: () => setPref(resolved === "dark" ? "light" : "dark"),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: "dark" as Resolved, toggle: () => {} };
  }
  return ctx;
}
