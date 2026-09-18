import { GROUND, INK, PLATE_VIEWBOX, TINT, type PlateProps } from './types';

/** Rounded pentagon head filling the frame. */
export function CatHead({ className }: PlateProps) {
  return (
    <svg viewBox={PLATE_VIEWBOX} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={GROUND} />
      <path d="M104 156 96 76 160 118Z" fill={INK} />
      <path d="M296 156 304 76 240 118Z" fill={INK} />
      <path d="M115.6 147.2 110 100.4l37.4 22.2Z" fill={TINT} />
      <path d="M284.4 147.2 290 100.4l-37.4 22.2Z" fill={TINT} />
      <path d="M200 96C128 96 92 152 92 204c0 62 48 96 108 96s108-34 108-96c0-52-36-108-108-108Z" fill={INK} />
      <path d="M156 196C166 184 186 184 196 196C186 208 166 208 156 196Z" fill={GROUND} />
      <path d="M244 196C234 184 214 184 204 196C214 208 234 208 244 196Z" fill={GROUND} />
      <circle cx="176" cy="196" r="4" fill={INK} />
      <circle cx="224" cy="196" r="4" fill={INK} />
      <path d="M200 220l11 10-11 10-11-10Z" fill={TINT} />
      <path d="M168 232 108 222M168 240 104 244M168 248 112 264" stroke={GROUND} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" fill="none" />
      <path d="M232 232 292 222M232 240 296 244M232 248 288 264" stroke={GROUND} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" fill="none" />
    </svg>
  );
}
