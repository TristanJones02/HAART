import { GROUND, INK, PLATE_VIEWBOX, TINT, type PlateProps } from './types';

/** Narrow skull with pricked ears: kelpie, collie, cattle dog. */
export function DogHeadFine({ className }: PlateProps) {
  return (
    <svg viewBox={PLATE_VIEWBOX} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={GROUND} />
      <path d="M152 104 L128 30 L196 86 Z" fill={INK} />
      <path d="M248 104 L272 30 L204 86 Z" fill={INK} />
      <path d="M200 108C158 108 138 146 138 192C138 248 166 300 200 300C234 300 262 248 262 192C262 146 242 108 200 108Z" fill={INK} />
      <path d="M154 140C144 176 148 214 168 244" stroke={TINT} strokeWidth="11" strokeLinecap="round" fill="none" />
      <ellipse cx="200" cy="252" rx="40" ry="34" fill={INK} />
      <circle cx="180" cy="184" r="7.5" fill={GROUND} />
      <circle cx="220" cy="184" r="7.5" fill={GROUND} />
      <path d="M200 238c14.4 0 20.8 8 20.8 14.4 0 8-9.6 12.8-20.8 12.8s-20.8-4.8-20.8-12.8c0-6.4 6.4-14.4 20.8-14.4Z" fill={GROUND} />
      <path d="M200 266v11" stroke={GROUND} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
