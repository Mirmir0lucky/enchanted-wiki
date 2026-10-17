"use client";

import { Textarea } from "@/components/ui/textarea";

export function MarkdownEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        className="min-h-[520px] font-mono text-sm leading-relaxed"
      />
      <p className="text-xs text-muted-foreground">
        Markdown: # headings · **bold** · `code` · {"> [!NOTE]"} callouts · $math$ · - [ ] tasks · | tables |
      </p>
    </div>
  );
}
