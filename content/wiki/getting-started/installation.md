---
title: Installation
description: Install the dependencies, create your admin login and start the dev server.
order: 1
---

## Requirements

- Node.js 20 or newer
- npm

## Steps

1. Open a terminal in the project folder.
2. Install the packages:

```bash
npm install
```

3. Create your `.env` file and admin login:

```bash
npm run setup
```

The setup asks for an admin name and password, then writes `.env` with a random `SESSION_SECRET`.

If you prefer to edit the file yourself, copy `.env.example` to `.env`. The example uses `admin` / `1234`. Change it before you publish the site.

4. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` for the wiki and `http://localhost:3000/admin` for the admin panel.

## Environment variables

| Name | Purpose |
| --- | --- |
| `ADMIN_USERNAME` | Username for `/admin` |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `SESSION_SECRET` | Signs the admin session cookie (at least 16 characters) |
| `SITE_NAME` | Name shown in the header and browser tab |

Restart the dev server after changing `.env`.
