import { WikiHeader } from "@/components/wiki/header";
import { Sidebar } from "@/components/wiki/sidebar";
import { getNav } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function WikiLayout({ children }: { children: React.ReactNode }) {
  const [nav, settings] = await Promise.all([getNav(), getSettings()]);

  return (
    <div className="min-h-dvh">
      <WikiHeader nav={nav} siteName={settings.siteName} />
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border px-4 py-6 md:block">
          <Sidebar nav={nav} />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
