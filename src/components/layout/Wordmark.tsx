import { Logomark, Logotype } from './Logomark';

/**
 * The HAART lockup, traced from the organisation's own artwork.
 *
 * **The mark has a minimum size and it is large.** It is a cat sitting in
 * front of a dog with an open heart drawn across both — at 34px tall, which is
 * all a 60px header bar can give it, that resolves to a dark blob with a red
 * squiggle in it. It needs about 72px before the two animals separate and
 * roughly 110px before the heart reads as a heart. So the inline lockup is the
 * **logotype alone**, which is clean down to 22px, and the mark appears only
 * where there is room for it: the footer, the 404, the favicon. Putting it in
 * the header was the single thing that made the site look broken.
 *
 * Both SVGs carry an explicit width AND height rather than `w-auto`: inside a
 * flex row an auto-width SVG is measured as zero and collapses, which clipped
 * the logotype's ascenders. Each pair below keeps its mark's true aspect —
 * 200:263.97 for the mark, 200:58.44 for the logotype.
 */
/** Logotype only. No mark: nothing in a header row is tall enough for it. */
const INLINE = {
  sm: { mark: null, type: 'h-[19px] w-[65px]' },
  md: { mark: null, type: 'h-[24px] w-[82px]' },
  lg: { mark: null, type: 'h-[30px] w-[103px]' },
  xl: { mark: null, type: 'h-[40px] w-[137px]' },
} as const;

/** Mark above logotype, at the artwork's own 2.44:1 ratio. Never below 72px. */
const STACKED = {
  sm: { mark: 'h-[72px] w-[55px]', type: 'h-[30px] w-[103px]' },
  md: { mark: 'h-[88px] w-[67px]', type: 'h-[36px] w-[123px]' },
  lg: { mark: 'h-[110px] w-[83px]', type: 'h-[45px] w-[154px]' },
  xl: { mark: 'h-[132px] w-[100px]', type: 'h-[54px] w-[185px]' },
} as const;

export function Wordmark({
  className = '',
  size = 'md',
  stacked = false,
  markOnly = false,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  stacked?: boolean;
  markOnly?: boolean;
}) {
  const s = (stacked ? STACKED : INLINE)[size];
  return (
    <span
      className={`inline-flex ${stacked ? 'flex-col items-center gap-2' : 'items-center gap-2.5'} ${className}`}
      role="img"
      aria-label="haart, Homeless and Abused Animal Rescue Team"
    >
      {s.mark ? <Logomark className={`${s.mark} shrink-0`} /> : null}
      {markOnly && s.mark ? null : <Logotype className={`${s.type} shrink-0`} />}
    </span>
  );
}
