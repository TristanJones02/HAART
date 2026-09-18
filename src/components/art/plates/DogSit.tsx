import { GROUND, INK, PLATE_VIEWBOX, TINT, type PlateProps } from './types';

/** Seated full body. The haunch and tail are wide-crop only. */
export function DogSit({ className }: PlateProps) {
  return (
    <svg viewBox={PLATE_VIEWBOX} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={GROUND} />
      <g data-crop="wide">
        <path d="M318 246C352 232 356 196 336 176" stroke={INK} strokeWidth="20" strokeLinecap="round" fill="none" />
        <ellipse cx="248" cy="252" rx="76" ry="62" fill={INK} />
      </g>
      <g data-crop="tall">
        <ellipse cx="236" cy="254" rx="58" ry="58" fill={INK} />
      </g>
      <path d="M168 230 L168 300" stroke={INK} strokeWidth="26" strokeLinecap="round" />
      <path d="M214 236 L214 300" stroke={INK} strokeWidth="26" strokeLinecap="round" />
      <ellipse cx="186" cy="240" rx="58" ry="70" fill={INK} />
      <path d="M150 208C142 240 146 270 160 292" stroke={TINT} strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M132 96C96 88 84 142 108 172c14 18 34 6 36-22Z" fill={INK} />
      <path d="M260 96c36-8 48 46 24 76-14 18-34 6-36-22Z" fill={INK} />
      <circle cx="196" cy="126" r="72" fill={INK} />
      <circle cx="178" cy="114" r="7.5" fill={GROUND} />
      <circle cx="214" cy="114" r="7.5" fill={GROUND} />
      <path d="M196 158c11 0 16 6 16 11 0 6-7.4 9.8-16 9.8s-16-3.8-16-9.8c0-5 5-11 16-11Z" fill={GROUND} />
    </svg>
  );
}
