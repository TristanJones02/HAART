import { GROUND, INK, PLATE_VIEWBOX, TINT, type PlateProps } from './types';

const Big = () => (
  <>
    <path d="M96 118C40 96 20 158 46 216c16 34 50 22 58-20Z" fill={INK} />
    <path d="M304 118c56-22 76 40 50 98-16 34-50 22-58-20Z" fill={INK} />
    <ellipse cx="200" cy="200" rx="120" ry="115" fill={INK} />
    <ellipse cx="200" cy="255" rx="64" ry="52" fill={INK} />
    <circle cx="168" cy="184" r="9" fill={GROUND} />
    <circle cx="232" cy="184" r="9" fill={GROUND} />
    <path d="M200 240c13 0 19 7 19 13 0 7-9 11-19 11s-19-4-19-11c0-6 6-13 19-13Z" fill={GROUND} />
  </>
);

const Small = () => (
  <>
    <path d="M132 96C96 88 84 142 108 172c14 18 34 6 36-22Z" fill={TINT} />
    <path d="M260 96c36-8 48 46 24 76-14 18-34 6-36-22Z" fill={TINT} />
    <ellipse cx="248" cy="252" rx="76" ry="62" fill={TINT} />
    <ellipse cx="186" cy="240" rx="58" ry="70" fill={TINT} />
    <circle cx="196" cy="126" r="72" fill={TINT} />
  </>
);

/**
 * Two dogs, the second drawn entirely in tint so the pair reads as depth.
 * Editorial slots only, never assigned from a record.
 *
 * The portrait crop scales the whole composition into the safe box rather
 * than repositioning one figure: a 3/4 frame is too tight to hold both at
 * full size, and hiding the small dog behind the big one would leave the
 * "pair" reading as a single head on exactly the cards that use it most.
 */
export function DogPair({ className }: PlateProps) {
  return (
    <svg viewBox={PLATE_VIEWBOX} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={GROUND} />
      <g data-crop="wide">
        <g transform="translate(218 108) scale(0.5)">
          <Small />
        </g>
        <g transform="translate(-40 0)">
          <Big />
        </g>
      </g>
      <g data-crop="tall" transform="translate(96 62) scale(0.62)">
        <g transform="translate(250 96) scale(0.5)">
          <Small />
        </g>
        <Big />
      </g>
    </svg>
  );
}
