import { useTheme } from "../../hooks/useTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
const DARK_THEMES = ["dracula", "dark", "night", "black", "luxury", "sunset"];
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = DARK_THEMES.includes(theme);
  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle">
      <input type="checkbox" onChange={toggleTheme} checked={isDarkTheme} />
      <SunIcon className="swap-on size-5" />
      <MoonIcon className="swap-off size-5" />
    </label>
  );
}