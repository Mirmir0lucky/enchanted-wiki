---
title: Markdown guide
description: Every markdown feature the wiki renders.
order: 4
---

## Text

Regular text supports **bold**, *italic*, ~~strikethrough~~, `inline code` and [links](https://example.com).

## Callouts

GitHub-style alerts render as highlighted boxes:

> [!NOTE]
> Useful background information.

> [!TIP]
> A shortcut or a better way to do something.

> [!IMPORTANT]
> Something the reader must not miss.

> [!WARNING]
> Something that can cause problems if ignored.

> [!CAUTION]
> Something that can cause data loss.

## Task lists

- [x] Install the project
- [x] Create an admin login
- [ ] Write the first page

## Tables

| Feature | Status |
| --- | --- |
| Tables | Supported |
| Task lists | Supported |
| Math | Supported |

## Code

```ts
export function greet(name: string) {
  return `Hello, ${name}!`;
}
```

## Math

Inline math looks like $e^{i\pi} + 1 = 0$. Display math:

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

## Footnotes

The renderer supports footnotes.[^1]

[^1]: This is the footnote text.

## Headings

Use `##` and `###` headings. They appear in the "On this page" list and get anchor links automatically.
