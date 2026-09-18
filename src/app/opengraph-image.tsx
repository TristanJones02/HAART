import { ImageResponse } from 'next/og';
import { LOGOTYPE_ASPECT, LOGOTYPE_LETTERS, LOGOTYPE_VIEWBOX, MARK_ASPECT, MARK_HEART, MARK_SILHOUETTE, MARK_VIEWBOX } from '@/components/layout/logoPaths';

export const alt = 'HAART: Homeless and Abused Animal Rescue Team, Perth';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const MARK_H = 190;
const TYPE_H = 92;

/**
 * The sharing card as a cover: sand ground, a red rule, HAART's own logo at
 * cover scale. Pages with a photograph override this through their own
 * metadata.
 *
 * Satori renders this, not a browser, so the colours are literal rather than
 * custom properties and both marks carry an explicit width and height.
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#f3e3cf',
          color: '#3d3d3d',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 96, height: 6, background: '#b50806' }} />
          <div style={{ fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: '#8f3a22' }}>Homeless and Abused Animal Rescue Team</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
            <svg width={Math.round(MARK_H * MARK_ASPECT)} height={MARK_H} viewBox={MARK_VIEWBOX}>
              {MARK_SILHOUETTE.map((d) => (
                <path key={d.slice(0, 24)} fill="#241f1d" fillRule="evenodd" d={d} />
              ))}
              {MARK_HEART.map((d) => (
                <path key={d.slice(0, 24)} fill="#b50806" fillRule="evenodd" d={d} />
              ))}
            </svg>
            <svg width={Math.round(TYPE_H * LOGOTYPE_ASPECT)} height={TYPE_H} viewBox={LOGOTYPE_VIEWBOX} style={{ marginBottom: 12 }}>
              {LOGOTYPE_LETTERS.map((d) => (
                <path key={d.slice(0, 24)} fill="#241f1d" fillRule="evenodd" d={d} />
              ))}
            </svg>
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Perth&apos;s foster-based, no-kill rescue</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#8f3a22' }}>
          <span>haart.org.au</span>
          <span>Adopt · Foster · Volunteer · Donate</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
