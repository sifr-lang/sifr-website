# Sifr blog and website

This repository is a monorepo that hosts the first Sifr-facing site in `apps/sifr-site` (Astro static site) and deploys it to Cloudflare Workers via Wrangler.

## Layout

- `apps/sifr-site/` — Astro app for homepage and blog.
- `apps/sifr-site/public/logo.webp` — copied from the Sifr repository.
- `apps/sifr-site/public/styles/global.css` — global stylesheet served as a static asset.
- `apps/sifr-site/src/content/blog/*.md` — Markdown blog posts.

## Writing blog posts

Create a new Markdown file in `apps/sifr-site/src/content/blog/`:

```md
---
title: "Post title"
excerpt: Short one-line summary
date: 2026-02-28
---

Your post content in Markdown.
```

- The URL slug comes from the filename.
- Example: `my-first-post.md` becomes `/blog/my-first-post`.

## Development and deployment

From the repository root:

- `npm install`
- `npm run dev:site:wrangler` (Wrangler dev server)
- `npm run build:site`
- `npm run deploy:site`

From `apps/sifr-site` directly:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run deploy`

Deploy uses Wrangler static assets mode (`apps/sifr-site/wrangler.jsonc`).
