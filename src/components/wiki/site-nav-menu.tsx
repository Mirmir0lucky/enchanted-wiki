"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { NavSection } from "@/lib/content";

export function SiteNavMenu({ nav }: { nav: NavSection[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {nav.map((section) => (
          <NavigationMenuItem key={section.name || "start"}>
            <NavigationMenuTrigger>{section.name || "Start"}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[min(92vw,460px)] gap-1 p-2 sm:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item.key}>
                    <NavigationMenuLink asChild>
                      <Link href={item.href} className="block rounded-md p-3 transition-colors hover:bg-accent">
                        <span className="block text-sm font-medium">{item.title}</span>
                        {item.description && (
                          <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/admin">Admin</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
