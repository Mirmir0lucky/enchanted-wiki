"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { savePage, type FormState } from "@/app/admin/actions";
import { BlockEditor } from "@/components/admin/block-editor";
import { MarkdownEditor } from "@/components/admin/editor";
import { MediaPanel } from "@/components/admin/media-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { joinBlocks, splitBlocks } from "@/lib/blocks";
import type { MediaItem } from "@/lib/media";

export type PageFormValues = {
  originalKey: string;
  key: string;
  title: string;
  description: string;
  order: number;
  content: string;
};

type Mode = "layout" | "markdown";
const initialState: FormState = {};

export function PageForm({ initial, images }: { initial: PageFormValues; images: MediaItem[] }) {
  const [state, formAction, pending] = useActionState(savePage, initialState);
  const [content, setContent] = useState(initial.content);
  const [mode, setMode] = useState<Mode>("layout");
  const [media, setMedia] = useState<MediaItem[]>(images);

  function appendBlock(markdown: string) {
    setContent((current) => joinBlocks([...splitBlocks(current), markdown]));
  }

  return (
    <form action={formAction} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
      <input type="hidden" name="originalKey" value={initial.originalKey} />
      <input type="hidden" name="content" value={content} />

      <div className="min-w-0 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={initial.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="key">Path</Label>
            <Input id="key" name="key" defaultValue={initial.key} placeholder="guides/images" required />
            <p className="text-xs text-muted-foreground">
              Use <code className="font-mono">index</code> for the home page.
            </p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" defaultValue={initial.description} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Sort order</Label>
            <Input id="order" name="order" type="number" min={0} defaultValue={initial.order} />
            <p className="text-xs text-muted-foreground">Lower numbers appear first in the sidebar.</p>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
          <TabsList>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>
          <TabsContent value="layout">
            <BlockEditor value={content} onChange={setContent} />
          </TabsContent>
          <TabsContent value="markdown">
            <MarkdownEditor value={content} onChange={setContent} />
          </TabsContent>
        </Tabs>

        {state.error && <p className="text-sm text-destructive">{state.error}</p>}

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save page"}
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin">Cancel</Link>
          </Button>
        </div>
      </div>

      <aside className="xl:sticky xl:top-20 xl:h-fit">
        <MediaPanel
          items={media}
          onInsert={appendBlock}
          onUploaded={(item) => setMedia((current) => [item, ...current])}
        />
      </aside>
    </form>
  );
}
