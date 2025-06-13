// src/components/layout/ThemeToggle.tsx
import { useTheme } from "../../hooks/useTheme"; // Adjust path if needed
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; // npm install @heroicons/react

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle">
      <input
        type="checkbox"
        onChange={toggleTheme}
        checked={theme === "dark"}
      />
      {/* Sun icon */}

      <SunIcon className="swap-on size-5" />
      {/* Moon icon */}

      <MoonIcon className="swap-off size-5" />
    </label>
  );
}
