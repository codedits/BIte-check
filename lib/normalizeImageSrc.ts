const ABSOLUTE_URL = /^https?:\/\//i;
const DATA_URL = /^data:/i;
const PROTOCOL = /^[a-z][a-z\d+\-.]*:/i;
const DOMAIN_PATH = /^[^\/]+\.[^\/]+(\/|$)/;

/**
 * Normalize various user supplied image sources so components can render images reliably.
 * - Keeps absolute, data, and protocol urls as-is
 * - Leaves root-relative paths untouched for Next.js static assets
 * - Upgrades protocol-relative urls (//cdn...) to https
 * - Detects bare domain/path combos and prefixes https
 * - Returns the raw value for Cloudinary public IDs so CloudImage can build the url
 */
export function normalizeImageSrc(input?: string | null): string {
  const src = `${input ?? ''}`.trim();
  if (!src) return '';
  if (ABSOLUTE_URL.test(src)) return src;
  if (DATA_URL.test(src)) return src;
  if (src.startsWith('//')) return `https:${src}`;
  if (src.startsWith('/')) return src;
  if (PROTOCOL.test(src)) return src; // handles mailto:, blob:, etc.
  if (DOMAIN_PATH.test(src)) return `https://${src}`;
  return src; // likely a Cloudinary public ID
}

export function hasNormalizedImage(input?: string | null): boolean {
  return normalizeImageSrc(input).length > 0;
}
