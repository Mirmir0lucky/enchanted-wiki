"use client";

import type { DragEvent } from "react";
import { ImageOff } from "lucide-react";
import { MediaUpload } from "@/components/admin/media-upload";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { DRAG_MEDIA, mediaMarkdown } from "@/lib/blocks";
import type { MediaItem } from "@/lib/media";

export function MediaPanel({
  items,
  onInsert,
  onUploaded,
}: {
  items: MediaItem[];
  onInsert: (markdown: string) => void;
  onUploaded: (item: MediaItem) => void;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Media</p>
          <p className="text-xs text-muted-foreground">Drag into the layout, or click to add at the end.</p>
        </div>
        <MediaUpload onUploaded={onUploaded} />
      </div>

      {items.length === 0 ? (
        <Empty className="gap-2 px-4 py-8">
          <EmptyMedia>
            <ImageOff />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-sm">No images yet</EmptyTitle>
            <EmptyDescription>Upload PNG, JPG, GIF or WebP files.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid max-h-[62vh] grid-cols-2 gap-2 overflow-y-auto pr-1">
          {items.map((item) => {
            const markdown = mediaMarkdown(item.name, item.url);
            return (
              <button
                type="button"
                key={item.url}
                draggable
                title={`Insert ${item.name}`}
                onDragStart={(event: DragEvent<HTMLButtonElement>) => {
                  event.dataTransfer.setData(DRAG_MEDIA, markdown);
                  event.dataTransfer.setData("text/plain", markdown);
                  event.dataTransfer.effectAllowed = "copy";
                }}
                onClick={() => onInsert(markdown)}
                className="group overflow-hidden rounded-lg border border-border text-left transition-colors hover:border-white/40"
              >
                <img src={item.url} alt="" draggable={false} className="aspect-video w-full object-cover" />
                <span className="block truncate px-2 py-1 text-[11px] text-muted-foreground group-hover:text-foreground">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
