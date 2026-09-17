import { env } from '@/lib/env';

/**
 * Static map tile URLs for event cards. One file so the provider is a
 * drop-in (docs/decisions.md D6). Pure: it reads nothing but its arguments
 * and the defaults passed in from `env`.
 */

export type MapProvider = 'geoapify' | 'maptiler';

export type StaticMapInput = {
  lat: number;
  lng: number;
  width: number;
  height: number;
  zoom?: number;
};

export type StaticMapOptions = {
  provider?: string;
  apiKey?: string;
};

/** HAART red, used for the marker. */
export const MARKER_COLOUR = '#b50806';
const DEFAULT_ZOOM = 15;
const GEOAPIFY_STYLE = 'osm-bright-smooth';
const MAPTILER_STYLE = 'streets-v2';

const isFiniteNumber = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/**
 * Returns the tile URL, or null when there is no API key or the input is not
 * usable, so the card can fall back to no map at all.
 */
export function staticMapUrl(input: StaticMapInput, options: StaticMapOptions = {}): string | null {
  const provider = (options.provider ?? env.maps.provider ?? 'geoapify').toLowerCase();
  const apiKey = options.apiKey ?? env.maps.apiKey;
  if (!apiKey) return null;

  const { lat, lng } = input;
  if (!isFiniteNumber(lat) || !isFiniteNumber(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  const width = Math.max(1, Math.round(input.width));
  const height = Math.max(1, Math.round(input.height));
  const zoom = Math.min(20, Math.max(1, Math.round(input.zoom ?? DEFAULT_ZOOM)));
  const lonlat = `${round(lng)},${round(lat)}`;

  if (provider === 'maptiler') {
    const url = new URL(`https://api.maptiler.com/maps/${MAPTILER_STYLE}/static/${lonlat},${zoom}/${width}x${height}@2x.png`);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('markers', `${lonlat},${MARKER_COLOUR}`);
    url.searchParams.set('attribution', 'bottomright');
    return url.toString();
  }

  if (provider === 'geoapify') {
    const url = new URL('https://maps.geoapify.com/v1/staticmap');
    url.searchParams.set('style', GEOAPIFY_STYLE);
    url.searchParams.set('width', String(width));
    url.searchParams.set('height', String(height));
    url.searchParams.set('center', `lonlat:${lonlat}`);
    url.searchParams.set('zoom', String(zoom));
    url.searchParams.set('scaleFactor', '2');
    url.searchParams.set('marker', `lonlat:${lonlat};type:material;color:${MARKER_COLOUR};size:medium`);
    url.searchParams.set('apiKey', apiKey);
    return url.toString();
  }

  return null;
}

function round(n: number): string {
  return String(Math.round(n * 1e6) / 1e6);
}
