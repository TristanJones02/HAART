import { describe, expect, it, vi } from 'vitest';
import type { SanityClient } from '@sanity/client';
import type { Animal } from '@/lib/content/types';
import { createSanitySource, mapSanityAnimal, overlayFromSanity, overlayOne } from './sanity';
import { AdapterUnavailableError, slugFor } from './types';

const animal = (overrides: Partial<Animal> & Pick<Animal, 'name' | 'haartId'>): Animal => ({
  _type: 'animal',
  slug: slugFor(overrides.name, overrides.haartId),
  species: 'dog',
  status: 'available',
  fosterNeeded: false,
  goodWith: { kids: 'unknown', cats: 'unknown', dogs: 'unknown' },
  description: [],
  photos: [],
  source: 'petrescue',
  ...overrides,
});

const projected = {
  _id: 'animal-hd26-051',
  _type: 'animal',
  name: 'Arabella',
  slug: 'arabella-hd26-051',
  haartId: 'HD26-051',
  species: 'dog',
  status: 'pending',
  fosterNeeded: true,
  sex: 'female',
  breed: 'Kelpie x Shar Pei',
  ageText: '7 years',
  ageBand: 'adult',
  size: 'medium',
  goodWith: { kids: 'yes', cats: 'unknown', dogs: 'no', kidsAgeNote: '13 and over' },
  fee: 450,
  medicalNote: 'Needs a joint supplement.',
  summary: 'Loves the beach.',
  description: [{ _type: 'block', _key: 'a', children: [{ _type: 'span', text: 'Hi' }] }],
  photos: [
    {
      _type: 'imageWithAlt',
      _key: 'p1',
      alt: 'Tan kelpie cross on a rug',
      sensitive: false,
      url: 'https://cdn.sanity.io/images/x/production/abc-1200x900.jpg',
      width: 1200,
      height: 900,
      lqip: 'data:image/jpeg;base64,xyz',
      hotspot: { x: 0.5, y: 0.4, width: 0.6, height: 0.6 },
      image: { _type: 'image', asset: { _ref: 'image-abc-1200x900-jpg', _type: 'reference' }, hotspot: { x: 0.5, y: 0.4, width: 0.6, height: 0.6 } },
    },
    { _type: 'imageWithAlt', _key: 'p2', alt: 'no asset yet' },
  ],
  listedAt: '2026-06-02',
  story: { slug: 'arabella-comes-home', title: 'Arabella comes home' },
};

describe('mapSanityAnimal', () => {
  it('maps a projected document', () => {
    const a = mapSanityAnimal(projected);
    expect(a).toMatchObject({
      _id: 'animal-hd26-051',
      name: 'Arabella',
      slug: 'arabella-hd26-051',
      haartId: 'HD26-051',
      species: 'dog',
      status: 'pending',
      fosterNeeded: true,
      goodWith: { kids: 'yes', cats: 'unknown', dogs: 'no', kidsAgeNote: '13 and over' },
      fee: 450,
      medicalNote: 'Needs a joint supplement.',
      summary: 'Loves the beach.',
      story: { slug: 'arabella-comes-home', title: 'Arabella comes home' },
      source: 'sanity',
    });
    expect(a!.photos).toHaveLength(1);
    expect(a!.photos[0]).toMatchObject({ alt: 'Tan kelpie cross on a rug', url: projected.photos[0].url, width: 1200, height: 900, lqip: 'data:image/jpeg;base64,xyz' });
    expect(a!.photos[0].image?.asset).toEqual({ _ref: 'image-abc-1200x900-jpg', _type: 'reference' });
    expect(a!.description).toHaveLength(1);
  });

  it('normalises ids, builds a slug when missing and defaults what it cannot trust', () => {
    const a = mapSanityAnimal({ name: 'Indi', haartId: 'hd26 - 65', species: 'dog', status: 'bogus', goodWith: { kids: 'maybe' } });
    expect(a).toMatchObject({ haartId: 'HD26-065', slug: 'indi-hd26-065', status: 'available', fosterNeeded: false, goodWith: { kids: 'unknown' }, photos: [], description: [] });
  });

  it('returns null for documents without a name or a dog/cat species', () => {
    expect(mapSanityAnimal(null)).toBeNull();
    expect(mapSanityAnimal({ name: 'X' })).toBeNull();
    expect(mapSanityAnimal({ species: 'dog' })).toBeNull();
    expect(mapSanityAnimal({ name: 'X', species: 'rabbit' })).toBeNull();
  });
});

describe('createSanitySource', () => {
  it('passes the revalidation hints as the third argument and maps the result', async () => {
    const fetch = vi.fn(async (query: string) => (query.includes('[0]') ? projected : [projected, { name: 'bad' }]));
    const client = { fetch } as unknown as SanityClient;
    const source = createSanitySource(client);

    const all = await source.list({ species: 'dog', status: 'adoptable', limit: 10 });
    expect(all.map((a) => a.name)).toEqual(['Arabella']);
    const [query, params, options] = fetch.mock.calls[0] as unknown as [string, Record<string, unknown>, Record<string, unknown>];
    expect(query).toContain('_type == "animal"');
    expect(query).toContain('species == $species');
    expect(query).toContain('status in $statuses');
    expect(query).toContain('[0...10]');
    expect(query).toContain('"url": asset->url');
    expect(query).toContain('story->{ "slug": slug.current, title }');
    expect(params).toEqual({ species: 'dog', statuses: ['available', 'pending', 'on_hold'] });
    expect(options).toEqual({ next: { revalidate: 300, tags: ['animals'] } });

    expect((await source.get('arabella-hd26-051'))?.name).toBe('Arabella');
    expect((await source.getByHaartId('hd26-51'))?.name).toBe('Arabella');
    const byIdCall = fetch.mock.calls[2] as unknown as [string, Record<string, unknown>];
    expect(byIdCall[1]).toEqual({ id: 'HD26-051' });
  });

  it('throws AdapterUnavailableError when the client is missing or fails', async () => {
    await expect(createSanitySource(null).list()).rejects.toBeInstanceOf(AdapterUnavailableError);
    const failing = { fetch: vi.fn(async () => { throw new Error('boom'); }) } as unknown as SanityClient;
    const err = await createSanitySource(failing).get('x').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(AdapterUnavailableError);
    expect((err as AdapterUnavailableError).source).toBe('sanity');
  });
});

describe('overlayFromSanity', () => {
  const petrescuePhoto = { alt: 'Rosie on the beach', url: 'https://www.petrescue.com.au/r.jpg' };
  const sanityPhoto = { alt: 'Rosie in the studio', url: 'https://cdn.sanity.io/r.jpg' };
  const base = [
    animal({ name: 'Rosemary', haartId: 'HD26-44', summary: 'From PetRescue', photos: [petrescuePhoto] }),
    animal({ name: 'Kuba', haartId: 'HD26-018' }),
    animal({ name: 'Nameless', haartId: 'PR-1' }),
  ];
  const sanity = [
    animal({ name: 'Rosemary', haartId: 'HD26-044', source: 'sanity', fosterNeeded: true, story: { slug: 'rosie-safe', title: 'Rosie is safe' }, medicalNote: 'Vet check due', summary: 'From Sanity', photos: [sanityPhoto], status: 'adopted' }),
    animal({ name: 'Kuba', haartId: 'HD26-018', source: 'sanity', photos: [sanityPhoto] }),
    animal({ name: 'Thing', haartId: 'HC25-020', source: 'sanity', species: 'cat' }),
  ];

  it('layers the Sanity-only fields over the base record and keeps the base identity', () => {
    const merged = overlayFromSanity(base, sanity);
    const rosie = merged.find((a) => a.name === 'Rosemary')!;
    expect(rosie).toMatchObject({ source: 'petrescue', status: 'available', fosterNeeded: true, story: { slug: 'rosie-safe', title: 'Rosie is safe' }, medicalNote: 'Vet check due', summary: 'From Sanity' });
    expect(rosie.photos).toEqual([petrescuePhoto]);
  });

  it('uses Sanity photos only when the base has none', () => {
    const kuba = overlayFromSanity(base, sanity).find((a) => a.name === 'Kuba')!;
    expect(kuba.photos).toEqual([sanityPhoto]);
    expect(kuba.fosterNeeded).toBe(false);
  });

  it('appends Sanity-only animals by default and can be told not to', () => {
    expect(overlayFromSanity(base, sanity).map((a) => a.name)).toEqual(['Rosemary', 'Kuba', 'Nameless', 'Thing']);
    expect(overlayFromSanity(base, sanity, { appendUnmatched: false }).map((a) => a.name)).toEqual(['Rosemary', 'Kuba', 'Nameless']);
  });

  it('overlayOne is a no-op without a document', () => {
    expect(overlayOne(base[0], null)).toBe(base[0]);
  });
});
