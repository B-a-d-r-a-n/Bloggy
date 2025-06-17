import { useEffect, useState } from "react";

const AVAILABLE_THEMES = ["garden", "dracula"];

export const useTheme = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || AVAILABLE_THEMES[0]
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Cycle through all themes
  const toggleTheme = () => {
    const currentIndex = AVAILABLE_THEMES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % AVAILABLE_THEMES.length;
    setTheme(AVAILABLE_THEMES[nextIndex]);
  };

  // Set specific theme
  const setSpecificTheme = (themeName: string) => {
    if (AVAILABLE_THEMES.includes(themeName)) {
      setTheme(themeName);
    }
  };

  return {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    availableThemes: AVAILABLE_THEMES,
  };
};
