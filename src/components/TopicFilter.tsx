import { cn } from "@/lib/utils";
import type { Topic } from "@/data/articles";

interface TopicFilterProps {
  topics: readonly Topic[];
  active: Topic | "all";
  onChange: (topic: Topic | "all") => void;
  className?: string;
}

/**
 * Horizontal row of pill-shaped topic chips. The currently-selected chip is
 * filled; the rest are transparent and inherit the editorial outline style
 * used elsewhere in the site (matches Button transparent variant).
 */
const TopicFilter = ({
  topics,
  active,
  onChange,
  className = "",
}: TopicFilterProps) => {
  const base =
    "uppercase font-bold text-xs tracking-[1.8px] py-2 px-5 rounded-full border-2 border-foreground transition-all duration-200 whitespace-nowrap";

  const inactive =
    "bg-transparent text-foreground hover:bg-foreground hover:text-background";

  const activeCls =
    "bg-foreground text-background hover:bg-foreground/90";

  return (
    <nav
      aria-label="Filter articles by topic"
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 md:gap-3",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange("all")}
        aria-pressed={active === "all"}
        className={cn(base, active === "all" ? activeCls : inactive)}
      >
        All
      </button>
      {topics.map((topic) => {
        const isActive = active === topic;
        return (
          <button
            type="button"
            key={topic}
            onClick={() => onChange(topic)}
            aria-pressed={isActive}
            className={cn(base, isActive ? activeCls : inactive)}
          >
            {topic}
          </button>
        );
      })}
    </nav>
  );
};

export default TopicFilter;
