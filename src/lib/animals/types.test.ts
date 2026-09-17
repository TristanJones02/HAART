import { describe, expect, it } from 'vitest';
import type { Animal } from '@/lib/content/types';
import {
  ageBandFrom,
  ageInMonths,
  applyFilters,
  applySourceFilters,
  extractHaartId,
  isHaartId,
  normaliseHaartId,
  slugFor,
  sortAnimals,
  statusLabel,
  truncate,
} from './types';

const animal = (overrides: Partial<Animal> & Pick<Animal, 'name' | 'haartId'>): Animal => ({
  _type: 'animal',
  slug: slugFor(overrides.name, overrides.haartId),
  species: 'dog',
  status: 'available',
  fosterNeeded: false,
  goodWith: { kids: 'unknown', cats: 'unknown', dogs: 'unknown' },
  description: [],
  photos: [],
  source: 'mock',
  ...overrides,
});

describe('normaliseHaartId', () => {
  it('zero-pads the sequence', () => {
    expect(normaliseHaartId('HD26-44')).toBe('HD26-044');
  });
  it('removes spaces around the dash', () => {
    expect(normaliseHaartId('HD26 - 065')).toBe('HD26-065');
    expect(normaliseHaartId(' HD26 - 44 ')).toBe('HD26-044');
  });
  it('uppercases', () => {
    expect(normaliseHaartId('hc26-005')).toBe('HC26-005');
  });
  it('leaves canonical ids alone', () => {
    expect(normaliseHaartId('HD25-003')).toBe('HD25-003');
    expect(normaliseHaartId('HC26-005')).toBe('HC26-005');
  });
  it('does not turn a WordPress fallback slug into an id', () => {
    expect(normaliseHaartId('3380-2')).toBe('3380-2');
    expect(isHaartId('3380-2')).toBe(false);
    expect(extractHaartId('Poppy 3380-2')).toBeNull();
  });
  it('handles empty input', () => {
    expect(normaliseHaartId(undefined)).toBe('');
    expect(normaliseHaartId(null)).toBe('');
    expect(isHaartId('')).toBe(false);
  });
  it('recognises valid ids', () => {
    expect(isHaartId('HD26-44')).toBe(true);
    expect(isHaartId('HD26 - 065')).toBe(true);
    expect(isHaartId('HX26-001')).toBe(false);
  });
});

describe('extractHaartId', () => {
  it('finds the id in a messy title and normalises it', () => {
    expect(extractHaartId('Rosemary HD26-44')).toBe('HD26-044');
    expect(extractHaartId('Indi HD26 - 065')).toBe('HD26-065');
    expect(extractHaartId('Grace Kelly HC26-005 *On Hold**')).toBe('HC26-005');
    expect(extractHaartId('Maxi HD25-003 **foster carer needed**')).toBe('HD25-003');
  });
  it('returns null when there is none', () => {
    expect(extractHaartId('Just a name')).toBeNull();
    expect(extractHaartId('')).toBeNull();
  });
});

describe('slugFor', () => {
  it('joins the name and the normalised id', () => {
    expect(slugFor('Rosemary', 'HD26-44')).toBe('rosemary-hd26-044');
    expect(slugFor('Indi', 'HD26 - 065')).toBe('indi-hd26-065');
    expect(slugFor('John Wayne', 'HC26-002')).toBe('john-wayne-hc26-002');
  });
  it('does not repeat an id already in the name', () => {
    expect(slugFor('Rosemary HD26-44', 'HD26-44')).toBe('rosemary-hd26-044');
  });
  it('strips punctuation and diacritics', () => {
    expect(slugFor("Zoë O'Neil", 'HC26-010')).toBe('zoe-o-neil-hc26-010');
  });
  it('survives an empty name', () => {
    expect(slugFor('', 'HD26-001')).toBe('hd26-001');
    expect(slugFor('', '')).toBe('animal');
  });
});

describe('statusLabel', () => {
  it('maps every status', () => {
    expect(statusLabel('available')).toBe('Available');
    expect(statusLabel('pending')).toBe('Application pending');
    expect(statusLabel('on_hold')).toBe('On hold');
    expect(statusLabel('adopted')).toBe('Adopted');
    expect(statusLabel('unknown')).toBe('Status unknown');
  });
  it('falls back for anything else', () => {
    expect(statusLabel(undefined)).toBe('Status unknown');
    expect(statusLabel('rehomed')).toBe('Status unknown');
  });
});

describe('ageInMonths and ageBandFrom', () => {
  const now = new Date('2026-09-17T00:00:00Z');

  it('parses the ways HAART writes ages', () => {
    expect(ageInMonths('10 weeks')).toBeCloseTo(2.3, 1);
    expect(ageInMonths('8 months')).toBe(8);
    expect(ageInMonths('~18-month-old')).toBe(18);
    expect(ageInMonths('7 years')).toBe(84);
    expect(ageInMonths('17 year old')).toBe(204);
    expect(ageInMonths('1.5 years')).toBe(18);
    expect(ageInMonths('2 years 3 months')).toBe(27);
    expect(ageInMonths('Adult')).toBeUndefined();
    expect(ageInMonths(undefined)).toBeUndefined();
  });

  it('parses an ISO date of birth relative to now', () => {
    expect(ageInMonths('2024-08-15', now)).toBeCloseTo(25, 0);
    expect(ageBandFrom('2024-08-15', 'dog', now)).toBe('young');
    expect(ageBandFrom('2026-07-01', 'cat', now)).toBe('kitten');
    expect(ageBandFrom('2010-01-01', 'dog', now)).toBe('senior');
  });

  it('bands dogs', () => {
    expect(ageBandFrom('10 weeks', 'dog')).toBe('puppy');
    expect(ageBandFrom('8 months', 'dog')).toBe('puppy');
    expect(ageBandFrom('18 months', 'dog')).toBe('young');
    expect(ageBandFrom('4 years', 'dog')).toBe('adult');
    expect(ageBandFrom('7 years', 'dog')).toBe('adult');
    expect(ageBandFrom('10 years', 'dog')).toBe('senior');
  });

  it('bands cats', () => {
    expect(ageBandFrom('10 weeks', 'cat')).toBe('kitten');
    expect(ageBandFrom('2 years', 'cat')).toBe('young');
    expect(ageBandFrom('8 years', 'cat')).toBe('adult');
    expect(ageBandFrom('17 years', 'cat')).toBe('senior');
  });

  it('respects words in the text', () => {
    expect(ageBandFrom('Domestic Short Hair kitten', 'cat')).toBe('kitten');
    expect(ageBandFrom('senior', 'dog')).toBe('senior');
    expect(ageBandFrom('baby', 'cat')).toBe('kitten');
    expect(ageBandFrom('baby', 'dog')).toBe('puppy');
    expect(ageBandFrom('no idea', 'dog')).toBeUndefined();
  });
});

describe('applyFilters', () => {
  const list: Animal[] = [
    animal({ name: 'Creed', haartId: 'HD26-050', ageText: '4 years', size: 'large', goodWith: { kids: 'yes', cats: 'yes', dogs: 'yes' } }),
    animal({ name: 'Troop', haartId: 'HD26-040', ageText: '10 weeks', size: 'small', fosterNeeded: true }),
    animal({ name: 'Nia', haartId: 'HC25-024', species: 'cat', ageText: '17 years', status: 'on_hold' }),
    animal({ name: 'Old', haartId: 'HD24-001', status: 'adopted' }),
    animal({ name: 'Artie', haartId: 'HD21-041', status: 'unknown' }),
  ];

  it('hides adopted animals unless asked', () => {
    expect(applyFilters(list).map((a) => a.name)).toEqual(['Creed', 'Troop', 'Nia', 'Artie']);
    expect(applyFilters(list, { includeAdopted: true })).toHaveLength(5);
  });
  it('filters by species', () => {
    expect(applyFilters(list, { species: 'cat' }).map((a) => a.name)).toEqual(['Nia']);
  });
  it('filters by derived age band', () => {
    expect(applyFilters(list, { ageBand: 'puppy' }).map((a) => a.name)).toEqual(['Troop']);
    expect(applyFilters(list, { ageBand: 'senior' }).map((a) => a.name)).toEqual(['Nia']);
  });
  it('filters by size and compatibility only when true', () => {
    expect(applyFilters(list, { size: 'large' }).map((a) => a.name)).toEqual(['Creed']);
    expect(applyFilters(list, { goodWithKids: true }).map((a) => a.name)).toEqual(['Creed']);
    expect(applyFilters(list, { goodWithKids: false })).toHaveLength(4);
    expect(applyFilters(list, { goodWithCats: true, goodWithDogs: true }).map((a) => a.name)).toEqual(['Creed']);
  });
  it('filters by foster needed', () => {
    expect(applyFilters(list, { fosterNeeded: true }).map((a) => a.name)).toEqual(['Troop']);
  });
  it('ignores unrecognised age band and size strings from form state or query params', () => {
    expect(applyFilters(list, { ageBand: 'puppies', size: 'huge' })).toHaveLength(4);
    expect(applyFilters(list, { ageBand: '', size: '' })).toHaveLength(4);
  });
});

describe('applySourceFilters', () => {
  const list: Animal[] = [
    animal({ name: 'A', haartId: 'HD26-001', status: 'available' }),
    animal({ name: 'B', haartId: 'HD26-002', status: 'pending' }),
    animal({ name: 'C', haartId: 'HD26-003', status: 'on_hold', fosterNeeded: true }),
    animal({ name: 'D', haartId: 'HD26-004', status: 'adopted' }),
    animal({ name: 'E', haartId: 'HC26-005', status: 'unknown', species: 'cat' }),
  ];
  it('treats adoptable as available, pending and on_hold', () => {
    expect(applySourceFilters(list, { status: 'adoptable' }).map((a) => a.name)).toEqual(['A', 'B', 'C']);
  });
  it('applies exact status, species, fosterNeeded and limit', () => {
    expect(applySourceFilters(list, { status: 'unknown' }).map((a) => a.name)).toEqual(['E']);
    expect(applySourceFilters(list, { species: 'dog', limit: 2 }).map((a) => a.name)).toEqual(['A', 'B']);
    expect(applySourceFilters(list, { fosterNeeded: true }).map((a) => a.name)).toEqual(['C']);
    expect(applySourceFilters(list, undefined)).toHaveLength(5);
  });
});

describe('sortAnimals', () => {
  const list: Animal[] = [
    animal({ name: 'Bravo', haartId: 'HD26-002', listedAt: '2026-02-01', ageText: '4 years' }),
    animal({ name: 'Alpha', haartId: 'HD26-001', listedAt: '2026-03-01', ageText: '10 weeks' }),
    animal({ name: 'Charlie', haartId: 'HD26-003', ageBand: 'senior' }),
    animal({ name: 'Delta', haartId: 'HD26-004', listedAt: '2026-03-01' }),
  ];
  it('newest first with undated last, ties by name', () => {
    expect(sortAnimals(list, 'newest').map((a) => a.name)).toEqual(['Alpha', 'Delta', 'Bravo', 'Charlie']);
  });
  it('by name', () => {
    expect(sortAnimals(list, 'name').map((a) => a.name)).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);
  });
  it('youngest first with unknown ages last, band used when no exact age', () => {
    expect(sortAnimals(list, 'age').map((a) => a.name)).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);
  });
  it('does not mutate the input', () => {
    const before = list.map((a) => a.name);
    sortAnimals(list, 'name');
    expect(list.map((a) => a.name)).toEqual(before);
  });
});

describe('truncate', () => {
  it('leaves short text alone and cuts long text on a word', () => {
    expect(truncate('Short', 120)).toBe('Short');
    const long = 'Arabella is a 7-year-old medium-sized Kelpie x Shar Pei mix who enjoys her daily walks, loves chasing the ball and bringing it back.';
    const cut = truncate(long, 120);
    expect(cut.length).toBeLessThanOrEqual(120);
    expect(cut.endsWith('…')).toBe(true);
    expect(cut).not.toMatch(/\s…$/);
  });
});
