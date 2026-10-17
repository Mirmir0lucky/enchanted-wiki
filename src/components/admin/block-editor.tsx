"use client";

import { useState, type DragEvent } from "react";
import { Check, GripVertical, Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { Markdown } from "@/components/wiki/markdown";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Textarea } from "@/components/ui/textarea";
import { DRAG_BLOCK, DRAG_MEDIA, blockKind, joinBlocks, splitBlocks } from "@/lib/blocks";
import { cn } from "@/lib/utils";

// Visual layout: every top-level markdown block is a card. Drag cards to reorder,
// drag images from the media panel into the gaps between cards.
export function BlockEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const blocks = splitBlocks(value);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [dragging, setDragging] = useState<number | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);

  function accepts(event: DragEvent) {
    return Array.from(event.dataTransfer.types).some((type) => type === DRAG_BLOCK || type === DRAG_MEDIA);
  }

  function drop(index: number, event: DragEvent) {
    event.preventDefault();
    setDropAt(null);
    setDragging(null);
    const next = [...blocks];

    const media = event.dataTransfer.getData(DRAG_MEDIA);
    if (media) {
      next.splice(index, 0, media);
      onChange(joinBlocks(next));
      return;
    }

    if (Array.from(event.dataTransfer.types).includes(DRAG_BLOCK)) {
      const from = Number(event.dataTransfer.getData(DRAG_BLOCK));
      if (Number.isInteger(from) && from >= 0 && from < blocks.length) {
        const [moved] = next.splice(from, 1);
        next.splice(from < index ? index - 1 : index, 0, moved);
        onChange(joinBlocks(next));
      }
    }
  }

  function startEdit(index: number) {
    setDraft(blocks[index] ?? "");
    setEditing(index);
  }

  function changeDraft(text: string) {
    if (editing === null) return;
    setDraft(text);
    const next = [...blocks];
    next[editing] = text;
    onChange(joinBlocks(next));
  }

  function remove(index: number) {
    setEditing(null);
    onChange(joinBlocks(blocks.filter((_, i) => i !== index)));
  }

  function addText() {
    setDraft("New paragraph.");
    setEditing(blocks.length);
    onChange(joinBlocks([...blocks, "New paragraph."]));
  }

  function gap(index: number) {
    const active = dropAt === index;
    return (
      <div
        onDragOver={(event) => {
          if (!accepts(event)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = dragging !== null ? "move" : "copy";
          setDropAt(index);
        }}
        onDragLeave={() => setDropAt((current) => (current === index ? null : current))}
        onDrop={(event) => drop(index, event)}
        className={cn(
          "rounded-md transition-all",
          active ? "my-1 h-10 border-2 border-dashed border-white/40 bg-white/5" : "h-3",
        )}
      />
    );
  }

  return (
    <div>
      {blocks.length === 0 && (
        <Empty className="mb-2 py-10">
          <EmptyMedia>
            <Layers />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Nothing here yet</EmptyTitle>
            <EmptyDescription>Add a text block or drag an image from the media panel.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {gap(0)}
      {blocks.map((block, index) => (
        <div key={index}>
          <div
            draggable={editing !== index}
            onDragStart={(event) => {
              event.dataTransfer.setData(DRAG_BLOCK, String(index));
              event.dataTransfer.effectAllowed = "move";
              setDragging(index);
            }}
            onDragEnd={() => {
              setDragging(null);
              setDropAt(null);
            }}
            className={cn(
              "group rounded-xl border border-border bg-background p-4 transition-opacity",
              dragging === index && "opacity-40",
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              <GripVertical className="size-4 cursor-grab text-muted-foreground" aria-hidden />
              <span className="text-xs text-muted-foreground">{blockKind(block)}</span>
              <div className="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label={editing === index ? "Done editing" : "Edit block"}
                  onClick={() => (editing === index ? setEditing(null) : startEdit(index))}
                >
                  {editing === index ? <Check /> : <Pencil />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label="Delete block"
                  onClick={() => remove(index)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            {editing === index ? (
              <Textarea
                autoFocus
                value={draft}
                onChange={(event) => changeDraft(event.target.value)}
                spellCheck={false}
                className="min-h-32 font-mono text-sm"
              />
            ) : (
              <Markdown className="prose-sm">{block}</Markdown>
            )}
          </div>
          {gap(index + 1)}
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addText}>
        <Plus />
        Add text block
      </Button>
    </div>
  );
}
