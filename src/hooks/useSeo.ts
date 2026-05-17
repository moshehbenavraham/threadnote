import { useEffect } from "react";
import { SITE_NAME, SITE_TWITTER } from "@/lib/site";

/**
 * Lightweight, dependency-free SEO hook for SPA route changes.
 *
 * Sets <title>, common meta tags (description, robots, canonical),
 * Open Graph + Twitter cards, and an optional JSON-LD payload.
 *
 * Each tag we manage is tagged with data-managed-by="useSeo" so we can
 * cleanly remove tags this hook owns when the component unmounts.
 */

export interface SeoConfig {
  /** Page title. Will be combined with siteName as "title — siteName" unless siteName is empty or already present. */
  title: string;
  /** Meta description (1-2 sentences, ~150 chars). */
  description: string;
  /** Canonical URL. Defaults to the current location if omitted. */
  canonical?: string;
  /** Absolute URL to a social card image. */
  image?: string;
  /** Open Graph type. "website" for index, "article" for articles. */
  ogType?: "website" | "article" | "profile";
  /**
   * Site name shown in OG cards. Defaults to `SITE_NAME` from `@/lib/site`
   * so individual callers don't have to repeat the brand string.
   */
  siteName?: string;
  /**
   * Twitter handle (e.g. "@vespermag"). When `null`/unset we explicitly
   * remove any previously-rendered `twitter:site` meta so we never emit
   * fictional handles into the social graph.
   */
  twitterSite?: string | null;
  /** Optional author handle for og:article:author. */
  authorName?: string;
  /** ISO date string for og:article:published_time. */
  publishedTime?: string;
  /** Keywords (rendered as comma-joined meta keywords). */
  keywords?: string[];
  /** Whether to allow indexing. Defaults to true. */
  index?: boolean;
  /** JSON-LD payload (Schema.org). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const MANAGED_FLAG = "data-managed-by";
const MANAGED_VALUE = "useSeo";

function setMetaByName(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    el.setAttribute(MANAGED_FLAG, MANAGED_VALUE);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    el.setAttribute(MANAGED_FLAG, MANAGED_VALUE);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkRel(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(MANAGED_FLAG, MANAGED_VALUE);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeMetaByName(name: string) {
  const el = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  );
  if (el?.parentNode) el.parentNode.removeChild(el);
}

function setJsonLd(payload: SeoConfig["jsonLd"]): HTMLScriptElement | null {
  if (!payload) return null;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute(MANAGED_FLAG, MANAGED_VALUE);
  script.text = JSON.stringify(payload);
  document.head.appendChild(script);
  return script;
}

export function useSeo(config: SeoConfig) {
  useEffect(() => {
    const previousTitle = document.title;
    const siteName = config.siteName ?? SITE_NAME;

    const composedTitle =
      !siteName || config.title.includes(siteName)
        ? config.title
        : `${config.title} — ${siteName}`;

    document.title = composedTitle;

    setMetaByName("description", config.description);
    setMetaByName(
      "robots",
      config.index === false ? "noindex, nofollow" : "index, follow",
    );

    if (config.keywords && config.keywords.length > 0) {
      setMetaByName("keywords", config.keywords.join(", "));
    }

    const canonicalUrl =
      config.canonical ??
      (typeof window !== "undefined" ? window.location.href : "");
    if (canonicalUrl) setLinkRel("canonical", canonicalUrl);

    // Open Graph
    setMetaByProperty("og:type", config.ogType ?? "website");
    setMetaByProperty("og:title", composedTitle);
    setMetaByProperty("og:description", config.description);
    setMetaByProperty("og:site_name", siteName);
    setMetaByProperty("og:locale", "en_US");
    if (canonicalUrl) setMetaByProperty("og:url", canonicalUrl);
    if (config.image) setMetaByProperty("og:image", config.image);
    if (config.ogType === "article") {
      if (config.authorName)
        setMetaByProperty("article:author", config.authorName);
      if (config.publishedTime)
        setMetaByProperty("article:published_time", config.publishedTime);
    }

    // Twitter
    setMetaByName(
      "twitter:card",
      config.image ? "summary_large_image" : "summary",
    );
    setMetaByName("twitter:title", composedTitle);
    setMetaByName("twitter:description", config.description);
    if (config.image) setMetaByName("twitter:image", config.image);

    // `twitter:site` should only be emitted when we have a real handle.
    // Callers can pass an explicit string, but otherwise we honor the
    // shared SITE_TWITTER value — and remove any prior tag when the
    // value is null so a previous page's handle doesn't leak forward.
    const twitterSite =
      config.twitterSite === undefined ? SITE_TWITTER : config.twitterSite;
    if (twitterSite) {
      setMetaByName("twitter:site", twitterSite);
    } else {
      removeMetaByName("twitter:site");
    }

    const jsonLdEl = setJsonLd(config.jsonLd);

    return () => {
      document.title = previousTitle;
      if (jsonLdEl?.parentNode) {
        jsonLdEl.parentNode.removeChild(jsonLdEl);
      }
    };
    // Re-run when any meaningful field changes. Stringify jsonLd for stable dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.title,
    config.description,
    config.canonical,
    config.image,
    config.ogType,
    config.siteName,
    config.twitterSite,
    config.authorName,
    config.publishedTime,
    config.index,
    config.keywords?.join("|"),
    JSON.stringify(config.jsonLd ?? null),
  ]);
}

export default useSeo;
