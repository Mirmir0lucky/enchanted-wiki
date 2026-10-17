import { CommandPalette } from "@/components/wiki/command-palette";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { isAuthenticated } from "@/lib/auth";
import { getNav } from "@/lib/content";
import { getSettings } from "@/lib/settings";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // The login page renders without the admin shell.
  if (!(await isAuthenticated())) {
    return (
      <div className="min-h-dvh">
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </div>
    );
  }

  const [nav, settings] = await Promise.all([getNav(), getSettings()]);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <AdminSidebar siteName={settings.siteName} logout={logoutAction} />
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
          <p className="text-sm text-muted-foreground">Admin</p>
          <CommandPalette nav={nav} showAdmin />
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
