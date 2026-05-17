/**
 * Date utilities shared across SEO markup and editorial card components.
 *
 * Articles in `src/data/articles.ts` carry a human-readable `date` string
 * (e.g. "March 19, 2025"). Crawlers and screen readers want ISO 8601
 * instead, so anywhere we render a `<time>` element we should pair the
 * display string with a parsed ISO value for `dateTime`.
 */

/**
 * Parses an article's display date into a `YYYY-MM-DD` ISO string suitable
 * for the `<time dateTime>` attribute and Schema.org `datePublished`.
 * Returns `undefined` rather than `"Invalid Date"` when parsing fails so
 * the attribute can be omitted entirely.
 */
export const toIsoDate = (date: string | undefined): string | undefined => {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;
  // Use the calendar date portion (not the full ISO datetime) because the
  // input is day-level granularity and we don't want to imply a precise
  // publish time that we don't actually have.
  return parsed.toISOString().slice(0, 10);
};

/**
 * Full ISO 8601 datetime — useful when we want Schema.org `datePublished`
 * to express a time-of-day. Currently unused but kept here so future
 * consumers don't reach for `new Date(...).toISOString()` inline.
 */
export const toIsoDateTime = (date: string | undefined): string | undefined => {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};
