"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Image as ImageIcon, LayoutDashboard, Plus, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import type { NavSection } from "@/lib/content";

const ADMIN_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/new", label: "New page", icon: Plus },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function CommandPalette({ nav, showAdmin = false }: { nav: NavSection[]; showAdmin?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [shortcut, setShortcut] = useState("Ctrl K");

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("⌘K");

    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Search pages"
      >
        <Search />
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-1 hidden rounded border border-border px-1.5 font-mono text-[10px] sm:inline">{shortcut}</kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          {nav.map((section) => (
            <CommandGroup key={section.name || "start"} heading={section.name || "Start"}>
              {section.items.map((item) => (
                <CommandItem
                  key={item.key}
                  value={`${item.title} ${item.description} ${item.key}`}
                  onSelect={() => go(item.href)}
                >
                  <FileText />
                  <span className="truncate">{item.title}</span>
                  {item.description && (
                    <span className="ml-auto hidden truncate pl-4 text-xs text-muted-foreground md:block">
                      {item.description}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          {showAdmin && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Admin">
                {ADMIN_ITEMS.map(({ href, label, icon: Icon }) => (
                  <CommandItem key={href} value={`admin ${label}`} onSelect={() => go(href)}>
                    <Icon />
                    {label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
