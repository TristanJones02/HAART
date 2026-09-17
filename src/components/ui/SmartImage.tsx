import Image from 'next/image';
import type { ImageWithAlt } from '@/lib/content/types';
import { isSanityCdn, resolveImageUrl, sanityLoader } from '@/lib/sanity/image';
import { SensitiveImage } from './SensitiveImage';

type Props = {
  image: ImageWithAlt | undefined;
  /** CSS aspect ratio class, e.g. 'aspect-[4/3]'. Always set so grids never shift. */
  aspect?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Requested width for the Sanity URL (largest size in `sizes`). */
  width?: number;
  fallbackLabel?: string;
};

/**
 * One image component for every source: Sanity CDN (custom loader so the
 * image is processed once), PetRescue and other remote hosts (next/image
 * optimiser), and local SVG placeholders (plain img, no optimiser). Distressing
 * images render blurred behind a reveal control.
 */
export function SmartImage({ image, aspect = 'aspect-[4/3]', sizes, priority, className = '', imgClassName = '', width = 1200, fallbackLabel = 'No photo yet' }: Props) {
  const url = resolveImageUrl(image, width);
  const wrapper = `relative overflow-hidden bg-paper-100 ${aspect} ${className}`;

  if (!image || !url) {
    return (
      <div className={wrapper} role="img" aria-label={fallbackLabel}>
        <div className="absolute inset-0 flex items-center justify-center text-small text-charcoal-500">{fallbackLabel}</div>
      </div>
    );
  }

  const isSvg = /\.svg(\?|$)/i.test(url);
  const objectPosition = image.hotspot ? `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%` : undefined;
  const img = isSvg ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={image.alt} width={image.width ?? 1200} height={image.height ?? 900} loading={priority ? 'eager' : 'lazy'} decoding="async" className={`absolute inset-0 size-full object-cover ${imgClassName}`} />
  ) : (
    <Image
      src={url}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      loader={isSanityCdn(url) ? sanityLoader : undefined}
      placeholder={image.lqip ? 'blur' : 'empty'}
      blurDataURL={image.lqip}
      className={`object-cover ${imgClassName}`}
      style={objectPosition ? { objectPosition } : undefined}
    />
  );

  if (image.sensitive) {
    return (
      <div className={wrapper}>
        <SensitiveImage>{img}</SensitiveImage>
      </div>
    );
  }
  return <div className={wrapper}>{img}</div>;
}
