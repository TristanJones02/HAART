'use client';

import { useMemo, useState, type ReactNode } from 'react';
import type { Animal, Species } from '@/lib/content/types';
import { applyFilters, sortAnimals, type AnimalSort } from '@/lib/animals/types';
import { Quad } from '@/components/art';
import { AnimalCard } from './AnimalCard';
import { countWord, plural } from './helpers';

type Filters = {
  ageBand: string;
  size: string;
  goodWithKids: boolean;
  goodWithCats: boolean;
  goodWithDogs: boolean;
  fosterNeeded: boolean;
  includeAdopted: boolean;
  sort: AnimalSort;
};

const initial: Filters = { ageBand: '', size: '', goodWithKids: false, goodWithCats: false, goodWithDogs: false, fosterNeeded: false, includeAdopted: false, sort: 'newest' };

const SIZES: [string, string][] = [
  ['small', 'Small'],
  ['medium', 'Medium'],
  ['large', 'Large'],
  ['extra-large', 'Extra large'],
];

/** Square, 40px, hairline; selected is charcoal-900 with white type. No pills anywhere. */
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-10 items-center border px-3 text-small font-semibold transition-colors duration-150 ${
        active ? 'border-charcoal-900 bg-charcoal-900 text-white' : 'border-charcoal-900 bg-transparent text-charcoal-900 hover:bg-paper-0'
      }`}
    >
      {children}
    </button>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-[color:var(--hairline)] py-3 sm:flex-row sm:items-center sm:gap-4">
      <p className="flex flex-none items-center gap-2 text-rubric uppercase text-[color:var(--rubric)] sm:w-32">
        <Quad />
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function countLine(n: number, species: Species, filtered: boolean): string {
  const noun = plural(n, species === 'dog' ? 'dog' : 'cat', species === 'dog' ? 'dogs' : 'cats');
  if (filtered) {
    if (n === 0) return `No ${species === 'dog' ? 'dogs' : 'cats'} match these filters.`;
    return `${countWord(n, true)} ${noun} ${plural(n, 'matches', 'match')} these filters.`;
  }
  if (n === 0) return `No ${species === 'dog' ? 'dogs' : 'cats'} are listed right now.`;
  return `${countWord(n, true)} ${noun} on the register.`;
}

/**
 * The listing: square filter chips, a computed count line and the register
 * grid. Filtering happens on the already-loaded list, because a rescue lists
 * dozens, not thousands. Nothing animates on filter — four plates wiping in
 * sequence would read as a loading state.
 */
export function AnimalGrid({ animals, species }: { animals: Animal[]; species: Species }) {
  const [f, setF] = useState<Filters>(initial);
  const list = useMemo(
    () =>
      sortAnimals(
        applyFilters(animals, {
          species,
          ageBand: f.ageBand || undefined,
          size: f.size || undefined,
          goodWithKids: f.goodWithKids || undefined,
          goodWithCats: f.goodWithCats || undefined,
          goodWithDogs: f.goodWithDogs || undefined,
          fosterNeeded: f.fosterNeeded || undefined,
          includeAdopted: f.includeAdopted,
        }),
        f.sort,
      ),
    [animals, species, f],
  );

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setF((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: 'goodWithKids' | 'goodWithCats' | 'goodWithDogs' | 'fosterNeeded' | 'includeAdopted') => setF((prev) => ({ ...prev, [key]: !prev[key] }));
  const pick = (key: 'ageBand' | 'size', value: string) => setF((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  const dirty = JSON.stringify(f) !== JSON.stringify(initial);
  // Sorting is not filtering: re-sorting the register must not change the count line's words.
  const filtered = JSON.stringify({ ...f, sort: initial.sort }) !== JSON.stringify(initial);

  const ages: [string, string][] =
    species === 'dog'
      ? [['puppy', 'Puppy'], ['young', 'Young'], ['adult', 'Adult'], ['senior', 'Senior']]
      : [['kitten', 'Kitten'], ['young', 'Young'], ['adult', 'Adult'], ['senior', 'Senior']];

  return (
    <div>
      <form className="mb-8 border-t border-charcoal-900" onSubmit={(e) => e.preventDefault()} aria-label={`Filter ${species === 'dog' ? 'dogs' : 'cats'}`}>
        <FilterRow label="Age">
          {ages.map(([value, label]) => (
            <Chip key={value} active={f.ageBand === value} onClick={() => pick('ageBand', value)}>
              {label}
            </Chip>
          ))}
        </FilterRow>
        {species === 'dog' ? (
          <FilterRow label="Size">
            {SIZES.map(([value, label]) => (
              <Chip key={value} active={f.size === value} onClick={() => pick('size', value)}>
                {label}
              </Chip>
            ))}
          </FilterRow>
        ) : null}
        <FilterRow label="Good with">
          <Chip active={f.goodWithKids} onClick={() => toggle('goodWithKids')}>
            Children
          </Chip>
          <Chip active={f.goodWithCats} onClick={() => toggle('goodWithCats')}>
            Cats
          </Chip>
          <Chip active={f.goodWithDogs} onClick={() => toggle('goodWithDogs')}>
            Dogs
          </Chip>
        </FilterRow>
        <FilterRow label="Also show">
          <Chip active={f.fosterNeeded} onClick={() => toggle('fosterNeeded')}>
            Needs a foster
          </Chip>
          <Chip active={f.includeAdopted} onClick={() => toggle('includeAdopted')}>
            Adopted animals
          </Chip>
        </FilterRow>
        <FilterRow label="Sort by">
          <select
            className="h-10 border border-charcoal-900 bg-transparent px-2 font-body text-small font-semibold text-charcoal-900"
            aria-label="Sort the register"
            value={f.sort}
            onChange={(e) => set('sort', e.target.value as AnimalSort)}
          >
            <option value="newest">Newest</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
          </select>
          {dirty ? (
            <button type="button" className="rule-link ml-2" onClick={() => setF(initial)}>
              Clear filters
            </button>
          ) : null}
        </FilterRow>
      </form>

      <p className="mb-6 text-feature font-display" aria-live="polite">
        {countLine(list.length, species, filtered)}
      </p>

      {list.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {list.map((a, i) => (
            <li key={`${a.slug}-${a.haartId}`} className="h-full">
              <AnimalCard animal={a} priority={i < 4} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-[62ch] text-body text-[color:var(--text-muted)]">Try clearing a filter. New animals are added most weeks, and every one of them is listed here first.</p>
      )}
    </div>
  );
}
