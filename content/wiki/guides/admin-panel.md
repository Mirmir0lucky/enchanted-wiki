---
title: Admin panel
description: Sign in at /admin to manage pages, media and settings.
order: 1
---

## Signing in

Go to `/admin` and log in with the admin name and password from your `.env` file. Sessions last seven days.

## Dashboard

The dashboard shows counts for pages, sections and images, plus a filterable list of every page. Hover a title to see its summary.

## Editing a page

Each page has two tabs:

- **Layout** shows the page as draggable blocks with the media panel beside it.
- **Markdown** is a plain text editor for the raw file.

Both tabs edit the same content, so switch freely.

## Media

The Media page lists uploaded images and lets you upload or delete them. Images live in `public/uploads`.

## Settings

Change the site name, the description and whether hover previews are shown. A blank site name falls back to `SITE_NAME` in `.env`.

## Quick search

Press **Ctrl K** (or **⌘K**) anywhere in the admin to jump to a page or an admin section.
