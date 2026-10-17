import { promises as fs } from "node:fs";
import type { Dirent } from "node:fs";
import path from "node:path";

export type MediaItem = { name: string; url: string; size: number };

export async function listMedia(): Promise<MediaItem[]> {
  const dir = path.join(process.cwd(), "public", "uploads");
  const entries: Dirent[] = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = entries.filter((entry) => entry.isFile() && /\.(png|jpe?g|gif|webp)$/i.test(entry.name));
  const items = await Promise.all(
    files.map(async (entry) => {
      const stat = await fs.stat(path.join(dir, entry.name));
      return { name: entry.name, url: `/uploads/${entry.name}`, size: stat.size, modified: stat.mtimeMs };
    }),
  );
  return items
    .sort((a, b) => b.modified - a.modified)
    .map(({ name, url, size }) => ({ name, url, size }));
}
