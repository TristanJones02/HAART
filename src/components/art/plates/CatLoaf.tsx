import { GROUND, INK, PLATE_VIEWBOX, TINT, type PlateProps } from './types';

/**
 * Folded sitting cat. The tail is the silhouette read, so the portrait crop
 * curls it forward across the body base rather than losing it off the edge.
 */
export function CatLoaf({ className }: PlateProps) {
  return (
    <svg viewBox={PLATE_VIEWBOX} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={GROUND} />
      <g data-crop="wide">
        <path d="M330 288c42 0 50-54 22-74" stroke={INK} strokeWidth="22" strokeLinecap="round" fill="none" />
      </g>
      <path d="M110 300c0-92 42-132 100-132s100 40 100 132Z" fill={INK} />
      <g data-crop="tall">
        <path d="M250 296c-40 8-64-18-58-46" stroke={INK} strokeWidth="20" strokeLinecap="round" fill="none" />
      </g>
      <path d="M180 218c-18 30-20 58-8 82" stroke={TINT} strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M122 126 116 70l52 38Z" fill={INK} />
      <path d="M218 126 226 74l-50 32Z" fill={INK} />
      <path d="M133 118 129.6 87.4l28.6 20.9Z" fill={TINT} />
      <path d="M212.6 119.4 217 96.7l-27.5 17.6Z" fill={TINT} />
      <circle cx="170" cy="158" r="58" fill={INK} />
      <ellipse cx="150" cy="154" rx="9" ry="7" fill={GROUND} />
      <ellipse cx="192" cy="154" rx="9" ry="7" fill={GROUND} />
      <circle cx="150" cy="154" r="3" fill={INK} />
      <circle cx="192" cy="154" r="3" fill={INK} />
      <path d="M171 172l9 8-9 8-9-8Z" fill={TINT} />
      <path d="M142 184 88 176M142 191 86 196M142 198 92 214" stroke={GROUND} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" fill="none" />
    </svg>
  );
}
