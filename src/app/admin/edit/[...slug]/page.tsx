import { notFound } from "next/navigation";
import { PageForm } from "@/components/admin/page-form";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { deletePage } from "../../actions";
import { requireAdmin } from "@/lib/auth";
import { ROOT_KEY, readDoc } from "@/lib/content";
import { listMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ slug: string[] }> }) {
  await requireAdmin();
  const { slug } = await params;
  const key = slug.join("/");
  const doc = await readDoc(key);
  if (!doc) notFound();
  const images = await listMedia();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit page</h1>
        <p className="text-sm text-muted-foreground">{doc.title}</p>
      </div>

      <PageForm
        images={images}
        initial={{
          originalKey: key,
          key,
          title: doc.title,
          description: doc.description,
          order: doc.order,
          content: doc.content,
        }}
      />

      {key !== ROOT_KEY && (
        <section className="space-y-3 rounded-xl border border-border p-6">
          <h2 className="font-medium">Delete page</h2>
          <p className="text-sm text-muted-foreground">This removes the markdown file. It cannot be undone.</p>
          <form action={deletePage}>
            <input type="hidden" name="key" value={key} />
            <ConfirmSubmitButton message="Delete this page? This cannot be undone.">Delete page</ConfirmSubmitButton>
          </form>
        </section>
      )}
    </div>
  );
}
