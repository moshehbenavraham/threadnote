#!/usr/bin/env node
// @ts-check
/**
 * Generates public/sitemap.xml and rewrites the Sitemap directive in
 * public/robots.txt at build time.
 *
 * The site's canonical origin is read from `VITE_SITE_URL` (preferred) or
 * `SITE_URL`. When unset, falls back to a placeholder so the file is still
 * emitted in deterministic shape — replace at deploy time.
 *
 * Article slugs are extracted from src/data/articles.ts via a simple regex so
 * this script stays runnable with vanilla Node (no TS toolchain dependency).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const DEFAULT_SITE_URL = "https://fashion-blog.app";

const SITE_URL = (
  process.env.VITE_SITE_URL ||
  process.env.SITE_URL ||
  DEFAULT_SITE_URL
).replace(/\/+$/, "");

const PLACEHOLDER_NOTICE =
  SITE_URL === DEFAULT_SITE_URL
    ? "[generate-sitemap] VITE_SITE_URL unset — using placeholder origin " +
      `${DEFAULT_SITE_URL}. ` +
      "Set VITE_SITE_URL=https://your-domain.tld before building for production."
    : null;
if (PLACEHOLDER_NOTICE) console.warn(PLACEHOLDER_NOTICE);

// Extract slugs from src/data/articles.ts
const articlesSrc = readFileSync(
  join(repoRoot, "src/data/articles.ts"),
  "utf8",
);
const slugRegex = /slug:\s*"([^"]+)"/g;
const slugs = [];
let match;
while ((match = slugRegex.exec(articlesSrc)) !== null) {
  slugs.push(match[1]);
}

const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE_URL}/about`, changefreq: "monthly", priority: "0.6" },
  ...slugs.map((slug) => ({
    loc: `${SITE_URL}/article/${slug}`,
    changefreq: "monthly",
    priority: "0.8",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(repoRoot, "public/sitemap.xml"), sitemap);
console.log(`[generate-sitemap] wrote public/sitemap.xml (${urls.length} urls)`);

// Update robots.txt: replace any existing Sitemap: line with the current one;
// otherwise append it.
const robotsPath = join(repoRoot, "public/robots.txt");
let robots = readFileSync(robotsPath, "utf8");
const sitemapLine = `Sitemap: ${SITE_URL}/sitemap.xml`;

if (/^Sitemap:\s.*$/m.test(robots)) {
  robots = robots.replace(/^Sitemap:\s.*$/m, sitemapLine);
} else {
  robots = robots.replace(/\n*$/, "\n\n") + sitemapLine + "\n";
}

writeFileSync(robotsPath, robots);
console.log(`[generate-sitemap] updated public/robots.txt sitemap directive`);
