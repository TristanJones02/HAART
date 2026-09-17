import { describe, expect, it } from 'vitest';
import { MARKER_COLOUR, staticMapUrl } from '@/lib/events/maptile';

const input = { lat: -32.0175, lng: 115.8482, width: 600, height: 300 };

describe('staticMapUrl', () => {
  it('returns null without an API key', () => {
    expect(staticMapUrl(input, { apiKey: undefined, provider: 'geoapify' })).toBeNull();
    expect(staticMapUrl(input, { apiKey: '', provider: 'geoapify' })).toBeNull();
  });

  it('builds a Geoapify URL by default with the HAART marker', () => {
    const url = staticMapUrl(input, { apiKey: 'KEY' });
    expect(url).not.toBeNull();
    const u = new URL(url!);
    expect(u.origin + u.pathname).toBe('https://maps.geoapify.com/v1/staticmap');
    expect(u.searchParams.get('style')).toBe('osm-bright-smooth');
    expect(u.searchParams.get('width')).toBe('600');
    expect(u.searchParams.get('height')).toBe('300');
    expect(u.searchParams.get('zoom')).toBe('15');
    expect(u.searchParams.get('scaleFactor')).toBe('2');
    expect(u.searchParams.get('center')).toBe('lonlat:115.8482,-32.0175');
    expect(u.searchParams.get('marker')).toContain(`color:${MARKER_COLOUR}`);
    expect(u.searchParams.get('marker')).toContain('lonlat:115.8482,-32.0175');
    expect(u.searchParams.get('apiKey')).toBe('KEY');
    expect(MARKER_COLOUR).toBe('#b50806');
  });

  it('builds a MapTiler URL when asked', () => {
    const url = staticMapUrl({ ...input, zoom: 13 }, { apiKey: 'MT', provider: 'maptiler' });
    expect(url).toMatch(/^https:\/\/api\.maptiler\.com\/maps\/streets-v2\/static\/115\.8482,-32\.0175,13\/600x300@2x\.png\?/);
    const u = new URL(url!);
    expect(u.searchParams.get('key')).toBe('MT');
    expect(u.searchParams.get('markers')).toBe(`115.8482,-32.0175,${MARKER_COLOUR}`);
  });

  it('returns null for an unknown provider or unusable coordinates', () => {
    expect(staticMapUrl(input, { apiKey: 'K', provider: 'google' })).toBeNull();
    expect(staticMapUrl({ ...input, lat: Number.NaN }, { apiKey: 'K' })).toBeNull();
    expect(staticMapUrl({ ...input, lng: 200 }, { apiKey: 'K' })).toBeNull();
  });

  it('is pure: the same input gives the same URL', () => {
    expect(staticMapUrl(input, { apiKey: 'K' })).toBe(staticMapUrl(input, { apiKey: 'K' }));
  });
});
