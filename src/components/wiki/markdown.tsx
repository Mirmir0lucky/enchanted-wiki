import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { remarkCallouts } from "@/lib/remark-callouts";
import { cn } from "@/lib/utils";

// GFM (tables, task lists, strikethrough, footnotes, autolinks), math ($..$, $$..$$),
// GitHub-style callouts, syntax highlighting, and heading anchors.
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose prose-wiki max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkCallouts]}
        rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeKatex]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
