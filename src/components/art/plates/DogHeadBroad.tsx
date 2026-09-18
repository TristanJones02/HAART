import { GROUND, INK, PLATE_VIEWBOX, TINT, type PlateProps } from './types';

/** Broad three-quarter skull: staffy, mastiff, bull arab. Bleeds past the bottom edge. */
export function DogHeadBroad({ className }: PlateProps) {
  return (
    <svg viewBox={PLATE_VIEWBOX} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={GROUND} />
      {/* ears, behind the skull */}
      <path d="M96 118C40 96 20 158 46 216c16 34 50 22 58-20Z" fill={INK} />
      <path d="M304 118c56-22 76 40 50 98-16 34-50 22-58-20Z" fill={INK} />
      <ellipse cx="200" cy="200" rx="120" ry="115" fill={INK} />
      {/* cheek highlight, the one accent */}
      <path d="M110 150C96 200 106 252 140 288" stroke={TINT} strokeWidth="14" strokeLinecap="round" fill="none" />
      <ellipse cx="200" cy="255" rx="64" ry="52" fill={INK} />
      <circle cx="160" cy="186" r="11" fill={GROUND} />
      <circle cx="240" cy="186" r="11" fill={GROUND} />
      <path d="M200 236c18 0 26 10 26 18 0 10-12 16-26 16s-26-6-26-16c0-8 8-18 26-18Z" fill={GROUND} />
      <path d="M200 270v14M178 288q22 16 44 0" stroke={GROUND} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
