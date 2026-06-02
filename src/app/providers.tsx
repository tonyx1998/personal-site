"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemePref = "light" | "dark" | "auto";
type Resolved = "light" | "dark";

type ThemeContextValue = {
  /** The user's stored preference: light, dark, or auto (time-based). */
  pref: ThemePref;
  /** The theme actually applied right now (auto resolved against the clock). */
  resolved: Resolved;
  setPref: (p: ThemePref) => void;
  /** Cycle light → dark → auto → light. */
  cycle: () => void;
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
  const [pref, setPrefState] = useState<ThemePref>(initialPref);
  const [resolved, setResolved] = useState<Resolved>(() => resolve(initialPref));

  // Persist the preference and apply the resolved theme whenever pref changes.
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
    pref,
    resolved,
    setPref: setPrefState,
    cycle: () =>
      setPrefState((p) => (p === "light" ? "dark" : p === "dark" ? "auto" : "light")),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      pref: "dark" as ThemePref,
      resolved: "dark" as Resolved,
      setPref: () => {},
      cycle: () => {},
    };
  }
  return ctx;
}
