import { createImageUrlBuilder } from '@sanity/image-url';
import type { ImageLoaderProps } from 'next/image';
import { env } from '@/lib/env';
import type { ImageWithAlt, SanityImageRef } from '@/lib/content/types';

const builder = env.sanity.projectId ? createImageUrlBuilder({ projectId: env.sanity.projectId, dataset: env.sanity.dataset }) : null;

/**
 * Builds a Sanity CDN URL for a Sanity image reference at the requested width.
 * Quality 75, auto format, respects hotspot/crop. Returns null for non-Sanity images.
 */
export function sanityImageUrl(source: SanityImageRef | undefined, width: number, aspect?: number): string | null {
  if (!builder || !source) return null;
  let b = builder.image(source).width(width).auto('format').quality(75).fit('max');
  if (aspect) b = b.height(Math.round(width / aspect)).fit('crop');
  return b.url();
}

/**
 * next/image loader for Sanity CDN URLs: rewrites width and quality on the
 * existing URL so next/image does not re-process what Sanity already did.
 */
export function sanityLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('auto', 'format');
  if (!url.searchParams.has('fit')) url.searchParams.set('fit', 'max');
  return url.toString();
}

export const isSanityCdn = (url?: string) => !!url && url.startsWith('https://cdn.sanity.io/');

/** Resolves the best URL for an ImageWithAlt regardless of where it came from. */
export function resolveImageUrl(img: ImageWithAlt | undefined, width = 1200, aspect?: number): string | null {
  if (!img) return null;
  if (img.image) return sanityImageUrl(img.image, width, aspect) ?? img.url ?? null;
  return img.url ?? null;
}
