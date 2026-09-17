import { ImageResponse } from 'next/og';

export const alt = 'HAART: Homeless and Abused Animal Rescue Team, Perth';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default sharing image: wordmark on paper with the red accent. Pages with a photo override this through metadata. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#faf8f6', color: '#3d3d3d', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 120, fontWeight: 900, letterSpacing: -4 }}>
          haart
          <div style={{ width: 22, height: 22, borderRadius: 999, background: '#b50806', marginLeft: 8 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 44, fontWeight: 700 }}>Perth&apos;s foster-based, no-kill animal rescue</div>
          <div style={{ fontSize: 28, color: '#575757' }}>No shelter. No government funding. Volunteers and foster homes across Perth.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#767676' }}>
          <span>haart.org.au</span>
          <span>Adopt · Foster · Volunteer · Donate</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
