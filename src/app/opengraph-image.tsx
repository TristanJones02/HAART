import { ImageResponse } from 'next/og';

export const alt = 'HAART: Homeless and Abused Animal Rescue Team, Perth';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The sharing card as a cover: sand ground, a red rule, the wordmark at
 * cover scale and the printer's quad. Pages with a photograph override this
 * through their own metadata.
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, fontSize: 132, fontWeight: 900, letterSpacing: -5, lineHeight: 0.9 }}>
            haart
            <div style={{ width: 26, height: 26, background: '#b50806', marginBottom: 18 }} />
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
