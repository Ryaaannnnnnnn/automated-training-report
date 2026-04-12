"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 group shadow-lg"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 rounded-xl bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors" />
      
      {theme === "dark" ? (
        <Sun className="w-[18px] h-[18px] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="w-[18px] h-[18px] rotate-0 scale-100 transition-all" />
      )}
    </button>
  );
}
