import { GROUND, INK, PLATE_VIEWBOX, TINT, type PlateProps } from './types';

/** Two cats, the second in tint. Editorial slots only, never assigned from a record. */
export function CatPair({ className }: PlateProps) {
  return (
    <svg viewBox={PLATE_VIEWBOX} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={GROUND} />
      <g data-crop="wide" transform="translate(268 132) scale(0.55)">
        <path d="M110 300c0-92 42-132 100-132s100 40 100 132Z" fill={TINT} />
        <path d="M122 126 116 70l52 38Z" fill={TINT} />
        <path d="M218 126 226 74l-50 32Z" fill={TINT} />
        <circle cx="170" cy="158" r="58" fill={TINT} />
      </g>
      <g data-crop="tall" transform="translate(232 176) scale(0.45)">
        <path d="M110 300c0-92 42-132 100-132s100 40 100 132Z" fill={TINT} />
        <path d="M122 126 116 70l52 38Z" fill={TINT} />
        <path d="M218 126 226 74l-50 32Z" fill={TINT} />
        <circle cx="170" cy="158" r="58" fill={TINT} />
      </g>
      <path d="M110 300c0-92 42-132 100-132s100 40 100 132Z" fill={INK} />
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
    </svg>
  );
}
