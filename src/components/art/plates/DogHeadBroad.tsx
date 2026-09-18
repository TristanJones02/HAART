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
      <circle cx="168" cy="184" r="9" fill={GROUND} />
      <circle cx="232" cy="184" r="9" fill={GROUND} />
      <path d="M200 240c13 0 19 7 19 13 0 7-9 11-19 11s-19-4-19-11c0-6 6-13 19-13Z" fill={GROUND} />
      <path d="M200 264v12M184 282q16 11 32 0" stroke={GROUND} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
