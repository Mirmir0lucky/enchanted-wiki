"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CommandPalette } from "@/components/wiki/command-palette";
import { Sidebar } from "@/components/wiki/sidebar";
import { SiteNavMenu } from "@/components/wiki/site-nav-menu";
import type { NavSection } from "@/lib/content";

export function WikiHeader({ nav, siteName }: { nav: NavSection[]; siteName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex h-14 items-center gap-2 px-4 md:gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="pt-14">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="overflow-y-auto">
              <Sidebar nav={nav} onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </span>
          <span className="hidden sm:inline">{siteName}</span>
        </Link>

        <div className="hidden md:block">
          <SiteNavMenu nav={nav} />
        </div>

        <div className="ml-auto">
          <CommandPalette nav={nav} />
        </div>
      </div>
    </header>
  );
}
