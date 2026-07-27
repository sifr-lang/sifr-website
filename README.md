# Sifr blog and website

This repository is a monorepo that hosts the first Sifr-facing site in `apps/sifr-site` (Astro static site) and deploys it to Cloudflare Workers via Wrangler.

## Layout

- `apps/sifr-site/` — Astro app for homepage and blog.
- `apps/sifr-site/public/logo.webp` — copied from the Sifr repository.
- `apps/sifr-site/src/styles/global.css` — global stylesheet (Tailwind theme and shared utilities).
- `apps/sifr-site/src/content/blog/*.md` — Markdown blog posts.

## Current blog posts

- `alpha-preview.md`
- `rust-toolchain-notes.md`
- `building-a-programming-language-with-ai-agents.md`
- `bun-v1-3-6-copied.md` (copied from [bun.com/blog/bun-v1.3.6](https://bun.com/blog/bun-v1.3.6))
- `deno-v2-7-copied.md` (copied from [deno.com/blog/v2.7](https://deno.com/blog/v2.7))

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

Release-owned installer deployment is performed only by
`.github/workflows/release-site.yml`. The Sifr repository dispatches that
workflow at an exact website commit with an exact Sifr source commit, activated
release-index generation and digest, publication attempt, plan digest, and
generated dispatcher/publication-facts digests. The workflow regenerates the
four public dispatchers from that Sifr commit, re-fetches the governed index
immediately before deployment, requires the requested default channel to match
the live index's GA state, and never writes release metadata.

The `sifr.sh-production` GitHub environment must protect the Cloudflare
credentials with required reviewers. Every dispatch input is required and
immutable: two exact commits, a positive index generation, the index, plan,
publication-facts, four dispatcher SHA-256 digests, the GA-aware dispatcher
default, and the main publication attempt identifier. A mismatch or a
superseded release index fails closed before deploy, and the deployed public
bytes are verified afterward. `/install` is routed to the generated
`install/index` dispatcher. The governed caller supplies
`dispatcher_default_channel=beta` while the index is preview and must supply
`stable` once the activated index is active. The generator's entrypoint marker
keeps `/install` attested bytes distinct from the selected channel dispatcher,
and the dispatcher digests bind the default choice. Sifr commits predating
that paired generator contract are intentionally rejected by this workflow.
Each release run regenerates the three committed dispatcher files and adds the
stable dispatcher without publishing a local metadata shadow.

The Cloudflare Worker version and deployment messages include the publication
attempt plus both source commits, so the GitHub and Cloudflare audit trails can
be correlated. Pull requests and `main` pushes build the production site before
release approval is possible.

## Prerequisites

- Node.js 24+ (see `.nvmrc`; run `nvm use` if you use nvm)
