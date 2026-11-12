# Untitled

A small, quiet blog built with [Astro](https://astro.build), MDX, and GitHub Pages.

- Warm cream light mode / charcoal dark mode
- Newsreader + Inter, self-hosted through Astro's Fonts API
- MDX posts with code highlighting, footnotes, image captions, and a table of contents
- RSS, sitemap, per-post Open Graph images, and GoatCounter analytics
- Minimal client-side JavaScript: theme toggle, copy buttons, TOC highlighting, page transitions

## Local development

```sh
npm install
npm run dev
```

The site runs at `http://localhost:4321`.

```sh
npm run build    # production build in dist/
npm run preview  # preview the production build
npm run check    # TypeScript + Astro checks
```

On Windows, `npm install` also runs `scripts/postinstall.mjs`, which installs
WebAssembly fallbacks for Astro's compiler and Markdown pipeline when native `.node`
binaries are blocked by an application control policy. If you install with
`--ignore-scripts`, run `node scripts/postinstall.mjs` once.

## Writing a post

Add a `.mdx` file to `src/content/posts/`:

```mdx
---
title: "A post title"
description: "One sentence for the post list, RSS, and social cards."
date: 2026-11-12
---

Your content goes here.
```

Optional frontmatter:

- `updated` — a date shown next to the published date
- `draft` — set to `true` to hide the post from production builds

Use `##` and `###` headings to populate the table of contents automatically.

### Components in posts

Import the `Figure` component for images with captions:

```mdx
import Figure from '../../components/Figure.astro';

<Figure
  src="/images/example.svg"
  alt="A description of the image"
  caption="A caption shown below the image."
  width={1200}
  height={630}
/>
```

Code blocks, footnotes (`[^1]`), tables, quotes, and lists all work out of the box.

## Customizing

Most site details live in `src/config.ts`:

- Site name, description, author, and location
- GitHub, X, LinkedIn, and email links (empty values are hidden)
- GoatCounter site code

Design tokens are at the top of `src/styles/global.css`. The two fonts are configured in `astro.config.mjs` through Astro's Fonts API.

## Deployment

This repository is a GitHub Pages project site named `blog`, served at
`https://daniyal-sh.github.io/blog/`. The `base` value in `astro.config.mjs` is `/blog`,
so all internal links, fonts, Open Graph images, RSS, and sitemap entries include that
prefix. The site is deployed by `.github/workflows/deploy.yml` on every push to `main`.

1. In the repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow manually from the **Actions** tab.

The production URL is `https://daniyal-sh.github.io/blog/`.

If you rename the repository or move to a custom domain, update `site` and `base` in
`astro.config.mjs`. For a user page (`username.github.io`), set `base` to `/` and use the
root URL as `site`.

## Notes

- Open Graph images are generated at build time in `src/pages/og/` using Satori and the
  same fonts as the site.
- Analytics stays disabled until a GoatCounter code is added to `src/config.ts`.
- `src/pages/robots.txt.ts` and the sitemap integration generate crawler files
  automatically.
