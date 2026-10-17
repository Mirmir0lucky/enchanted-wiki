import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { NavItem } from "@/lib/content";
import { cn } from "@/lib/utils";

function PageLink({ item, direction, hoverPreviews }: { item: NavItem; direction: "prev" | "next"; hoverPreviews: boolean }) {
  const isPrev = direction === "prev";
  const link = (
    <Link
      href={item.href}
      className={cn(
        "group flex flex-col rounded-xl border border-border p-4 transition-colors hover:bg-accent/40",
        !isPrev && "items-end text-right",
      )}
    >
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        {isPrev && <ChevronLeft className="size-3" />}
        {isPrev ? "Previous" : "Next"}
        {!isPrev && <ChevronRight className="size-3" />}
      </span>
      <span className="mt-1 font-medium">{item.title}</span>
    </Link>
  );

  if (!hoverPreviews || !item.description) return link;

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>{link}</HoverCardTrigger>
      <HoverCardContent align="start" className="w-72">
        <p className="font-medium">{item.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

export function PageNav({
  prev,
  next,
  hoverPreviews,
}: {
  prev: NavItem | null;
  next: NavItem | null;
  hoverPreviews: boolean;
}) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Pagination" className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
      {prev ? <PageLink item={prev} direction="prev" hoverPreviews={hoverPreviews} /> : <span />}
      {next && <PageLink item={next} direction="next" hoverPreviews={hoverPreviews} />}
    </nav>
  );
}
