import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { Markdown } from "@/components/wiki/markdown";
import { PageNav } from "@/components/wiki/page-nav";
import { TableOfContents } from "@/components/wiki/table-of-contents";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ROOT_KEY, getNav, readDoc } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug?: string[] }> };

function keyFromSlug(slug?: string[]) {
  return slug && slug.length > 0 ? slug.join("/") : ROOT_KEY;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await readDoc(keyFromSlug(slug));
  if (!doc) return { title: "Not found" };
  return { title: doc.title, description: doc.description || undefined };
}

export default async function WikiPage({ params }: Props) {
  const { slug } = await params;
  const key = keyFromSlug(slug);
  const doc = await readDoc(key);
  if (!doc) notFound();

  const [nav, settings] = await Promise.all([getNav(), getSettings()]);
  const flat = nav.flatMap((section) => section.items);
  const index = flat.findIndex((item) => item.key === key);
  const prev = index > 0 ? flat[index - 1] : null;
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null;

  return (
    <div className="flex gap-12 px-4 md:px-8">
      <article className="mx-auto w-full min-w-0 max-w-3xl py-10 md:py-14">
        <header className="mb-10 space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">{doc.title}</h1>
          {doc.description && <p className="text-lg text-muted-foreground">{doc.description}</p>}
        </header>

        {doc.content.trim() ? (
          <Markdown>{doc.content}</Markdown>
        ) : (
          <Empty>
            <EmptyMedia>
              <FileText />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>This page is empty</EmptyTitle>
              <EmptyDescription>Content for this page has not been written yet.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        <PageNav prev={prev} next={next} hoverPreviews={settings.hoverPreviews} />
      </article>

      <aside className="sticky top-14 hidden h-fit w-56 shrink-0 py-14 xl:block">
        <TableOfContents headings={doc.headings} />
      </aside>
    </div>
  );
}
