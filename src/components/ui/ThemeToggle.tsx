import { useTheme } from "../../hooks/useTheme"; 
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; 
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle">
      <input
        type="checkbox"
        onChange={toggleTheme}
        checked={theme === "dark"}
      />
      {}
      <SunIcon className="swap-on size-5" />
      {}
      <MoonIcon className="swap-off size-5" />
    </label>
  );
}