import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps, ReactNode } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider> & {
  children: ReactNode;
};

/**
 * Thin wrapper around next-themes' provider with sensible Vesper defaults:
 * - `attribute="class"` so Tailwind's `dark:` variant works against the
 *   `.dark` selector defined in `index.css`.
 * - `defaultTheme="system"` so dark-OS visitors see the dark palette without
 *   having to interact with a toggle first.
 * - `enableSystem` keeps the OS preference live alongside the explicit
 *   user choice persisted to localStorage.
 * - `disableTransitionOnChange` avoids the cross-theme flash on toggle.
 *
 * The matching anti-FOUC bootstrap lives inline at the top of `index.html`
 * so the correct theme is applied before the React tree paints.
 */
const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    {...props}
  >
    {children}
  </NextThemesProvider>
);

export default ThemeProvider;
