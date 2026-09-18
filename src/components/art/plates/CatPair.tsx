import { GROUND, INK, PLATE_VIEWBOX, TINT, type PlateProps } from './types';

const Loaf = ({ fill, detail }: { fill: string; detail: boolean }) => (
  <>
    <path d="M110 300c0-92 42-132 100-132s100 40 100 132Z" fill={fill} />
    <path d="M122 126 116 70l52 38Z" fill={fill} />
    <path d="M218 126 226 74l-50 32Z" fill={fill} />
    <circle cx="170" cy="158" r="58" fill={fill} />
    {detail ? (
      <>
        <path d="M133 118 129.6 87.4l28.6 20.9Z" fill={TINT} />
        <path d="M212.6 119.4 217 96.7l-27.5 17.6Z" fill={TINT} />
        <ellipse cx="150" cy="154" rx="9" ry="7" fill={GROUND} />
        <ellipse cx="192" cy="154" rx="9" ry="7" fill={GROUND} />
        <circle cx="150" cy="154" r="3" fill={INK} />
        <circle cx="192" cy="154" r="3" fill={INK} />
        <path d="M171 172l9 8-9 8-9-8Z" fill={TINT} />
      </>
    ) : null}
  </>
);

/**
 * Two cats, the second in tint. Editorial slots only. The portrait crop
 * scales the whole composition rather than moving one figure, for the same
 * reason as the dog pair.
 */
export function CatPair({ className }: PlateProps) {
  return (
    <svg viewBox={PLATE_VIEWBOX} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill={GROUND} />
      <g data-crop="wide">
        <g transform="translate(224 140) scale(0.48)">
          <Loaf fill={TINT} detail={false} />
        </g>
        <Loaf fill={INK} detail />
      </g>
      <g data-crop="tall" transform="translate(84 74) scale(0.6)">
        <g transform="translate(268 132) scale(0.55)">
          <Loaf fill={TINT} detail={false} />
        </g>
        <Loaf fill={INK} detail />
      </g>
    </svg>
  );
}
