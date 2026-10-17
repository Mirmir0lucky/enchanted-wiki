"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Image as ImageIcon, LayoutDashboard, LogOut, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/new", label: "New page", icon: Plus },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ siteName, logout }: { siteName: string; logout: () => Promise<void> }) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col gap-6 border-b border-border p-4 md:sticky md:top-0 md:h-dvh md:border-b-0 md:border-r md:p-5">
      <Link href="/admin" className="px-2 font-semibold tracking-tight">
        {siteName}
        <span className="ml-2 text-xs font-normal text-muted-foreground">Admin</span>
      </Link>

      <nav className="flex gap-1 overflow-x-auto md:flex-col">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 md:mt-auto">
        <Button asChild variant="ghost" size="sm" className="justify-start">
          <Link href="/">
            <ExternalLink />
            View wiki
          </Link>
        </Button>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
            <LogOut />
            Log out
          </Button>
        </form>
      </div>
    </aside>
  );
}
