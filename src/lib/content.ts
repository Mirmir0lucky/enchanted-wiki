import { promises as fs } from "node:fs";
import path from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import GithubSlugger from "github-slugger";

// content/wiki/index.md -> "/", content/wiki/guides/images.md -> "/guides/images"
export const CONTENT_ROOT = path.join(process.cwd(), "content", "wiki");
export const ROOT_KEY = "index";

export type Heading = { id: string; text: string; level: 2 | 3 };

export type Doc = {
  key: string;
  title: string;
  description: string;
  order: number;
  section: string;
  content: string;
  headings: Heading[];
};

export type NavItem = { key: string; title: string; description: string; href: string };
export type NavSection = { name: string; items: NavItem[] };

const KEY_PATTERN = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/;

export function isValidKey(key: string) {
  if (!KEY_PATTERN.test(key)) return false;
  if (key === "admin" || key.startsWith("admin/")) return false;
  if (key === "api" || key.startsWith("api/")) return false;
  return true;
}

export function keyToHref(key: string) {
  return key === ROOT_KEY ? "/" : `/${key}`;
}

export function titleFromKey(key: string) {
  const last = key.split("/").pop() ?? key;
  return last
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function filePath(key: string) {
  return path.join(CONTENT_ROOT, `${key}.md`);
}

function sectionOf(key: string) {
  return key.includes("/") ? key.split("/")[0] : "";
}

// Minimal frontmatter parser: "---\nyaml\n---\nbody"
function splitFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(normalized);
  if (!match) return { data: {}, content: normalized };
  let data: Record<string, unknown> = {};
  try {
    const parsed = parseYaml(match[1]);
    if (parsed && typeof parsed === "object") data = parsed as Record<string, unknown>;
  } catch {
    data = {};
  }
  return { data, content: normalized.slice(match[0].length) };
}

async function walk(dir: string, prefix = ""): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const keys: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    if (entry.isDirectory()) {
      keys.push(...(await walk(path.join(dir, entry.name), `${prefix}${entry.name}/`)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      keys.push(prefix + entry.name.slice(0, -3));
    }
  }
  return keys;
}

function parseHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inCode = false;
  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      const text = match[2].trim();
      headings.push({ id: slugger.slug(text), text, level: match[1].length as 2 | 3 });
    }
  }
  return headings;
}

export async function readDoc(key: string): Promise<Doc | null> {
  if (!isValidKey(key)) return null;
  let raw: string;
  try {
    raw = await fs.readFile(filePath(key), "utf8");
  } catch {
    return null;
  }
  const { data, content } = splitFrontmatter(raw);
  return {
    key,
    title: typeof data.title === "string" ? data.title : titleFromKey(key),
    description: typeof data.description === "string" ? data.description : "",
    order: typeof data.order === "number" ? data.order : 100,
    section: sectionOf(key),
    content,
    headings: parseHeadings(content),
  };
}

export async function listDocs(): Promise<Doc[]> {
  const keys = await walk(CONTENT_ROOT);
  const docs = await Promise.all(keys.map((key) => readDoc(key)));
  return docs.filter((doc): doc is Doc => doc !== null);
}

export async function getNav(): Promise<NavSection[]> {
  const docs = await listDocs();
  const groups = new Map<string, Doc[]>();
  for (const doc of docs) {
    const list = groups.get(doc.section) ?? [];
    list.push(doc);
    groups.set(doc.section, list);
  }

  const sectionKeys = [...groups.keys()].sort((a, b) => {
    if (a === "") return -1;
    if (b === "") return 1;
    return a.localeCompare(b);
  });

  return sectionKeys.map((section) => {
    const items = (groups.get(section) ?? []).sort((a, b) => {
      if (a.key === ROOT_KEY) return -1;
      if (b.key === ROOT_KEY) return 1;
      return a.order - b.order || a.title.localeCompare(b.title);
    });
    return {
      name: section ? titleFromKey(section) : "",
      items: items.map((doc) => ({
        key: doc.key,
        title: doc.title,
        description: doc.description,
        href: keyToHref(doc.key),
      })),
    };
  });
}

export async function writeDoc(
  key: string,
  meta: { title: string; description: string; order: number },
  body: string,
) {
  const file = filePath(key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  const data: Record<string, string | number> = { title: meta.title };
  if (meta.description) data.description = meta.description;
  data.order = meta.order;
  const frontmatter = stringifyYaml(data).trimEnd();
  const content = body.replace(/\r\n/g, "\n").replace(/^\n+/, "").trimEnd();
  await fs.writeFile(file, `---\n${frontmatter}\n---\n\n${content}\n`, "utf8");
}

export async function deleteDoc(key: string) {
  await fs.unlink(filePath(key));
}
