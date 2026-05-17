/// <reference types="vite/client" />

/**
 * Typed import.meta.env entries for project-specific variables. Vite exposes
 * any variable prefixed with VITE_ to the client. Keep this in sync with the
 * .env.example documentation.
 */
interface ImportMetaEnv {
  /**
   * URL of a newsletter signup endpoint that accepts `{ email }` JSON POST.
   * When unset, NewsletterForm falls back to a prefilled mailto: draft.
   */
  readonly VITE_NEWSLETTER_ENDPOINT?: string;
  /**
   * Recipient for the mailto: fallback when VITE_NEWSLETTER_ENDPOINT is unset.
   * Defaults to hello@vesper.com when omitted.
   */
  readonly VITE_NEWSLETTER_EMAIL?: string;
  /**
   * Canonical site origin (e.g. https://fashion-blog.app). Used by the
   * sitemap generator AND read by client code via `@/lib/site` so
   * structured data, canonical tags, and OG URLs all agree.
   */
  readonly VITE_SITE_URL?: string;
  /**
   * Public-facing contact email surfaced in the footer, About page, and
   * Organization JSON-LD. Defaults to hello@vesper.com.
   */
  readonly VITE_CONTACT_EMAIL?: string;
  /**
   * Optional Twitter / X handle (e.g. "@vespermag"). When unset, the
   * `twitter:site` meta tag is omitted entirely rather than emitting a
   * fictional handle.
   */
  readonly VITE_SITE_TWITTER?: string;
  /** Public Instagram profile URL (full https://). */
  readonly VITE_SOCIAL_INSTAGRAM?: string;
  /** Public Twitter / X profile URL (full https://). */
  readonly VITE_SOCIAL_TWITTER?: string;
  /** Public Pinterest profile URL (full https://). */
  readonly VITE_SOCIAL_PINTEREST?: string;
  /** Public Threads profile URL (full https://). */
  readonly VITE_SOCIAL_THREADS?: string;
  /** Public Mastodon profile URL (full https://, used as `rel="me"`). */
  readonly VITE_SOCIAL_MASTODON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
