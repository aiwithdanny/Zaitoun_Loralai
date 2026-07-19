/**
 * Cloudinary URL optimization utilities.
 *
 * Transforms raw Cloudinary URLs to include responsive sizing,
 * auto-quality, and next-gen format parameters — no component
 * changes needed when applied at the API service layer.
 */

const CLOUDINARY_PATTERN = /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//;

export interface CloudinaryOptions {
  width?: number;
  quality?: 'auto' | number;
  format?: 'auto' | string;
}

const DEFAULTS: CloudinaryOptions = {
  width: 400,
  quality: 'auto',
  format: 'auto',
};

/**
 * Inject Cloudinary image transformations (w_400, q_auto, f_auto) into a URL.
 * Returns the original URL unchanged if it isn't a Cloudinary URL.
 */
export function optimizeCloudinaryUrl(
  url: string | null | undefined,
  options?: CloudinaryOptions,
): string | null | undefined {
  if (!url) return url;

  const opts = { ...DEFAULTS, ...options };
  const parts: string[] = [];

  if (opts.width) parts.push(`w_${opts.width}`);
  if (opts.quality === 'auto' || typeof opts.quality === 'number') {
    parts.push(`q_${opts.quality}`);
  }
  if (opts.format === 'auto' || opts.format) {
    parts.push(`f_${opts.format}`);
  }

  const transform = parts.join(',');
  if (!transform) return url;

  return url.replace(CLOUDINARY_PATTERN, (match) => `${match}${transform}/`);
}
