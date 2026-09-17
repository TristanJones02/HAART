import { describe, expect, it, vi } from 'vitest';
import { createPetRescueSource, extractListings, mapListing, mapPetRescueStatus, stripHtml } from './petrescue';
import { AdapterUnavailableError } from './types';

const full = {
  id: 1234567,
  name: 'Rosemary HD26-44 *foster carer needed*',
  species: { name: 'Dog' },
  breeds: [{ name: 'American Staffordshire Terrier' }, { name: 'Border Collie' }],
  age: '4 months',
  sex: 'female',
  size: 'medium',
  description: '<p>Rosemary (known as Rosie) is sweet &amp; brave.</p><p>Second paragraph.<br>Same paragraph.</p>',
  images: [
    { url: 'https://www.petrescue.com.au/img/1.jpg', large: 'https://www.petrescue.com.au/img/1-large.jpg', medium: 'https://www.petrescue.com.au/img/1-medium.jpg' },
    'https://www.petrescue.com.au/img/2.jpg',
    { medium: '' },
  ],
  adoption_fee: '$625',
  status: 'active',
  url: 'https://www.petrescue.com.au/listings/1234567',
  good_with_kids: true,
  good_with_cats: false,
  good_with_dogs: null,
  desexed: true,
  vaccinated: 'yes',
  microchipped: false,
  location: { suburb: 'Perth', state: 'WA' },
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-02T00:00:00Z',
};

describe('mapListing', () => {
  it('maps a full record', () => {
    const a = mapListing(full);
    expect(a).not.toBeNull();
    expect(a).toMatchObject({
      _type: 'animal',
      _id: 'petrescue-1234567',
      name: 'Rosemary',
      slug: 'rosemary-hd26-044',
      haartId: 'HD26-044',
      species: 'dog',
      status: 'available',
      fosterNeeded: true,
      sex: 'female',
      breed: 'American Staffordshire Terrier x Border Collie',
      ageText: '4 months',
      ageBand: 'puppy',
      size: 'medium',
      goodWith: { kids: 'yes', cats: 'no', dogs: 'unknown' },
      fee: 625,
      desexed: true,
      vaccinated: true,
      microchipped: false,
      petrescueId: '1234567',
      petrescueUrl: 'https://www.petrescue.com.au/listings/1234567',
      listedAt: '2026-06-01T00:00:00Z',
      location: 'Perth, WA',
      source: 'petrescue',
    });
    expect(a!.photos).toEqual([
      { _type: 'imageWithAlt', url: 'https://www.petrescue.com.au/img/1-large.jpg', alt: 'Rosemary, American Staffordshire Terrier x Border Collie available for adoption through HAART' },
      { _type: 'imageWithAlt', url: 'https://www.petrescue.com.au/img/2.jpg', alt: 'Rosemary, American Staffordshire Terrier x Border Collie available for adoption through HAART' },
    ]);
    expect(a!.summary).toBe('Rosemary (known as Rosie) is sweet & brave.');
    expect(Array.isArray(a!.description)).toBe(true);
    expect(a!.description).toHaveLength(2);
    expect(a!.adoptedAt).toBeUndefined();
    expect('feeNote' in a!).toBe(false);
  });

  it('maps a sparse record', () => {
    const a = mapListing({ id: 'abc', name: 'Nameless', species: 'cat' });
    expect(a).toMatchObject({
      name: 'Nameless',
      haartId: 'PR-ABC',
      slug: 'nameless-pr-abc',
      species: 'cat',
      status: 'available',
      fosterNeeded: false,
      goodWith: { kids: 'unknown', cats: 'unknown', dogs: 'unknown' },
      photos: [],
      description: [],
      petrescueId: 'abc',
      petrescueUrl: 'https://www.petrescue.com.au/listings/abc',
      source: 'petrescue',
    });
    expect(a!.summary).toBeUndefined();
    expect(a!.breed).toBeUndefined();
  });

  it('infers species from the HAART ID when the record has none, and uses the photo alt when the breed is unknown', () => {
    const a = mapListing({ id: 9, name: 'Grace Kelly HC26-005', status: 'On Hold', photos: [{ url: 'https://www.petrescue.com.au/p.jpg' }] });
    expect(a).toMatchObject({ species: 'cat', status: 'on_hold', haartId: 'HC26-005', name: 'Grace Kelly', slug: 'grace-kelly-hc26-005' });
    expect(a!.photos[0].alt).toBe('Grace Kelly, cat available for adoption through HAART');
  });

  it('maps statuses', () => {
    expect(mapPetRescueStatus('active')).toBe('available');
    expect(mapPetRescueStatus('on_hold')).toBe('on_hold');
    expect(mapPetRescueStatus('on hold')).toBe('on_hold');
    expect(mapPetRescueStatus('adopted')).toBe('adopted');
    expect(mapPetRescueStatus('rehomed')).toBe('adopted');
    expect(mapPetRescueStatus('pending')).toBe('pending');
    expect(mapPetRescueStatus('something else')).toBe('available');
    expect(mapPetRescueStatus(undefined)).toBe('available');
    const adopted = mapListing({ id: 1, name: 'Old HD24-001', status: 'rehomed', updated_at: '2026-01-01' });
    expect(adopted).toMatchObject({ status: 'adopted', adoptedAt: '2026-01-01' });
  });

  it('handles object ages and free-text fees', () => {
    expect(mapListing({ id: 1, name: 'A HD26-001', age: { years: 2, months: 3 } })).toMatchObject({ ageText: '2 years 3 months', ageBand: 'young' });
    expect(mapListing({ id: 1, name: 'A HD26-001', date_of_birth: '2010-01-01' })).toMatchObject({ dateOfBirth: '2010-01-01', ageBand: 'senior' });
    expect(mapListing({ id: 1, name: 'A HD26-001', adoption_fee: 'Contact the group' })).toMatchObject({ feeNote: 'Contact the group' });
    expect(mapListing({ id: 1, name: 'A HD26-001', adoption_fee: 200 })).toMatchObject({ fee: 200 });
    expect(mapListing({ id: 1, name: 'A HD26-001', size: 'Extra Large' })).toMatchObject({ size: 'extra-large' });
  });

  it('returns null for garbage and never throws', () => {
    for (const bad of [null, undefined, 42, 'string', [], {}, { id: 1 }, { name: 'x' }, { id: 1, name: '' }, { id: 1, name: 'Bunny', species: 'rabbit' }]) {
      expect(mapListing(bad)).toBeNull();
    }
    const weird = mapListing({ id: 1, name: 'Odd HD26-002', species: 'dog', images: { not: 'array' }, breeds: 'x', good_with_kids: {}, age: [], location: 5, adoption_fee: {} });
    expect(weird).not.toBeNull();
    expect(weird).toMatchObject({ photos: [], goodWith: { kids: 'unknown', cats: 'unknown', dogs: 'unknown' } });
    expect(weird!.breed).toBeUndefined();
    expect(weird!.fee).toBeUndefined();
    const circular: Record<string, unknown> = { id: 1, name: 'Loop HD26-003' };
    circular.self = circular;
    expect(() => mapListing(circular)).not.toThrow();
  });
});

describe('extractListings and stripHtml', () => {
  it('accepts bare arrays and common wrappers', () => {
    expect(extractListings([1, 2])).toEqual([1, 2]);
    expect(extractListings({ listings: [1] })).toEqual([1]);
    expect(extractListings({ data: [2] })).toEqual([2]);
    expect(extractListings({ nope: 1 })).toEqual([]);
    expect(extractListings('x')).toEqual([]);
  });
  it('keeps paragraph breaks', () => {
    expect(stripHtml('<p>One</p><p>Two<br>Three</p>')).toBe('One\n\nTwo\nThree');
    expect(stripHtml('plain')).toBe('plain');
  });
});

const listing = (i: number, extra: Record<string, unknown> = {}) => ({ id: i, name: `Dog ${i} HD26-${String(i).padStart(3, '0')}`, species: 'dog', ...extra });
const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });

describe('createPetRescueSource', () => {
  it('pages through results, sends the token and the cache hints, and stops on a short page', async () => {
    const pages = [Array.from({ length: 50 }, (_, i) => listing(i + 1)), Array.from({ length: 3 }, (_, i) => listing(i + 51))];
    const fetchImpl = vi.fn(async () => ok(pages.shift() ?? []));
    const source = createPetRescueSource({ token: 'test-token', groupId: '10046', baseUrl: 'https://example.test/api/', fetchImpl: fetchImpl as unknown as typeof fetch });

    const all = await source.list();
    expect(all).toHaveLength(53);
    expect(fetchImpl).toHaveBeenCalledTimes(2);

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit & { next?: unknown }];
    expect(url).toBe('https://example.test/api/listings?group_id=10046&per_page=50&page=1');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer test-token');
    expect(init.next).toEqual({ revalidate: 900, tags: ['animals'] });
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect((fetchImpl.mock.calls[1] as unknown as [string])[0]).toContain('page=2');
  });

  it('stops after five pages', async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      const page = Number(new URL(url).searchParams.get('page'));
      return ok(Array.from({ length: 50 }, (_, i) => listing(page * 1000 + i)));
    });
    const source = createPetRescueSource({ token: 't', fetchImpl: fetchImpl as unknown as typeof fetch });
    expect(await source.list()).toHaveLength(250);
    expect(fetchImpl).toHaveBeenCalledTimes(5);
  });

  it('applies filters and looks up by slug and by messy HAART ID', async () => {
    const fetchImpl = vi.fn(async () => ok([listing(1, { status: 'active' }), listing(2, { status: 'adopted' }), { id: 3, name: 'Puss HC26-005', species: 'cat' }]));
    const source = createPetRescueSource({ token: 't', fetchImpl: fetchImpl as unknown as typeof fetch });
    expect((await source.list({ status: 'adoptable' })).map((a) => a.haartId)).toEqual(['HD26-001', 'HC26-005']);
    expect((await source.list({ species: 'cat' })).map((a) => a.name)).toEqual(['Puss']);
    expect((await source.get('puss-hc26-005'))?.name).toBe('Puss');
    expect(await source.get('nope')).toBeNull();
    expect((await source.getByHaartId('hc26 - 5'))?.name).toBe('Puss');
  });

  it('throws AdapterUnavailableError on a non-2xx response', async () => {
    const fetchImpl = vi.fn(async () => new Response('nope', { status: 401 }));
    const source = createPetRescueSource({ token: 't', fetchImpl: fetchImpl as unknown as typeof fetch });
    const err = await source.list().catch((e: unknown) => e);
    expect(err).toBeInstanceOf(AdapterUnavailableError);
    expect((err as AdapterUnavailableError).source).toBe('petrescue');
    expect((err as Error).message).toContain('401');
  });

  it('throws AdapterUnavailableError on a network failure, keeping the cause', async () => {
    const boom = new TypeError('fetch failed');
    const fetchImpl = vi.fn(async () => {
      throw boom;
    });
    const source = createPetRescueSource({ token: 't', fetchImpl: fetchImpl as unknown as typeof fetch });
    const err = await source.get('x').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(AdapterUnavailableError);
    expect((err as Error).cause).toBe(boom);
  });

  it('throws AdapterUnavailableError on timeout', async () => {
    const fetchImpl = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
        }),
    );
    const source = createPetRescueSource({ token: 't', fetchImpl: fetchImpl as unknown as typeof fetch, timeoutMs: 5 });
    const err = await source.list().catch((e: unknown) => e);
    expect(err).toBeInstanceOf(AdapterUnavailableError);
    expect((err as Error).message).toContain('timed out');
  });

  it('throws AdapterUnavailableError without a token and never calls fetch', async () => {
    const fetchImpl = vi.fn();
    const source = createPetRescueSource({ token: undefined, fetchImpl: fetchImpl as unknown as typeof fetch });
    await expect(source.list()).rejects.toBeInstanceOf(AdapterUnavailableError);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
