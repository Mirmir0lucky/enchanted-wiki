import Link from "next/link";
import { Plus } from "lucide-react";
import { PagesTable, type PageRow } from "@/components/admin/pages-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { getNav } from "@/lib/content";
import { listMedia } from "@/lib/media";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const [nav, media, settings] = await Promise.all([getNav(), listMedia(), getSettings()]);

  const rows: PageRow[] = nav.flatMap((section) =>
    section.items.map((item) => ({
      key: item.key,
      title: item.title,
      description: item.description,
      href: item.href,
      section: section.name,
    })),
  );

  const stats = [
    { label: "Pages", value: rows.length },
    { label: "Sections", value: nav.filter((section) => section.name).length },
    { label: "Images", value: media.length },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage pages, images and settings for {settings.siteName}.</p>
        </div>
        <Button asChild>
          <Link href="/admin/new">
            <Plus />
            New page
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">All pages</h2>
        <PagesTable rows={rows} hoverPreviews={settings.hoverPreviews} />
      </section>
    </div>
  );
}
