import type { Heading } from "@/lib/content";
import { cn } from "@/lib/utils";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">On this page</p>
      <ul className="space-y-2 border-l border-border">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "-ml-px block border-l border-transparent py-0.5 text-sm text-muted-foreground transition-colors hover:border-white/40 hover:text-foreground",
                heading.level === 2 ? "pl-3" : "pl-6",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
