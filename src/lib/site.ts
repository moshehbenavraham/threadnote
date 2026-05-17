/**
 * Central, single source of truth for Vesper's site-wide identity.
 *
 * Anything that needs the canonical site origin, publisher name, contact
 * email, or social-graph handles should import from this module rather than
 * inlining strings. Keeping the configuration in one place avoids drift
 * between the SEO hook, JSON-LD payloads, the sitemap script, footers, and
 * structured-data nodes.
 *
 * Social links default to `null` (not present). Templates frequently ship
 * with `https://instagram.com` / `https://twitter.com` etc. — those are
 * brand homepages, not Vesper profiles, and they pollute structured data.
 * Set the variables you actually own; `getActiveSocialLinks()` only emits
 * platforms that have a real URL configured.
 */

const trim = (value: string | undefined | null): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

export const SITE_NAME = "Vesper";

export const SITE_DESCRIPTION =
  "Vesper is a fashion editorial sharing timeless style guidance, sustainable design ideas, capsule wardrobe tips, and stories from emerging designers.";

/**
 * Canonical site origin (no trailing slash). When `VITE_SITE_URL` is set
 * at build time, that wins; otherwise we fall back to the conventional
 * `https://{repo-slug}.app` placeholder. Update the constant or set the
 * env variable once the production hostname is known.
 */
export const SITE_URL = stripTrailingSlash(
  trim(import.meta.env.VITE_SITE_URL) ?? "https://fashion-blog.app",
);

export const SITE_EMAIL =
  trim(import.meta.env.VITE_CONTACT_EMAIL) ?? "hello@vesper.com";

/**
 * Twitter / X handle (e.g. "@vespermag"). Leave `null` until a real handle
 * exists — `useSeo` will then omit `twitter:site` rather than emit a
 * fictional one.
 */
export const SITE_TWITTER: string | null = trim(
  import.meta.env.VITE_SITE_TWITTER,
) ?? null;

export type SocialPlatform =
  | "instagram"
  | "twitter"
  | "pinterest"
  | "threads"
  | "mastodon";

/**
 * Public social profile URLs. Every entry defaults to `null`; populate
 * only the platforms that point at a real Vesper profile so we never link
 * out to `https://instagram.com` etc. Override at build time by setting
 * `VITE_SOCIAL_INSTAGRAM`, `VITE_SOCIAL_TWITTER`, etc.
 */
export const SOCIAL_LINKS: Record<SocialPlatform, string | null> = {
  instagram: trim(import.meta.env.VITE_SOCIAL_INSTAGRAM) ?? null,
  twitter: trim(import.meta.env.VITE_SOCIAL_TWITTER) ?? null,
  pinterest: trim(import.meta.env.VITE_SOCIAL_PINTEREST) ?? null,
  threads: trim(import.meta.env.VITE_SOCIAL_THREADS) ?? null,
  mastodon: trim(import.meta.env.VITE_SOCIAL_MASTODON) ?? null,
};

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  twitter: "Twitter / X",
  pinterest: "Pinterest",
  threads: "Threads",
  mastodon: "Mastodon",
};

export interface ActiveSocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

/**
 * Returns only the social entries that have a non-empty URL configured.
 * Useful for rendering footer / header navigation that should silently
 * collapse when no real profiles exist yet.
 */
export const getActiveSocialLinks = (): ActiveSocialLink[] =>
  (Object.entries(SOCIAL_LINKS) as Array<[SocialPlatform, string | null]>)
    .filter((entry): entry is [SocialPlatform, string] => Boolean(entry[1]))
    .map(([platform, href]) => ({
      platform,
      label: SOCIAL_LABELS[platform],
      href,
    }));

/** Convenience for JSON-LD `sameAs` payloads. Empty array when no socials. */
export const getSameAsUrls = (): string[] =>
  getActiveSocialLinks().map((entry) => entry.href);
