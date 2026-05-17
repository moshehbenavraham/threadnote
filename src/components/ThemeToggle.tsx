import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Compact light/dark toggle pinned to the right side of the primary header.
 *
 * We render a stable placeholder until next-themes has hydrated so the
 * initial server-rendered markup (and the anti-FOUC bootstrap script in
 * `index.html`) doesn't mismatch with the client-rendered icon.
 */
const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseClasses =
    "inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-200";

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={`${baseClasses} opacity-0 pointer-events-none`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={baseClasses}
    >
      {isDark ? (
        <Sun className="w-4 h-4" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
