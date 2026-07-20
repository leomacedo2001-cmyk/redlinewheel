import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {c.to && !isLast ? (
                <Link
                  to={c.to as ComponentProps<typeof Link>["to"]}
                  params={c.params as ComponentProps<typeof Link>["params"]}
                  className="hover:text-primary transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground" : ""}>{c.label}</span>
              )}
              {!isLast && <ChevronRight className="h-3 w-3 opacity-50" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
