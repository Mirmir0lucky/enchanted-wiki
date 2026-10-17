import { FileImage } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { MediaUpload } from "@/components/admin/media-upload";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { deleteMediaAction } from "../actions";
import { requireAdmin } from "@/lib/auth";
import { listMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireAdmin();
  const media = await listMedia();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Media</h1>
          <p className="text-sm text-muted-foreground">Images are stored in public/uploads.</p>
        </div>
        <MediaUpload refreshOnUpload />
      </div>

      {media.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <FileImage />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No images yet</EmptyTitle>
            <EmptyDescription>Upload a screenshot or photo to use it in your pages.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <li key={item.url} className="overflow-hidden rounded-xl border border-border">
              <img src={item.url} alt={item.name} className="aspect-video w-full object-cover" />
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {item.url} · {Math.max(1, Math.round(item.size / 1024))} KB
                </p>
                <form action={deleteMediaAction}>
                  <input type="hidden" name="name" value={item.name} />
                  <ConfirmSubmitButton message={`Delete ${item.name}? Pages using it will show a broken image.`}>
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
