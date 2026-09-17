import { beforeEach, describe, expect, it, vi } from 'vitest';
import { geocode, resetGeocodeMemo } from '@/lib/events/geocode';

const okResponse = (lat: number, lon: number) => ({ ok: true, json: async () => ({ results: [{ lat, lon }] }) }) as unknown as Response;

describe('geocode', () => {
  beforeEach(() => resetGeocodeMemo());

  it('returns null without an API key and never calls fetch', async () => {
    const fetchImpl = vi.fn();
    expect(await geocode('Bunnings Melville, Myaree WA 6154', { apiKey: undefined, fetchImpl: fetchImpl as unknown as typeof fetch })).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('queries Geoapify limited to Australia and biased to Perth, and memoises', async () => {
    const fetchImpl = vi.fn<(input: string) => Promise<Response>>().mockResolvedValue(okResponse(-32.0393, 115.8231));
    const opts = { apiKey: 'KEY', fetchImpl: fetchImpl as unknown as typeof fetch };
    expect(await geocode('Bunnings Melville, Myaree WA 6154', opts)).toEqual({ lat: -32.0393, lng: 115.8231 });
    expect(await geocode('  bunnings melville,  myaree wa 6154 ', opts)).toEqual({ lat: -32.0393, lng: 115.8231 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const url = new URL(String(fetchImpl.mock.calls[0]?.[0]));
    expect(url.origin + url.pathname).toBe('https://api.geoapify.com/v1/geocode/search');
    expect(url.searchParams.get('filter')).toBe('countrycode:au');
    expect(url.searchParams.get('bias')).toMatch(/^proximity:115\./);
    expect(url.searchParams.get('text')).toBe('Bunnings Melville, Myaree WA 6154');
    expect(url.searchParams.get('apiKey')).toBe('KEY');
  });

  it('returns null on HTTP errors, bad bodies, thrown errors and empty input', async () => {
    const bad = { ok: false, status: 429, json: async () => ({}) } as unknown as Response;
    expect(await geocode('x', { apiKey: 'K', fetchImpl: (async () => bad) as unknown as typeof fetch })).toBeNull();
    const nonsense = { ok: true, json: async () => ({ results: [{ lat: 'no', lon: 'no' }] }) } as unknown as Response;
    expect(await geocode('y', { apiKey: 'K', fetchImpl: (async () => nonsense) as unknown as typeof fetch })).toBeNull();
    expect(await geocode('z', { apiKey: 'K', fetchImpl: (async () => { throw new Error('boom'); }) as unknown as typeof fetch })).toBeNull();
    expect(await geocode('', { apiKey: 'K', fetchImpl: vi.fn() as unknown as typeof fetch })).toBeNull();
  });
});
