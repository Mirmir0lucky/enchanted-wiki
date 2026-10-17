---
title: Writing pages
description: How a wiki page is structured and what the frontmatter fields do.
order: 2
---

## Frontmatter

Every page starts with a small block between `---` lines. It holds the metadata:

```yaml
---
title: Writing pages
description: Short summary shown under the title.
order: 2
---
```

- `title` is shown in the sidebar and as the page heading.
- `description` is optional and appears under the title.
- `order` controls the position in the sidebar. Lower numbers come first.

## Headings

Use `##` and `###` headings. They appear in the "On this page" list on the right.

## Text and lists

Regular markdown works: **bold**, *italic*, `inline code`, [links](https://example.com), and lists.

- Bullet one
- Bullet two

1. First step
2. Second step

## Code blocks

```ts
export function hello(name: string) {
  return `Hello, ${name}!`;
}
```

## Tables

| Option | Default | Notes |
| --- | --- | --- |
| `order` | `100` | Sidebar position |
| `description` | empty | Optional summary |

## Notes and quotes

> Quotes are useful for warnings and tips.

## Creating a new page by hand

Create a file such as `content/wiki/guides/my-page.md`. It appears at `/guides/my-page` and in a new "Guides" section. The admin panel does the same thing for you.
