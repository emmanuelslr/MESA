"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // Dark mode par défaut
  const [mounted, setMounted] = useState(false);

  // Initialiser le thème au montage du composant
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    
    // Par défaut, on utilise le mode dark si aucune préférence n'est sauvegardée
    const shouldBeDark = savedTheme === "dark" || (!savedTheme);
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Éviter le flash de contenu non stylisé
  if (!mounted) {
    return (
      <div className="w-14 h-7 rounded-full bg-muted flex items-center justify-center">
        <div className="w-5 h-5" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-slate-700 dark:to-slate-800"
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`${
          isDark ? "translate-x-7" : "translate-x-1"
        } inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-slate-700" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500" />
        )}
      </span>
    </button>
  );
}

