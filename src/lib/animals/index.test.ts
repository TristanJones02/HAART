import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Animal } from '@/lib/content/types';
import { MOCK_ANIMALS } from '@/lib/mock/animals';
import {
  AdapterUnavailableError,
  type AnimalSource,
  countAdoptable,
  createAnimalSource,
  emptySource,
  getAnimal,
  getAnimalByHaartId,
  getAnimalSource,
  getFosterNeeded,
  getRelatedAnimals,
  listAnimals,
  mockSource,
  resetAnimalSource,
  slugFor,
} from './index';

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

const throwing = (name: AnimalSource['name']): AnimalSource => {
  const fail = async () => {
    throw new AdapterUnavailableError(name, `${name} is down`);
  };
  return { name, list: fail, get: fail, getByHaartId: fail };
};

const fixed = (name: AnimalSource['name'], animals: Animal[]): AnimalSource => ({
  name,
  list: async () => animals,
  get: async (slug) => animals.find((a) => a.slug === slug) ?? null,
  getByHaartId: async (id) => animals.find((a) => a.haartId === id) ?? null,
});

afterEach(() => resetAnimalSource());

describe('createAnimalSource fallback', () => {
  it('falls back from a throwing petrescue source to mock and warns once', async () => {
    const warn = vi.fn();
    const source = createAnimalSource({ sources: [throwing('petrescue'), mockSource], warn });

    const list = await source.list();
    expect(list).toHaveLength(36);
    expect(source.name).toBe('mock');
    expect((await source.get('rosemary-hd26-044'))?.name).toBe('Rosemary');
    expect((await source.getByHaartId('HD26-044'))?.name).toBe('Rosemary');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('petrescue');
  });

  it('retries a failed adapter after the cool-down', async () => {
    let clock = 0;
    let calls = 0;
    const flaky: AnimalSource = {
      name: 'petrescue',
      list: async () => {
        calls += 1;
        if (calls === 1) throw new AdapterUnavailableError('petrescue', 'blip');
        return [animal({ name: 'Live', haartId: 'HD26-001' })];
      },
      get: async () => null,
      getByHaartId: async () => null,
    };
    const warn = vi.fn();
    const source = createAnimalSource({ sources: [flaky, mockSource], warn, cooldownMs: 1000, now: () => clock });

    expect(await source.list()).toHaveLength(36);
    expect(await source.list()).toHaveLength(36);
    expect(calls).toBe(1);
    clock = 1001;
    expect((await source.list()).map((a) => a.name)).toEqual(['Live']);
    expect(source.name).toBe('petrescue');
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('ends at an empty source when everything fails', async () => {
    const source = createAnimalSource({ sources: [throwing('petrescue'), throwing('sanity')], warn: () => {} });
    expect(await source.list()).toEqual([]);
    expect(await source.get('x')).toBeNull();
    expect(await source.getByHaartId('HD26-001')).toBeNull();
    expect(source.name).toBe('empty');
  });

  it('propagates errors that are not AdapterUnavailableError', async () => {
    const bug: AnimalSource = { ...emptySource, name: 'sanity', list: async () => { throw new TypeError('bug'); } };
    const source = createAnimalSource({ sources: [bug, mockSource], warn: () => {} });
    await expect(source.list()).rejects.toBeInstanceOf(TypeError);
  });
});

describe('createAnimalSource overlay', () => {
  const petrescue = fixed('petrescue', [
    animal({ name: 'Rosemary', haartId: 'HD26-044', summary: 'From PetRescue' }),
    animal({ name: 'Kuba', haartId: 'HD26-018' }),
  ]);
  const sanity = fixed('sanity', [
    animal({ name: 'Rosemary', haartId: 'HD26-044', source: 'sanity', fosterNeeded: true, story: { slug: 'rosie', title: 'Rosie' }, medicalNote: 'Vet check due' }),
    animal({ name: 'Thing', haartId: 'HC25-020', species: 'cat', source: 'sanity' }),
  ]);

  it('overlays Sanity fields when petrescue serves and applies filters after merging', async () => {
    const source = createAnimalSource({ sources: [petrescue, mockSource], overlay: sanity });
    const all = await source.list();
    expect(all.map((a) => a.name)).toEqual(['Rosemary', 'Kuba', 'Thing']);
    expect(all[0]).toMatchObject({ source: 'petrescue', fosterNeeded: true, story: { slug: 'rosie', title: 'Rosie' }, medicalNote: 'Vet check due', summary: 'From PetRescue' });
    expect((await source.list({ fosterNeeded: true })).map((a) => a.name)).toEqual(['Rosemary']);
    expect((await source.list({ species: 'cat' })).map((a) => a.name)).toEqual(['Thing']);

    expect((await source.get('rosemary-hd26-044'))?.fosterNeeded).toBe(true);
    expect((await source.get('thing-hc25-020'))?.source).toBe('sanity');
    expect((await source.getByHaartId('hd26-44'))?.story?.slug).toBe('rosie');
    expect((await source.getByHaartId('HC25-020'))?.name).toBe('Thing');
  });

  it('does not overlay when a fallback serves, and survives an overlay outage', async () => {
    const warn = vi.fn();
    const viaMock = createAnimalSource({ sources: [throwing('petrescue'), mockSource], overlay: sanity, warn });
    expect((await viaMock.get('rosemary-hd26-044'))?.fosterNeeded).toBe(false);

    const brokenOverlay = createAnimalSource({ sources: [petrescue], overlay: throwing('sanity'), warn });
    expect((await brokenOverlay.list()).map((a) => a.name)).toEqual(['Rosemary', 'Kuba']);
    expect((await brokenOverlay.get('rosemary-hd26-044'))?.fosterNeeded).toBe(false);
    expect(warn).toHaveBeenCalledTimes(2);
  });
});

describe('default resolution and page helpers (test environment: no credentials, mock allowed)', () => {
  it('caches one source per process and resolves to mock', async () => {
    const a = getAnimalSource();
    const b = getAnimalSource();
    expect(a).toBe(b);
    await a.list();
    expect(a.name).toBe('mock');
    resetAnimalSource();
    expect(getAnimalSource()).not.toBe(a);
    expect(getAnimalSource({ sources: [mockSource] })).not.toBe(getAnimalSource());
  });

  it('listAnimals, getAnimal and getAnimalByHaartId', async () => {
    expect(await listAnimals()).toHaveLength(36);
    expect(await listAnimals({ species: 'cat', status: 'adoptable' })).toHaveLength(14);
    expect((await getAnimal('indi-hd26-065'))?.name).toBe('Indi');
    expect((await getAnimalByHaartId('hd26 - 65'))?.name).toBe('Indi');
    expect(await getAnimal('nope')).toBeNull();
  });

  it('getFosterNeeded returns adoptable foster-needed animals newest first', async () => {
    const all = await getFosterNeeded();
    expect(all.map((a) => a.name)).toEqual(['Sage', 'Maxi']);
    expect(await getFosterNeeded(1)).toHaveLength(1);
  });

  it('getRelatedAnimals excludes the animal itself, keeps to the species and adoptable statuses', async () => {
    const arabella = MOCK_ANIMALS.find((a) => a.name === 'Arabella')!;
    const related = await getRelatedAnimals(arabella);
    expect(related).toHaveLength(3);
    expect(related.map((a) => a.name)).toEqual(['Indi', 'Creed', 'Monty']);
    for (const r of related) {
      expect(r.species).toBe('dog');
      expect(r.slug).not.toBe(arabella.slug);
      expect(['available', 'pending', 'on_hold']).toContain(r.status);
    }
    const artie = MOCK_ANIMALS.find((a) => a.name === 'Artie')!;
    expect((await getRelatedAnimals(artie, 50)).some((a) => a.status === 'unknown')).toBe(false);
  });

  it('countAdoptable', async () => {
    expect(await countAdoptable()).toBe(34);
    expect(await countAdoptable('dog')).toBe(20);
    expect(await countAdoptable('cat')).toBe(14);
  });
});
