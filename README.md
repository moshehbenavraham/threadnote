# Vesper - Fashion Blog

Vesper is a small editorial publishing slow-fashion essays on capsule wardrobes,
sustainability, color, tailoring, materials, and emerging designers. The site is a
single-page Vite + React + TypeScript application styled with Tailwind CSS and
shadcn/ui primitives.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router v7

## Features

- Editorial-grade typography (DM Sans + Lora) with a warm cream palette
- Light/dark theming via `next-themes` with a `.dark` palette, anti-FOUC
  bootstrap in `index.html`, and a header-mounted theme toggle
- Filterable essay grid with seven topics (Wardrobe, Sustainability, Styling,
  Designers, Materials, Tailoring, Vintage)
- Per-article reading-progress bar
- Per-article share row (Twitter / X, Pinterest, native share, copy link)
- Per-page SEO: dynamic `<title>`, meta description, OG, Twitter, canonical
  tags, and rich JSON-LD (`WebSite` + `Organization` graph on the index,
  `Article` + `BreadcrumbList` on essays) via a single `useSeo` hook in
  `src/hooks/useSeo.ts`
- Centralized site identity (`src/lib/site.ts`): canonical origin, publisher
  name, contact email, Twitter handle, and per-platform social URLs. Social
  links default to `null` so the footer and `sameAs` array stay clean until
  a real profile URL is configured
- Related-articles algorithm prefers shared tags, then falls back to recency
- Newsletter signup with zod-validated email, a real POST endpoint when
  `VITE_NEWSLETTER_ENDPOINT` is configured, and a `mailto:` fallback so
  visitor intent is never silently dropped
- Accessibility: working skip-to-content link on every page, keyboard-focusable
  nav, `<time dateTime>` markup parsed from the display date, descriptive image
  `alt`, ARIA labels on nav and share controls, and `aria-live` status
  messaging on form submission
- Image performance: `loading="eager"` + `fetchpriority="high"` on hero images,
  `loading="lazy"` on cards
- Generated `public/sitemap.xml` (covers index, about, and all articles) and an
  updated `robots.txt` pointing at it

## Requirements

- Node.js 20+
- npm 10+

## Local Development

```bash
npm install
npm run dev
```

The development server starts on port 8080 by default.

## Production Build

```bash
npm run build
npm run preview
```

The compiled app is emitted to `dist/` and can be served with standard static
hosting tooling such as Nginx, Caddy, Apache, or any static hosting provider.

## Environment variables

All variables are optional; the site renders without any set. Copy
`.env.example` to `.env.local` and fill in the values relevant to your
deployment.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Canonical origin used by `scripts/generate-sitemap.mjs` and `src/lib/site.ts`. Drives canonical / OG / JSON-LD URLs. |
| `VITE_CONTACT_EMAIL` | Public-facing contact email (footer, About page, Organization JSON-LD). Defaults to `hello@vesper.com`. |
| `VITE_SITE_TWITTER` | Optional `@handle` for `twitter:site`. Omitted when unset. |
| `VITE_SOCIAL_INSTAGRAM` / `VITE_SOCIAL_TWITTER` / `VITE_SOCIAL_PINTEREST` / `VITE_SOCIAL_THREADS` / `VITE_SOCIAL_MASTODON` | Public profile URLs. Footer + `sameAs` only render configured entries. |
| `VITE_NEWSLETTER_ENDPOINT` | URL of an endpoint that accepts a JSON `POST` of `{ email, source }`. When unset, the form falls back to a prefilled `mailto:` draft. |
| `VITE_NEWSLETTER_EMAIL` | Recipient address for the `mailto:` fallback. Defaults to `hello@vesper.com`. |

## Sitemap

The bundled `public/sitemap.xml` is generated from `src/data/articles.ts` and
covers the home page, `/about`, and every article. It uses
`https://fashion-blog.app` as a placeholder origin when `VITE_SITE_URL` is
unset. Regenerate it for your domain before going live:

```bash
VITE_SITE_URL=https://your-domain.tld node scripts/generate-sitemap.mjs
```

The script also rewrites the `Sitemap:` line in `public/robots.txt` to match.
Re-run it (or rely on the bundled `prebuild` hook) whenever you add or remove
an article.

## Project Notes

- Editorial content lives in `src/data/articles.ts`. Each article carries a
  `tags: Topic[]` array (used for filtering on the index page), a human-readable
  `date` string, and an optional `content` HTML body.
- Shared UI components live in `src/components`. Page-level components live in
  `src/pages`. Cross-cutting helpers (site identity, date parsing) live in
  `src/lib`.
- The `useSeo` hook in `src/hooks/useSeo.ts` updates `<title>` and meta tags
  per page without pulling in `react-helmet-async`. Tag state is restored on
  unmount so back-navigation produces clean meta.
- Social preview metadata uses the local `public/social-card.svg` asset.
- The project uses standard Vite and npm tooling without vendor-specific build
  plugins.

## Adding a new article

1. Add a new entry to the array in `src/data/articles.ts`. Provide `id`,
   `title`, `excerpt`, `date` (e.g. `"March 19, 2025"` — automatically parsed
   into ISO for `<time dateTime>` and JSON-LD), `image`, `slug`, `colorClass`
   (one of the `bg-vibrant-*` tokens from `tailwind.config.ts`), `author`,
   `readTime`, `tags` (from the `TOPICS` array — first tag is the primary
   topic), and an optional `content` HTML string.
2. Run `node scripts/generate-sitemap.mjs` (or `VITE_SITE_URL=https://your-domain.tld
   node scripts/generate-sitemap.mjs`) to refresh the sitemap.
3. `npm run lint && npm run build` to confirm the bundle still compiles.
