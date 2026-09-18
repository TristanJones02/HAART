import { GROUND, INK, PLATE_VIEWBOX, TINT, type PlateProps } from './types';

/** Upright seated cat, tall teardrop body. Kittens use this at true proportion. */
export function CatSit({ className }: PlateProps) {
  return (
    <svg viewBox={PLATE_VIEWBOX} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={GROUND} />
      <g data-crop="wide">
        <path d="M256 292C300 288 312 250 296 228" stroke={INK} strokeWidth="18" strokeLinecap="round" fill="none" />
      </g>
      <g data-crop="tall">
        <path d="M248 294C272 288 280 266 272 252" stroke={INK} strokeWidth="18" strokeLinecap="round" fill="none" />
      </g>
      <path d="M200 300C150 300 140 232 152 188C164 146 182 128 200 128C218 128 236 146 248 188C260 232 250 300 200 300Z" fill={INK} />
      <path d="M180 240 L180 300" stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <path d="M220 240 L220 300" stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <path d="M176 210c-12 26-14 50-6 72" stroke={TINT} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M161 88 154 20 208 52Z" fill={INK} />
      <path d="M239 88 246 20 192 52Z" fill={INK} />
      <path d="M170.8 82.2 166.9 42.4l31.8 18.9Z" fill={TINT} />
      <path d="M229.2 82.2 233.1 42.4l-31.8 18.9Z" fill={TINT} />
      <circle cx="200" cy="118" r="52" fill={INK} />
      <ellipse cx="182" cy="112" rx="8" ry="6.5" fill={GROUND} />
      <ellipse cx="218" cy="112" rx="8" ry="6.5" fill={GROUND} />
      <circle cx="182" cy="112" r="2.8" fill={INK} />
      <circle cx="218" cy="112" r="2.8" fill={INK} />
      <path d="M200 130l8 7-8 7-8-7Z" fill={TINT} />
      <path d="M174 142 128 134M174 149 126 154M174 156 132 170" stroke={GROUND} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" fill="none" />
    </svg>
  );
}
