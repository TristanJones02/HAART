'use client';

import { useState, type ReactNode } from 'react';
import type { ImageWithAlt } from '@/lib/content/types';
import { SmartImage } from '@/components/ui/SmartImage';
import { PlateFrame } from '@/components/art';
import { PlateReveal } from '@/components/motion/PlateReveal';

/**
 * The profile band: one full-bleed frame at 16/7, 4/3 on a phone, with 2px
 * rules top and bottom, and the caption and catalogue number on a ruled row
 * below it. The plate lives in the frame today and a photograph lives in the
 * identical frame the day one arrives — same ratio, same rules, same number,
 * nothing else on the page moves.
 *
 * `placeholder` is the animal's plate, rendered on the server and passed in,
 * so the eight drawings never reach the browser bundle.
 */
export function PhotoGallery({
  photos,
  name,
  caption,
  catalogue,
  placeholder,
  chip,
  className = '',
}: {
  photos: ImageWithAlt[];
  name: string;
  caption: string;
  catalogue: string;
  placeholder: ReactNode;
  /** The status chip, floating over the band with its ring in the canvas colour. */
  chip?: ReactNode;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const current = photos[i] ?? photos[0];

  return (
    <div className={className}>
      <div className="bleed-rule">
        <PlateFrame ratio="16/7" border={2} edges="y" frameClassName="max-md:aspect-[4/3]">
          <PlateReveal>
            <SmartImage image={current} aspect="size-full" sizes="100vw" priority width={1800} vignette={Boolean(current)} placeholder={placeholder} />
          </PlateReveal>
          {chip ? <span className="absolute left-5 top-5">{chip}</span> : null}
        </PlateFrame>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-[color:var(--hairline)] pt-3">
        <p className="text-note italic text-[color:var(--text-caption)]">{caption}</p>
        <p className="text-catalogue text-[color:var(--text-caption)]">{catalogue}</p>
      </div>

      {photos.length > 1 ? (
        <ul className="mt-4 grid grid-cols-5 gap-2" aria-label={`Photos of ${name}`}>
          {photos.map((p, idx) => (
            <li key={p.url ?? idx}>
              <button
                type="button"
                onClick={() => setI(idx)}
                aria-pressed={idx === i}
                aria-label={`Photo ${idx + 1} of ${photos.length}`}
                className="block w-full"
              >
                <span className="block border border-charcoal-900">
                  <SmartImage image={p} aspect="aspect-square" sizes="120px" width={280} />
                </span>
                <span aria-hidden="true" className={`mt-1 block h-[3px] ${idx === i ? 'bg-red-600' : 'bg-transparent'}`} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
