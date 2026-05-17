import { NavLink, Link } from "react-router-dom";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { label: "Essays", to: "/" },
  { label: "About", to: "/about" },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-foreground/5">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-sans focus:uppercase focus:tracking-wider"
      >
        Skip to content
      </a>
      <div className="px-5 md:px-20 py-5 md:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-2xl md:text-3xl font-bold italic"
            aria-label="Vesper home"
          >
            Vesper
          </Link>

          {/* Center Nav */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 lg:gap-8"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "font-sans uppercase font-bold text-xs tracking-[1.8px] hover:opacity-70 transition-opacity",
                    isActive && "underline decoration-2 underline-offset-[6px]"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <a href="#newsletter" aria-label="Subscribe to the newsletter">
              <Button
                variant="filled"
                showArrow={false}
                className="text-xs py-2 px-5"
              >
                SUBSCRIBE
              </Button>
            </a>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav
          aria-label="Primary mobile"
          className="md:hidden mt-4 flex items-center justify-center gap-6"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "font-sans uppercase font-bold text-[11px] tracking-[1.6px] hover:opacity-70 transition-opacity",
                  isActive && "underline decoration-2 underline-offset-[6px]"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
