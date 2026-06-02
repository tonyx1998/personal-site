"use client";

import { useEffect, useState } from "react";
import { Clock, Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers";

const LABEL = {
  light: "Light",
  dark: "Dark",
  auto: "Auto · matches time of day",
} as const;

export default function ThemeToggle() {
  const { pref, cycle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const Icon = pref === "auto" ? Clock : pref === "dark" ? Moon : Sun;

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 inline-flex items-center justify-center w-9 h-9"
      aria-label={mounted ? `Theme: ${LABEL[pref]}. Click to change.` : "Toggle theme"}
      title={mounted ? LABEL[pref] : undefined}
      suppressHydrationWarning
    >
      {mounted ? <Icon size={18} /> : null}
    </button>
  );
}
