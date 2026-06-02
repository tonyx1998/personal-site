"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 inline-flex items-center justify-center w-9 h-9"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {mounted ? (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />) : null}
    </button>
  );
}
