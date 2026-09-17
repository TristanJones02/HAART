import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { MOCK_ANIMALS, listedAtFromHaartId } from '@/lib/mock/animals';
import { createMockSource, mockSource } from './mock';
import { HAART_ID_RE } from './types';

describe('MOCK_ANIMALS integrity', () => {
  it('has the 36 inventoried animals, 21 dogs and 15 cats', () => {
    expect(MOCK_ANIMALS).toHaveLength(36);
    expect(MOCK_ANIMALS.filter((a) => a.species === 'dog')).toHaveLength(21);
    expect(MOCK_ANIMALS.filter((a) => a.species === 'cat')).toHaveLength(15);
  });

  it('has unique slugs and ids', () => {
    const slugs = MOCK_ANIMALS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const ids = MOCK_ANIMALS.map((a) => a._id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every haartId is canonical and exactly one pair collides (Maxi and Tazzie, blocker F7)', () => {
    for (const a of MOCK_ANIMALS) expect(a.haartId).toMatch(HAART_ID_RE);
    const counts = new Map<string, string[]>();
    for (const a of MOCK_ANIMALS) counts.set(a.haartId, [...(counts.get(a.haartId) ?? []), a.name]);
    const duplicates = [...counts.entries()].filter(([, names]) => names.length > 1);
    expect(duplicates).toEqual([['HD25-003', ['Maxi', 'Tazzie']]]);
  });

  it('normalised the messy source ids and slugs from the audit', () => {
    const by = (name: string) => MOCK_ANIMALS.find((a) => a.name === name)!;
    expect(by('Rosemary')).toMatchObject({ haartId: 'HD26-044', slug: 'rosemary-hd26-044' });
    expect(by('Indi')).toMatchObject({ haartId: 'HD26-065', slug: 'indi-hd26-065' });
    expect(by('Poppy')).toMatchObject({ haartId: 'HD26-042', slug: 'poppy-hd26-042' });
    expect(by('Sabrina')).toMatchObject({ haartId: 'HC25-028', slug: 'sabrina-hc25-028' });
    expect(by('John Wayne')).toMatchObject({ haartId: 'HC26-002', slug: 'john-wayne-hc26-002' });
  });

  it('every animal has one to three placeholder photos that exist on disk, with honest alt text', () => {
    const root = path.resolve(__dirname, '../../../public');
    for (const a of MOCK_ANIMALS) {
      expect(a.photos.length).toBeGreaterThanOrEqual(1);
      expect(a.photos.length).toBeLessThanOrEqual(3);
      for (const p of a.photos) {
        expect(p.alt).toContain('Placeholder image');
        expect(p.alt).toContain(a.name);
        expect(p.url).toMatch(new RegExp(`^/placeholders/${a.species}-[1-6]\\.svg$`));
        expect(existsSync(path.join(root, p.url!))).toBe(true);
        expect(p.width).toBe(1200);
        expect(p.height).toBe(900);
      }
    }
    const used = new Set(MOCK_ANIMALS.flatMap((a) => a.photos.map((p) => p.url)));
    expect(used.size).toBe(12);
  });

  it('keeps statuses exactly as inventoried, including unknown for the stale listings (F8)', () => {
    const status = (name: string) => MOCK_ANIMALS.find((a) => a.name === name)!.status;
    expect(status('Artie')).toBe('unknown');
    expect(status('Wayne')).toBe('unknown');
    expect(status('Charlotte')).toBe('on_hold');
    expect(status('Thing')).toBe('on_hold');
    expect(status('Nia')).toBe('on_hold');
    expect(status('John Wayne')).toBe('on_hold');
    expect(status('Grace Kelly')).toBe('on_hold');
    expect(status('Mowgli')).toBe('available');
    expect(MOCK_ANIMALS.filter((a) => a.fosterNeeded).map((a) => a.name).sort()).toEqual(['Maxi', 'Sage']);
  });

  it('applies the fee policy from the audit', () => {
    for (const cat of MOCK_ANIMALS.filter((a) => a.species === 'cat')) {
      expect(cat.fee).toBe(200);
      expect(cat.feeNote).toBeUndefined();
    }
    const tazzie = MOCK_ANIMALS.find((a) => a.name === 'Tazzie')!;
    expect(tazzie.fee).toBe(625);
    expect(tazzie.feeNote).toBeUndefined();
    for (const dog of MOCK_ANIMALS.filter((a) => a.species === 'dog' && a.name !== 'Tazzie')) {
      expect(dog.fee).toBeUndefined();
      expect(dog.feeNote).toBe('Confirm with HAART');
    }
    expect(MOCK_ANIMALS.every((a) => a.petrescueUrl === undefined)).toBe(true);
  });

  it('does not invent breed, age or sex', () => {
    const nova = MOCK_ANIMALS.find((a) => a.name === 'Nova')!;
    expect(nova.breed).toBeUndefined();
    expect(nova.sex).toBeUndefined();
    expect(nova.ageText).toBeUndefined();
    const mowgli = MOCK_ANIMALS.find((a) => a.name === 'Mowgli')!;
    expect(mowgli.description).toEqual([]);
    expect(mowgli.summary).toBeUndefined();
    const tazzie = MOCK_ANIMALS.find((a) => a.name === 'Tazzie')!;
    expect(tazzie).toMatchObject({ sex: 'male', breed: 'Kelpie X Staffy', dateOfBirth: '2024-08-15', desexed: true, vaccinated: true });
  });

  it('carries the verbatim fragments as Portable Text and a summary of at most 120 characters', () => {
    const artie = MOCK_ANIMALS.find((a) => a.name === 'Artie')!;
    expect(Array.isArray(artie.description)).toBe(true);
    expect(artie.description).toHaveLength(3);
    expect(artie.summary).toBe('Artie is a beautiful big boy who needs a family that has the time and patience to let him feel settled and safe.');
    for (const a of MOCK_ANIMALS) {
      if (a.summary) expect(a.summary.length).toBeLessThanOrEqual(120);
      expect(a.source).toBe('mock');
      expect(a._type).toBe('animal');
      expect(['yes', 'no', 'unknown']).toContain(a.goodWith.kids);
    }
    const creed = MOCK_ANIMALS.find((a) => a.name === 'Creed')!;
    expect(creed.goodWith).toEqual({ kids: 'yes', cats: 'yes', dogs: 'yes' });
    expect(creed).toMatchObject({ weightKg: 35, ageText: '4 years', ageBand: 'adult' });
    expect(MOCK_ANIMALS.find((a) => a.name === 'Armani')!.goodWith.kids).toBe('no');
    expect(MOCK_ANIMALS.find((a) => a.name === 'Blackberry')!.medicalNote).toBe('recovering from leg trauma; strict rehab');
  });

  it('derives a plausible listedAt from the id so sorting works', () => {
    expect(listedAtFromHaartId('HD26-051')).toBe('2026-06-02');
    expect(listedAtFromHaartId('HD25-003')).toBe('2025-01-09');
    expect(listedAtFromHaartId('HD25-308')).toBe('2025-12-31');
    expect(listedAtFromHaartId('nope')).toBeUndefined();
    for (const a of MOCK_ANIMALS) {
      expect(a.listedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.listedAt!.slice(2, 4)).toBe(a.haartId.slice(2, 4));
    }
  });
});

describe('mockSource', () => {
  it('lists newest first and honours filters', async () => {
    const all = await mockSource.list();
    expect(all).toHaveLength(36);
    expect(all[0].listedAt! >= all[all.length - 1].listedAt!).toBe(true);
    expect(await mockSource.list({ species: 'cat' })).toHaveLength(15);
    expect((await mockSource.list({ fosterNeeded: true })).map((a) => a.name).sort()).toEqual(['Maxi', 'Sage']);
    expect(await mockSource.list({ status: 'adoptable' })).toHaveLength(34);
    expect(await mockSource.list({ status: 'unknown' })).toHaveLength(2);
    expect(await mockSource.list({ limit: 4 })).toHaveLength(4);
  });

  it('finds by slug and by messy id', async () => {
    expect((await mockSource.get('rosemary-hd26-044'))?.name).toBe('Rosemary');
    expect(await mockSource.get('missing')).toBeNull();
    expect((await mockSource.getByHaartId('hd26 - 44'))?.name).toBe('Rosemary');
    expect((await mockSource.getByHaartId('HD25-003'))?.name).toBe('Maxi');
    expect(await mockSource.getByHaartId('HD99-999')).toBeNull();
  });

  it('can be built over a custom list with a delay', async () => {
    const source = createMockSource({ animals: [MOCK_ANIMALS[0]], delayMs: 1 });
    expect(source.name).toBe('mock');
    expect(await source.list()).toHaveLength(1);
  });
});
