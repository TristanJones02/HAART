'use client';

import { useState } from 'react';
import type { ImageWithAlt } from '@/lib/content/types';
import { SmartImage } from '@/components/ui/SmartImage';

/** Main photo with thumbnails. No carousel, no autoplay; a fixed 4:3 frame so nothing shifts. */
export function PhotoGallery({ photos, name }: { photos: ImageWithAlt[]; name: string }) {
  const [i, setI] = useState(0);
  const current = photos[i] ?? photos[0];
  return (
    <div>
      <SmartImage image={current} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 640px, 100vw" priority width={1400} className="rounded-card" fallbackLabel={`No photo of ${name} yet`} />
      {photos.length > 1 ? (
        <ul className="mt-3 grid grid-cols-5 gap-2" aria-label={`Photos of ${name}`}>
          {photos.map((p, idx) => (
            <li key={idx}>
              <button type="button" onClick={() => setI(idx)} aria-pressed={idx === i} aria-label={`Photo ${idx + 1} of ${photos.length}`} className={`block w-full overflow-hidden rounded-control border-2 ${idx === i ? 'border-red-600' : 'border-transparent hover:border-charcoal-300'}`}>
                <SmartImage image={p} aspect="aspect-[4/3]" sizes="120px" width={240} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
