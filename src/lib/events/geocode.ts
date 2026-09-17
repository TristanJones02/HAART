import { env } from '@/lib/env';
import type { GeoPoint } from '@/lib/events/normalise';

/**
 * Forward geocoding through Geoapify, used once per event at sync time so
 * the coordinates are stored on the document and never looked up per render
 * (see docs/decisions.md D6). Returns null on any failure and never throws.
 */

export type GeocodeOptions = {
  apiKey?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

const GEOAPIFY_ENDPOINT = 'https://api.geoapify.com/v1/geocode/search';
/** Perth GPO. Results are biased towards it and limited to Australia. */
const PERTH_BIAS = 'proximity:115.8605,-31.9505';
const DEFAULT_TIMEOUT_MS = 6000;

const memo = new Map<string, GeoPoint | null>();

/** Clears the in-memory memo. For tests. */
export function resetGeocodeMemo(): void {
  memo.clear();
}

export async function geocode(address: string | undefined, options: GeocodeOptions = {}): Promise<GeoPoint | null> {
  const query = address?.replace(/\s+/g, ' ').trim();
  if (!query) return null;

  const apiKey = options.apiKey ?? (env.maps.provider === 'geoapify' ? env.maps.apiKey : undefined);
  if (!apiKey) return null;

  const key = query.toLowerCase();
  if (memo.has(key)) return memo.get(key) ?? null;

  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== 'function') return null;

  const url = new URL(GEOAPIFY_ENDPOINT);
  url.searchParams.set('text', query);
  url.searchParams.set('filter', 'countrycode:au');
  url.searchParams.set('bias', PERTH_BIAS);
  url.searchParams.set('limit', '1');
  url.searchParams.set('format', 'json');
  url.searchParams.set('apiKey', apiKey);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetchImpl(url.toString(), {
      signal: controller.signal,
      headers: { accept: 'application/json', 'user-agent': 'haart.org.au events sync (+https://haart.org.au)' },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { results?: Array<{ lat?: unknown; lon?: unknown }> };
    const first = body?.results?.[0];
    const lat = Number(first?.lat);
    const lng = Number(first?.lon);
    // A well-formed "no match" is worth remembering; a transport error is not.
    if (!first) {
      memo.set(key, null);
      return null;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const point = { lat, lng };
    memo.set(key, point);
    return point;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
