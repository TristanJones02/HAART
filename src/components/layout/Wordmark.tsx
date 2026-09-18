import { Logomark, Logotype } from './Logomark';

/**
 * The HAART lockup, traced from the organisation's own artwork.
 *
 * Both SVGs carry an explicit width AND height rather than `w-auto`: inside a
 * flex row an auto-width SVG is measured as zero and collapses, which clipped
 * the logotype's ascenders in the header. Each pair below keeps its mark's
 * true aspect — 200:263.97 for the mark, 200:58.44 for the logotype.
 *
 * `stacked` puts the mark above the logotype as the real logo does, and holds
 * the artwork's own 2.44:1 height relationship between them, so the footer and
 * the 404 read as the printed logo. Inline the mark is cut back to roughly
 * 1.9× the logotype, otherwise a portrait mark towers over a 60px header bar.
 */
const INLINE = {
  sm: { mark: 'h-[28px] w-[21px]', type: 'h-[15px] w-[51px]' },
  md: { mark: 'h-[36px] w-[27px]', type: 'h-[19px] w-[65px]' },
  lg: { mark: 'h-[44px] w-[33px]', type: 'h-[23px] w-[79px]' },
  xl: { mark: 'h-[60px] w-[45px]', type: 'h-[32px] w-[110px]' },
} as const;

const STACKED = {
  sm: { mark: 'h-[44px] w-[33px]', type: 'h-[18px] w-[62px]' },
  md: { mark: 'h-[56px] w-[42px]', type: 'h-[23px] w-[79px]' },
  lg: { mark: 'h-[80px] w-[61px]', type: 'h-[33px] w-[113px]' },
  xl: { mark: 'h-[100px] w-[76px]', type: 'h-[41px] w-[140px]' },
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
      <Logomark className={`${s.mark} shrink-0`} />
      {markOnly ? null : <Logotype className={`${s.type} shrink-0`} />}
    </span>
  );
}
