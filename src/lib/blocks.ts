// Pure helpers shared by server and client code. Keep this file free of Node imports.

export const DRAG_BLOCK = "application/x-enchanted-block";
export const DRAG_MEDIA = "application/x-enchanted-media";

// Splits markdown into top-level blocks separated by blank lines.
// Blank lines inside fenced code blocks do not split.
export function splitBlocks(markdown: string): string[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[] = [];
  let current: string[] = [];
  let inFence = false;

  const flush = () => {
    const text = current.join("\n").trim();
    if (text) blocks.push(text);
    current = [];
  };

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (!inFence && line.trim() === "") {
      flush();
      continue;
    }
    current.push(line);
  }
  flush();
  return blocks;
}

export function joinBlocks(blocks: string[]): string {
  const parts = blocks.filter((block) => block.trim() !== "");
  return parts.length ? `${parts.join("\n\n")}\n` : "";
}

export function mediaMarkdown(name: string, url: string) {
  const alt = name
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+-[a-f0-9]{6}-/, "")
    .replace(/[-_]+/g, " ");
  return `![${alt}](${url})`;
}

export function blockKind(block: string) {
  if (/^!\[/.test(block)) return "Image";
  if (/^#{1,6}\s/.test(block)) return "Heading";
  if (/^(```|~~~)/.test(block)) return "Code";
  if (/^\|/.test(block)) return "Table";
  if (/^>\s*\[!/.test(block)) return "Callout";
  if (/^\$\$/.test(block)) return "Math";
  if (/^>/.test(block)) return "Quote";
  if (/^(\s*[-*+]\s|\s*\d+\.\s)/.test(block)) return "List";
  return "Text";
}
