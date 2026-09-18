import Image from 'next/image';
import type { ReactNode } from 'react';
import type { ImageWithAlt } from '@/lib/content/types';
import { isSanityCdn, resolveImageUrl, sanityLoader } from '@/lib/sanity/image';
import { SensitiveImage } from './SensitiveImage';

type Props = {
  image: ImageWithAlt | undefined;
  /** Aspect class, always set so grids never shift. */
  aspect?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  width?: number;
  /**
   * What renders when there is no photo. Pass a <Plate/>. There is no grey-box
   * branch any more: nothing on this site renders as an empty placeholder.
   */
  placeholder?: ReactNode;
  /**
   * Elliptical darkening toward the frame edge in the canvas's own colour,
   * so forty photos shot in forty kitchens read as one commissioned set.
   */
  vignette?: boolean;
};

export function SmartImage({ image, aspect = 'aspect-[4/3]', sizes, priority, className = '', imgClassName = '', width = 1200, placeholder, vignette = true }: Props) {
  const url = resolveImageUrl(image, width);
  const wrapper = `relative overflow-hidden ${aspect} ${className}`;

  if (!image || !url) {
    return <div className={wrapper}>{placeholder}</div>;
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

  const body = (
    <>
      {img}
      {vignette ? <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'var(--vignette-photo)' }} /> : null}
    </>
  );

  if (image.sensitive) {
    return (
      <div className={wrapper}>
        <SensitiveImage>{body}</SensitiveImage>
      </div>
    );
  }
  return <div className={wrapper}>{body}</div>;
}
