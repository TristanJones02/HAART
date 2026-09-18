import type { ReactNode } from 'react';

export type PlateRatio = '16/7' | '4/3' | '4/5' | '3/4' | '1/1';

const RATIO_CLASS: Record<PlateRatio, string> = {
  '16/7': 'aspect-[16/7]',
  '4/3': 'aspect-[4/3]',
  '4/5': 'aspect-[4/5]',
  '3/4': 'aspect-[3/4]',
  '1/1': 'aspect-square',
};

/** Ratios below 1 are portrait, which swaps the plates' crop groups. */
const isTall = (r: PlateRatio) => {
  const [w, h] = r.split('/').map(Number);
  return h > w;
};

/**
 * The single component that makes plates and photographs interchangeable.
 * The box is a fixed aspect ratio, so the layout is byte-identical the day a
 * photo replaces a drawing. Captions sit below the box, never over it, which
 * is why there is no scrim anywhere and no contrast guessing.
 */
export function PlateFrame({
  children,
  ratio = '4/3',
  catalogue,
  caption,
  border = 1,
  edges = 'all',
  vignette = false,
  className = '',
  frameClassName = '',
}: {
  children: ReactNode;
  ratio?: PlateRatio;
  /** e.g. "HD26-030" or "Plate 01". Sits in the top-right corner of the frame. */
  catalogue?: string;
  /** States a fact, never sentiment. */
  caption?: string;
  border?: 1 | 2;
  /** Which sides carry the rule. Bleeding plates drop the edges they run past. */
  edges?: 'all' | 'left' | 'y' | 'none';
  /** Elliptical darkening toward the frame edge in the canvas's own colour. */
  vignette?: boolean;
  className?: string;
  frameClassName?: string;
}) {
  const edgeClass =
    edges === 'all'
      ? border === 2
        ? 'border-2'
        : 'border'
      : edges === 'left'
        ? border === 2
          ? 'border-l-2'
          : 'border-l'
        : edges === 'y'
          ? border === 2
            ? 'border-y-2'
            : 'border-y'
          : '';

  return (
    <figure className={`m-0 ${className}`}>
      <div
        className={`plate relative overflow-hidden border-charcoal-900 ${edgeClass} ${RATIO_CLASS[ratio]} ${frameClassName}`}
        data-ratio={isTall(ratio) ? 'tall' : 'wide'}
      >
        {children}
        {vignette ? <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'var(--vignette-photo)' }} /> : null}
        {catalogue ? (
          <span className="absolute right-3 top-3 bg-sand-200 px-1 py-0.5 text-catalogue text-charcoal-900">{catalogue}</span>
        ) : null}
      </div>
      {caption ? (
        <figcaption className="mt-2 flex items-start gap-2 text-note italic text-[color:var(--text-caption)]">
          <span aria-hidden="true" className="mt-[0.55em] h-0.5 w-3 flex-none bg-[color:var(--rule)]" />
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
