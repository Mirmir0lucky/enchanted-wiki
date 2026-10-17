"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { NavSection } from "@/lib/content";

type SidebarProps = {
  nav: NavSection[];
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ nav, className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const sections = useMemo(() => {
    if (!q) return nav;
    return nav
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.title.toLowerCase().includes(q)),
      }))
      .filter((section) => section.items.length > 0);
  }, [nav, q]);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search pages"
          aria-label="Search pages"
          className="pl-9"
        />
      </div>

      {sections.length === 0 && <p className="text-sm text-muted-foreground">No pages found.</p>}

      {sections.map((section) => (
        <div key={section.name || "root"} className="space-y-1">
          {section.name && (
            <p className="px-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {section.name}
            </p>
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-accent font-medium text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
