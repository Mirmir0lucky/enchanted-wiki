import { PageForm } from "@/components/admin/page-form";
import { requireAdmin } from "@/lib/auth";
import { listMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function NewPage() {
  await requireAdmin();
  const images = await listMedia();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New page</h1>
        <p className="text-sm text-muted-foreground">
          The path becomes the URL. Folders such as <code className="font-mono">guides/</code> become sidebar sections.
        </p>
      </div>
      <PageForm
        images={images}
        initial={{
          originalKey: "",
          key: "",
          title: "",
          description: "",
          order: 100,
          content: "# New page\n\nStart writing here.\n",
        }}
      />
    </div>
  );
}
