// src/hooks/useTheme.ts (placeholder for demonstration)
import { useEffect, useState } from "react";
export const useTheme = () => {
  // In your real app, this would come from your ThemeContext
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return { theme, toggleTheme };
};
