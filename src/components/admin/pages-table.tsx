"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";

export type PageRow = {
  key: string;
  title: string;
  description: string;
  href: string;
  section: string;
};

export function PagesTable({ rows, hoverPreviews }: { rows: PageRow[]; hoverPreviews: boolean }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => `${row.title} ${row.key} ${row.description}`.toLowerCase().includes(q));
  }, [rows, query]);

  if (rows.length === 0) {
    return (
      <Empty>
        <EmptyMedia>
          <FileX />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No pages yet</EmptyTitle>
          <EmptyDescription>Create your first page to start the wiki.</EmptyDescription>
        </EmptyHeader>
        <Button asChild>
          <Link href="/admin/new">New page</Link>
        </Button>
      </Empty>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter pages"
          aria-label="Filter pages"
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No pages match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {filtered.map((row) => {
            const title = (
              <Link href={`/admin/edit/${row.key}`} className="truncate font-medium hover:underline">
                {row.title}
              </Link>
            );
            return (
              <li key={row.key} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  {hoverPreviews && row.description ? (
                    <HoverCard openDelay={150}>
                      <HoverCardTrigger asChild>{title}</HoverCardTrigger>
                      <HoverCardContent align="start" className="w-80">
                        <p className="font-medium">{row.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{row.description}</p>
                        <p className="mt-3 font-mono text-xs text-muted-foreground">{row.href}</p>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    title
                  )}
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {row.href} · {row.section || "top level"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={row.href}>View</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/edit/${row.key}`}>Edit</Link>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
