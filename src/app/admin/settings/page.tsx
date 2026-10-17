import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { saveSettingsAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  const settings = await getSettings();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Changes apply to the whole site.</p>
      </div>

      {saved && <p className="rounded-md border border-border px-3 py-2 text-sm">Settings saved.</p>}

      <form action={saveSettingsAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Shown in the header, the browser tab and search results.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site name</Label>
              <Input id="siteName" name="siteName" defaultValue={settings.siteName} maxLength={60} />
              <p className="text-xs text-muted-foreground">Leave empty to fall back to SITE_NAME in .env.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={settings.description} maxLength={240} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interface</CardTitle>
            <CardDescription>Control how the wiki responds to the mouse.</CardDescription>
          </CardHeader>
          <CardContent>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="hoverPreviews"
                defaultChecked={settings.hoverPreviews}
                className="mt-1 size-4 accent-white"
              />
              <span>
                <span className="block text-sm font-medium">Hover previews</span>
                <span className="block text-sm text-muted-foreground">
                  Show a short summary card when hovering page links.
                </span>
              </span>
            </label>
          </CardContent>
        </Card>

        <Button type="submit">Save settings</Button>
      </form>
    </div>
  );
}
