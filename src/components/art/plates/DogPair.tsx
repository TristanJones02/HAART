import { GROUND, INK, PLATE_VIEWBOX, TINT, type PlateProps } from './types';

/** Two dogs, the second drawn entirely in tint so the pair reads as depth. Editorial slots only. */
export function DogPair({ className }: PlateProps) {
  return (
    <svg viewBox={PLATE_VIEWBOX} className={className} preserveAspectRatio="xMinYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={GROUND} />
      <g data-crop="wide" transform="translate(250 96) scale(0.55)">
        <path d="M132 96C96 88 84 142 108 172c14 18 34 6 36-22Z" fill={TINT} />
        <path d="M260 96c36-8 48 46 24 76-14 18-34 6-36-22Z" fill={TINT} />
        <ellipse cx="248" cy="252" rx="76" ry="62" fill={TINT} />
        <ellipse cx="186" cy="240" rx="58" ry="70" fill={TINT} />
        <circle cx="196" cy="126" r="72" fill={TINT} />
      </g>
      <g data-crop="tall" transform="translate(196 150) scale(0.42)">
        <path d="M132 96C96 88 84 142 108 172c14 18 34 6 36-22Z" fill={TINT} />
        <path d="M260 96c36-8 48 46 24 76-14 18-34 6-36-22Z" fill={TINT} />
        <ellipse cx="186" cy="240" rx="58" ry="70" fill={TINT} />
        <circle cx="196" cy="126" r="72" fill={TINT} />
      </g>
      <g transform="translate(-40 0)">
        <path d="M96 118C40 96 20 158 46 216c16 34 50 22 58-20Z" fill={INK} />
        <path d="M304 118c56-22 76 40 50 98-16 34-50 22-58-20Z" fill={INK} />
        <ellipse cx="200" cy="200" rx="120" ry="115" fill={INK} />
        <ellipse cx="200" cy="255" rx="64" ry="52" fill={INK} />
        <circle cx="160" cy="186" r="11" fill={GROUND} />
        <circle cx="240" cy="186" r="11" fill={GROUND} />
        <path d="M200 236c18 0 26 10 26 18 0 10-12 16-26 16s-26-6-26-16c0-8 8-18 26-18Z" fill={GROUND} />
      </g>
    </svg>
  );
}
